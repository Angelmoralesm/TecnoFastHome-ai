import cv2, sys, time, numpy as np
from flask import Flask, Response
from ultralytics import YOLO

# ======================
# CONFIGURACIÓN
# ======================
MODEL_PATH = "public/best_glasses.pt"
IMG_SIZE = 640
TARGET_FPS = 10
CONFIDENCE_THRESHOLD = 0.40
CLASS_NAMES = ['glasses']
COLOR_DETECTED = (0, 255, 0)
COLOR_NOT_DETECTED = (0, 0, 255)
URL_RTSP = "rtsp://admin:iWAK5wAs2KA2j@f@192.168.1.108:554/cam/realmonitor?channel=1&subtype=0"

# ======================
# FLASK APP
# ======================
app = Flask(__name__)

# Cargar el modelo YOLO solo una vez
try:
    model = YOLO(MODEL_PATH)
    print(f"[INFO] Modelo YOLO cargado: {MODEL_PATH}")
except Exception as e:
    print(f"[ERROR] No se pudo cargar el modelo YOLO: {e}")
    model = None

# Usar la cámara con índice 0 (por defecto)
CAM_INDEX = 0
print(f"[INFO] Usando cámara #{CAM_INDEX} (configurada por defecto)")

def generate_frames():
    if model is None:
        return

    # Usar la URL de RTSP en lugar del índice de cámara
    cap = cv2.VideoCapture(URL_RTSP)
    if not cap.isOpened():
        print("[ERROR] No se pudo abrir la cámara RTSP.")
        return

    prev = time.time()
    fps = 0.0

    while True:
        ok, frame = cap.read()
        if not ok:
            print("[ERROR] No se pudo leer el frame de la cámara RTSP.")
            break

        # Detección de lentes
        glasses_detected_in_frame = False
        results = model(frame, stream=True, verbose=False, conf=CONFIDENCE_THRESHOLD)
        for r in results:
            boxes = r.boxes
            for box in boxes:
                conf = float(box.conf[0])
                if conf > CONFIDENCE_THRESHOLD:
                    glasses_detected_in_frame = True
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    cv2.rectangle(frame, (x1, y1), (x2, y2), COLOR_DETECTED, 2)
                    cv2.putText(frame, f"Glasses {conf:.2f}", (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, COLOR_DETECTED, 2)

        if not glasses_detected_in_frame:
            h, w, _ = frame.shape
            cv2.rectangle(frame, (0, 0), (w-1, h-1), COLOR_NOT_DETECTED, 10)
            cv2.putText(frame, "NO GLASSES", (30, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, COLOR_NOT_DETECTED, 4)

        # Mostrar FPS en pantalla
        now = time.time()
        dt = now - prev
        prev = now
        if dt > 0:
            fps = 0.9 * fps + 0.1 * (1.0 / dt)
            cv2.putText(frame, f"{fps:.1f} FPS", (10, 28),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()
    cv2.destroyAllWindows()

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    # Configurar puerto desde argumentos de línea de comandos
    port = 5001  # Puerto por defecto
    if len(sys.argv) > 1 and sys.argv[1] == '--port':
        try:
            port = int(sys.argv[2])
        except (IndexError, ValueError):
            print(f"[ERROR] Puerto inválido. Usando puerto por defecto: {port}")

    print(f"[INFO] Iniciando servidor en puerto {port}")
    app.run(host='0.0.0.0', port=port, threaded=True)