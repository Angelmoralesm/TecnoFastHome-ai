# app.py

import cv2, os, time, sys
import numpy as np
import onnxruntime as ort
from flask import Flask, Response

# ======================
# CONFIG BÁSICA
# ======================
MODEL_PATH     = "best2.onnx"
IMG_SIZE       = 640

# sensibilidad / NMS0
SCORE_THR      = 0.30     # puedes cambiar en vivo con [ y ]
TOPK           = 600
NMS_IOU_THR    = 0.45
MIN_BOX_AREA   = 0       # píxeles mínimos de caja (0 desactiva)

# índice de clase FUEGO dentro 0
# de los canales de clase
FIRE_CLASS_IDX = 0  # si tu export es [humo, fuego], cámbialo a 1

# ======================
# UTILIDADES
# ======================
def list_cameras(max_index=10, test_frames=5):
    print("[INFO] Buscando cámaras disponibles...")
    found = []
    for i in range(max_index):
        cap = cv2.VideoCapture(i)
        if not cap.isOpened():
            continue
        ok_any = False
        for _ in range(test_frames):
            ok, _ = cap.read()
            if ok:
                ok_any = True
                break
        cap.release()
        if ok_any:
            found.append(i)
            print(f"  - Cámara #{i}")
    return found

def choose_camera():
    cams = list_cameras()
    if not cams:
        raise RuntimeError("No se encontraron cámaras.")
    while True:
        try:
            idx = int(input(f"Elige cámara {cams}: "))
            if idx in cams:
                return idx
            print("Índice no válido.")
        except Exception:
            print("Ingresa un número válido.")

def letterbox(im, new_size=640, color=(114,114,114)):
    h0, w0 = im.shape[:2]
    r = min(new_size / h0, new_size / w0)
    nw, nh = int(round(w0 * r)), int(round(h0 * r))
    im_resized = cv2.resize(im, (nw, nh), interpolation=cv2.INTER_LINEAR)
    top = (new_size - nh) // 2
    bottom = new_size - nh - top
    left = (new_size - nw) // 2
    right = new_size - nw - left
    im_padded = cv2.copyMakeBorder(im_resized, top, bottom, left, right,
                                   cv2.BORDER_CONSTANT, value=color)
    return im_padded, r, left, top

def unletterbox_boxes(boxes_xyxy, r, padL, padT):
    if len(boxes_xyxy) == 0: return boxes_xyxy
    b = boxes_xyxy.copy()
    b[:, [0, 2]] -= padL
    b[:, [1, 3]] -= padT
    b /= r
    return b

def xywh_to_xyxy(xywh):
    cx, cy, w, h = xywh.T
    x1 = cx - w/2; y1 = cy - h/2; x2 = cx + w/2; y2 = cy + h/2
    return np.stack([x1, y1, x2, y2], axis=1)

def nms(boxes, scores, iou_thr=0.45):
    if len(boxes) == 0: return []
    boxes = boxes.astype(np.float32)
    x1,y1,x2,y2 = boxes.T
    areas = (x2-x1+1)*(y2-y1+1)
    order = scores.argsort()[::-1]
    keep=[]
    while order.size>0:
        i=order[0]; keep.append(i)
        xx1=np.maximum(x1[i],x1[order[1:]])
        yy1=np.maximum(y1[i],y1[order[1:]])
        xx2=np.minimum(x2[i],x2[order[1:]])
        yy2=np.minimum(y2[i],y2[order[1:]])
        w=np.maximum(0.0,xx2-xx1+1)
        h=np.maximum(0.0,yy2-yy1+1)
        inter=w*h
        iou=inter/(areas[i]+areas[order[1:]]-inter+1e-6)
        inds=np.where(iou<=iou_thr)[0]
        order=order[inds+1]
    return keep

def sigmoid(x): 
    return 1.0/(1.0+np.exp(-x))

def is_prob(arr):
    mn, mx = float(np.min(arr)), float(np.max(arr))
    return mn >= -1e-6 and mx <= 1.0 + 1e-6

def draw_box(frame, box, score, label="🔥 Fuego"):
    x1,y1,x2,y2 = map(int, box)
    x1 = max(0, min(x1, frame.shape[1]-1))
    x2 = max(0, min(x2, frame.shape[1]-1))
    y1 = max(0, min(y1, frame.shape[0]-1))
    y2 = max(0, min(y2, frame.shape[0]-1))
    cv2.rectangle(frame, (x1,y1), (x2,y2), (0,0,255), 2)
    txt = f"{label} {score:.2f}"
    (tw,th), _ = cv2.getTextSize(txt, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
    cv2.rectangle(frame, (x1, y1 - th - 8), (x1 + tw + 6, y1), (0,0,255), -1)
    cv2.putText(frame, txt, (x1+3, y1-5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)

def parse_outputs(out, fire_idx):
    arr = np.asarray(out, dtype=np.float32)
    if arr.ndim == 3 and arr.shape[1] < arr.shape[2]:
        arr = arr
    elif arr.ndim == 3 and arr.shape[2] < arr.shape[1]:
        arr = arr.transpose(0,2,1)
    else:
        raise ValueError(f"Forma de salida no soportada: {arr.shape}")

    C = arr.shape[1]
    preds = arr[0]

    if C not in (6,7):
        has_obj = (C >= 7)
    else:
        has_obj = (C == 7)

    xywh = preds[0:4, :].T
    if has_obj:
        obj = preds[4:5, :].T[:,0]
        cls = preds[5: , :].T
        fire_logits = cls[:, fire_idx]
        fire_prob = fire_logits if is_prob(fire_logits) else sigmoid(fire_logits)
        obj_prob  = obj if is_prob(obj) else sigmoid(obj)
        score_final = obj_prob * fire_prob
    else:
        cls = preds[4:, :].T
        fire_logits = cls[:, fire_idx]
        fire_prob = fire_logits if is_prob(fire_logits) else sigmoid(fire_logits)
        obj_prob = None
        score_final = fire_prob

    boxes = xywh_to_xyxy(xywh)
    boxes[:,[0,2]] = np.clip(boxes[:,[0,2]], 0, IMG_SIZE-1)
    boxes[:,[1,3]] = np.clip(boxes[:,[1,3]], 0, IMG_SIZE-1)

    return {
        "boxes_xyxy_640": boxes,
        "fire_prob": fire_prob,
        "obj_prob": obj_prob,
        "score_final": score_final,
        "has_obj": has_obj
    }

# ======================
# FLASK APP
# ======================
app = Flask(__name__)

# Cargar el modelo ONNX solo una vez
try:
    sess = ort.InferenceSession(MODEL_PATH, providers=["CPUExecutionProvider"])
    in_meta = sess.get_inputs()[0]
    in_name = in_meta.name
    out_name = sess.get_outputs()[0].name
    print(f"[INFO] Modelo ONNX cargado: Entrada {in_meta.shape} | Salida {out_name}")
except Exception as e:
    print(f"[ERROR] No se pudo cargar el modelo ONNX: {e}")
    sess = None

# Usar la cámara con índice 0 (por defecto)
CAM_INDEX = 0
print(f"[INFO] Usando cámara #{CAM_INDEX} (configurada por defecto)")

def generate_frames():
    if CAM_INDEX is None or sess is None:
        return

    cap = cv2.VideoCapture(CAM_INDEX)
    if not cap.isOpened():
        print("[ERROR] No se pudo abrir la cámara.")
        return

    prev = time.time()
    fps = 0.0

    while True:
        ok, frame = cap.read()
        if not ok: break

        lb, r, padL, padT = letterbox(frame, IMG_SIZE)
        inp = cv2.cvtColor(lb, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
        inp = np.transpose(inp, (2,0,1))[None, ...]

        out = sess.run([out_name], {in_name: inp})[0]
        parsed = parse_outputs(out, FIRE_CLASS_IDX)
        boxes = parsed["boxes_xyxy_640"]
        score = parsed["score_final"]
        boxes_orig = unletterbox_boxes(boxes, r, padL, padT)

        keep = score > SCORE_THR
        boxes_f = boxes_orig[keep]
        score_f = score[keep]

        if MIN_BOX_AREA > 0 and len(boxes_f) > 0:
            areas = (boxes_f[:,2]-boxes_f[:,0]) * (boxes_f[:,3]-boxes_f[:,1])
            keep2 = areas >= MIN_BOX_AREA
            boxes_f = boxes_f[keep2]
            score_f = score_f[keep2]

        if boxes_f.shape[0] > TOPK:
            idx = np.argsort(score_f)[-TOPK:]
            boxes_f = boxes_f[idx]
            score_f = score_f[idx]

        idxn = nms(boxes_f, score_f, NMS_IOU_THR)
        boxes_f = boxes_f[idxn]
        score_f = score_f[idxn]

        for b, sc in zip(boxes_f, score_f):
            draw_box(frame, b, sc, "🔥 Fuego")
        
        now = time.time(); dt = now - prev; prev = now
        if dt > 0:
            fps = 0.9 * fps + 0.1 * (1.0 / dt)
            cv2.putText(frame, f"{fps:.1f} FPS", (10, 28),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    # Configurar puerto desde argumentos de línea de comandos
    port = 5000  # Puerto por defecto
    if len(sys.argv) > 1 and sys.argv[1] == '--port':
        try:
            port = int(sys.argv[2])
        except (IndexError, ValueError):
            print(f"[ERROR] Puerto inválido. Usando puerto por defecto: {port}")

    print(f"[INFO] Iniciando servidor en puerto {port}")
    app.run(host='0.0.0.0', port=port, threaded=True)