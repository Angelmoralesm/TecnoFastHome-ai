# app.py

import cv2, os, time, sys
import numpy as np
import onnxruntime as ort
from flask import Flask, Response

# ======================
# CONFIG BÁSICA
# ======================
MODEL_PATH     = "modelo2.onnx" # Asegúrate que tu modelo ONNX para objetos esté aquí
IMG_SIZE       = 640

# Sensibilidad / NMS
SCORE_THR      = 0.50     # Umbral de confianza para mostrar una detección
NMS_IOU_THR    = 0.45     # Umbral de IoU para Non-Maximum Suppression

# ======================
# CLASES Y COLORES (MODIFICADO)
# ======================
# Extraído de tu archivo data.yaml
CLASS_NAMES = ['Helmet', 'Mask', 'NO-Helmet', 'NO-Mask', 'NO-Safety Vest', 'Safety Cone', 'Safety Vest']
# Se genera una lista de colores BGR aleatorios para cada clase
COLORS = np.random.uniform(0, 255, size=(len(CLASS_NAMES), 3))

# ======================
# UTILIDADES (Sin cambios)
# ======================
def list_cameras(max_index=10, test_frames=5):
    """Encuentra y lista todas las cámaras de video disponibles."""
    print("[INFO] Buscando cámaras disponibles...")
    found = []
    for i in range(max_index):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            # Probar leyendo algunos frames para asegurar que la cámara funciona
            ok_any = any(cap.read()[0] for _ in range(test_frames))
            cap.release()
            if ok_any:
                found.append(i)
                print(f"  - Cámara encontrada en el índice #{i}")
    return found

def choose_camera():
    """Permite al usuario elegir una cámara de la lista de cámaras encontradas."""
    cams = list_cameras()
    if not cams:
        raise RuntimeError("No se encontraron cámaras funcionales.")
    if len(cams) == 1:
        print(f"[INFO] Se usará automáticamente la única cámara encontrada: #{cams[0]}")
        return cams[0]
    while True:
        try:
            idx = int(input(f"Elige el índice de la cámara a usar {cams}: "))
            if idx in cams:
                return idx
            print("Índice no válido. Por favor, elige uno de la lista.")
        except (ValueError, TypeError):
            print("Entrada no válida. Por favor, ingresa un número.")

def letterbox(im, new_size=640, color=(114,114,114)):
    """Redimensiona y añade padding a una imagen para que se ajuste al tamaño de entrada del modelo."""
    shape = im.shape[:2]  # alto, ancho actual
    r = min(new_size / shape[0], new_size / shape[1])
    new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
    dw, dh = new_size - new_unpad[0], new_size - new_unpad[1]
    dw /= 2; dh /= 2
    
    if shape[::-1] != new_unpad:
        im = cv2.resize(im, new_unpad, interpolation=cv2.INTER_LINEAR)
    
    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
    im = cv2.copyMakeBorder(im, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)
    return im, r, (left, top)

def unletterbox_boxes(boxes_xyxy, r, pad):
    """Revierte la operación de letterbox en las coordenadas de las cajas."""
    if len(boxes_xyxy) == 0: return boxes_xyxy
    boxes_xyxy[:, [0, 2]] -= pad[0]
    boxes_xyxy[:, [1, 3]] -= pad[1]
    boxes_xyxy /= r
    return boxes_xyxy

def xywh_to_xyxy(xywh):
    """Convierte cajas de formato [centro_x, centro_y, ancho, alto] a [x1, y1, x2, y2]."""
    cx, cy, w, h = xywh.T
    return np.stack([cx - w/2, cy - h/2, cx + w/2, cy + h/2], axis=1)

def nms(boxes, scores, iou_thr=0.45):
    """Aplica Non-Maximum Suppression para eliminar cajas redundantes."""
    if len(boxes) == 0: return []
    x1, y1, x2, y2 = boxes.T
    areas = (x2 - x1) * (y2 - y1)
    order = scores.argsort()[::-1]
    keep = []
    while order.size > 0:
        i = order[0]
        keep.append(i)
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])
        w = np.maximum(0.0, xx2 - xx1)
        h = np.maximum(0.0, yy2 - yy1)
        inter = w * h
        iou = inter / (areas[i] + areas[order[1:]] - inter + 1e-6)
        inds = np.where(iou <= iou_thr)[0]
        order = order[inds + 1]
    return keep

def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-x))

# ======================
# FUNCIÓN DE DIBUJO (MODIFICADA)
# ======================
def draw_box(frame, box, score, class_id):
    """Dibuja una caja de detección, etiqueta y puntuación en un frame."""
    x1, y1, x2, y2 = map(int, box)
    color = COLORS[class_id]
    label = CLASS_NAMES[class_id]
    
    # Dibuja la caja
    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
    
    # Prepara el texto de la etiqueta
    txt = f"{label} {score:.2f}"
    (tw, th), _ = cv2.getTextSize(txt, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
    
    # Dibuja un fondo para la etiqueta
    cv2.rectangle(frame, (x1, y1 - th - 8), (x1 + tw + 6, y1), color, -1)
    # Dibuja el texto de la etiqueta
    cv2.putText(frame, txt, (x1 + 3, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

# ======================
# PARSEO DE SALIDA (MODIFICADO)
# ======================
def parse_outputs(out):
    """Procesa la salida cruda del modelo ONNX para obtener cajas, puntuaciones y clases."""
    # Transponer la salida para que las predicciones estén en filas
    # Formato esperado: [batch, 4_coords + num_classes, num_predictions] -> [batch, num_predictions, 4_coords + num_classes]
    preds = np.transpose(out[0], (1, 0))

    # Extraer las coordenadas de las cajas y las puntuaciones de clase
    boxes_xywh = preds[:, :4]
    scores_all = preds[:, 4:]

    # Encontrar la clase con la puntuación más alta para cada predicción
    class_ids = np.argmax(scores_all, axis=1)
    conf_scores = np.max(scores_all, axis=1)
    
    # La salida de algunos modelos no está en formato de probabilidad, aplicar sigmoide si es necesario
    if not (np.min(conf_scores) >= 0 and np.max(conf_scores) <= 1):
        conf_scores = sigmoid(conf_scores)

    # Convertir cajas a formato [x1, y1, x2, y2]
    boxes_xyxy = xywh_to_xyxy(boxes_xywh)
    
    return boxes_xyxy, conf_scores, class_ids

# ======================
# FLASK APP
# ======================
app = Flask(__name__)

# Cargar el modelo ONNX al iniciar la aplicación
try:
    sess = ort.InferenceSession(MODEL_PATH, providers=["CPUExecutionProvider"])
    in_meta = sess.get_inputs()[0]
    in_name = in_meta.name
    out_name = sess.get_outputs()[0].name
    print(f"[INFO] Modelo ONNX cargado correctamente desde '{MODEL_PATH}'")
    print(f"       - Entrada: '{in_name}', Shape: {in_meta.shape}")
    print(f"       - Salida: '{out_name}'")
except Exception as e:
    print(f"[ERROR] No se pudo cargar el modelo ONNX desde '{MODEL_PATH}': {e}")
    sess = None

# Usar la cámara con índice 0 (por defecto)
CAM_INDEX = 0
print(f"[INFO] Usando cámara con índice #{CAM_INDEX} (configurada por defecto)")

def generate_frames():
    """Generador de frames de video con detección de objetos."""
    if CAM_INDEX is None or sess is None:
        print("[ERROR] No se puede iniciar el stream: cámara no seleccionada o modelo no cargado.")
        return

    cap = cv2.VideoCapture(CAM_INDEX)
    if not cap.isOpened():
        print(f"[ERROR] No se pudo abrir la cámara #{CAM_INDEX}.")
        return

    prev_time, fps = time.time(), 0.0
    while True:
        ok, frame = cap.read()
        if not ok:
            print("[INFO] Fin del stream de video.")
            break

        # 1. Preprocesar el frame
        img_letterboxed, r, (padL, padT) = letterbox(frame, IMG_SIZE)
        inp = cv2.cvtColor(img_letterboxed, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
        inp = np.transpose(inp, (2, 0, 1))[None, ...]

        # 2. Realizar la inferencia
        out = sess.run([out_name], {in_name: inp})[0]
        
        # 3. Procesar los resultados
        boxes_scaled, scores, class_ids = parse_outputs(out)
        
        # 4. Revertir el letterbox para obtener coordenadas originales
        boxes_orig = unletterbox_boxes(boxes_scaled, r, (padL, padT))

        # 5. Filtrar detecciones por umbral de confianza
        keep = scores > SCORE_THR
        boxes_filtered = boxes_orig[keep]
        scores_filtered = scores[keep]
        class_ids_filtered = class_ids[keep]

        # 6. Aplicar Non-Maximum Suppression
        final_indices = nms(boxes_filtered, scores_filtered, NMS_IOU_THR)
        
        # 7. Dibujar las cajas finales en el frame original
        for i in final_indices:
            draw_box(frame, boxes_filtered[i], scores_filtered[i], class_ids_filtered[i])
        
        # Calcular y mostrar FPS
        current_time = time.time()
        dt = current_time - prev_time
        prev_time = current_time
        if dt > 0:
            fps = 0.9 * fps + 0.1 * (1.0 / dt)
            cv2.putText(frame, f"{fps:.1f} FPS", (10, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 3)
            cv2.putText(frame, f"{fps:.1f} FPS", (10, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

        # Codificar el frame para el streaming
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    
    cap.release()

@app.route('/video_feed')
def video_feed():
    """Ruta que sirve el stream de video."""
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    # Configurar puerto desde argumentos de línea de comandos
    port = 5000  # Puerto por defecto
    if len(sys.argv) > 1 and sys.argv[1] == '--port':
        try:
            port = int(sys.argv[2])
        except (IndexError, ValueError):
            print(f"[ERROR] Puerto inválido. Usando puerto por defecto: {port}")

    print(f"[INFO] Iniciando servidor Flask en puerto {port}...")
    print(f"[INFO] Abre tu navegador en http://127.0.0.1:{port}/video_feed (o la IP de tu máquina)")
    app.run(host='0.0.0.0', port=port, threaded=True)

