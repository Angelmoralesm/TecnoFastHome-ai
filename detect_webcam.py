import cv2
import time
from ultralytics import YOLO
import math

# --- CONFIGURACIÓN ---
# 1. RUTA AL MODELO
#    Asegúrate de que esta ruta apunte a tu modelo .pt o .onnx entrenado con una sola clase
MODEL_PATH = 'best_glasses.pt'

# 2. PARÁMETROS DE DETECCIÓN
TARGET_FPS = 10
CONFIDENCE_THRESHOLD = 0.40  # Umbral de confianza general para la detección

# 3. DEFINICIÓN DE CLASE Y COLORES (BGR)
CLASS_NAMES = ['glasses'] # Tu única clase de entrenamiento
COLOR_DETECTED = (0, 255, 0)    # Verde para cuando SÍ detecta lentes
COLOR_NOT_DETECTED = (0, 0, 255) # Rojo para cuando NO detecta lentes
# ---------------------

def run_single_class_detection_with_border():
    try:
        model = YOLO(MODEL_PATH)
        print("Modelo cargado exitosamente.")
    except Exception as e:
        print(f"Error al cargar el modelo: {e}")
        return

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: No se pudo abrir la cámara.")
        return

    frame_time = 1 / TARGET_FPS
    prev_time = 0

    print("Iniciando detección... Presiona 'q' para salir.")

    while True:
        time_elapsed = time.time() - prev_time
        if time_elapsed < frame_time:
            time.sleep(frame_time - time_elapsed)
        
        current_time = time.time()
        fps = 1 / (current_time - prev_time)
        prev_time = current_time
        
        success, frame = cap.read()
        if not success:
            break

        glasses_detected_in_frame = False

        results = model(frame, stream=True, verbose=False, conf=CONFIDENCE_THRESHOLD)

        for r in results:
            boxes = r.boxes
            if len(boxes) > 0:
                glasses_detected_in_frame = True
            
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = float(box.conf[0])
                label = f'{CLASS_NAMES[0]}: {confidence:.2f}'

                cv2.rectangle(frame, (x1, y1), (x2, y2), COLOR_DETECTED, 2)
                cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, COLOR_DETECTED, 2)

        # --- Lógica de Estado y Borde de Alerta ---
        if glasses_detected_in_frame:
            status_text = "STATUS: Con Lentes"
            status_color = COLOR_DETECTED
        else:
            status_text = "STATUS: Sin Lentes"
            status_color = COLOR_NOT_DETECTED
            
            # --- ¡NUEVO! Dibuja un borde rojo alrededor de toda la pantalla ---
            h, w, _ = frame.shape
            cv2.rectangle(frame, (0, 0), (w - 1, h - 1), status_color, 10) # 10 es el grosor del borde

        cv2.putText(frame, status_text, (10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.2, status_color, 3)
        cv2.putText(frame, f"FPS: {int(fps)}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.imshow("Deteccion de Lentes", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()
    print("Detección finalizada.")

if __name__ == '__main__':
    run_single_class_detection_with_border()