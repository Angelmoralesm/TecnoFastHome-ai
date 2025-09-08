from ultralytics import YOLO
import torch

def train_goggles_detector():
    print("Cargando el modelo base yolov8n.pt...")
    model = YOLO('yolov8n.pt')

    print("Iniciando el entrenamiento del modelo...")
    try:
        results = model.train(
            data='Datasets/Goggle/data.yaml',  
            epochs=50,                
            imgsz=640,                 

            name='goggles_detector_final', 
            
            device=0 if torch.cuda.is_available() else 'cpu' 
        )
        print("¡Entrenamiento completado exitosamente!")
        
        print(f"Los resultados y el modelo entrenado se han guardado en: {results.save_dir}")
        print(f"Tu mejor modelo se encuentra en: {results.save_dir}/weights/best.pt")

    except Exception as e:
        print(f"Ocurrió un error durante el entrenamiento por la ctm: {e}")

if __name__ == '__main__':
    train_goggles_detector()