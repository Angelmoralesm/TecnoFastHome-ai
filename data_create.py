import os
import shutil

def filter_yolo_dataset_final():
    original_dataset_path = r'Datasets/EPP'
    new_dataset_path = r'Datasets/Goggle'
    classes_to_keep = {2: 0, 7: 1} 

    print(f"Iniciando el filtrado (versión corregida) del dataset '{original_dataset_path}'...")
    os.makedirs(new_dataset_path, exist_ok=True)

    for split in ['train', 'valid', 'test']:
        original_labels_dir = os.path.join(original_dataset_path, split, 'labels')
        original_images_dir = os.path.join(original_dataset_path, split, 'images')
        
        if not os.path.exists(original_labels_dir):
            print(f"Advertencia: No se encontró la carpeta '{original_labels_dir}'. Saltando.")
            continue

        new_labels_dir = os.path.join(new_dataset_path, split, 'labels')
        new_images_dir = os.path.join(new_dataset_path, split, 'images')
        os.makedirs(new_labels_dir, exist_ok=True)
        os.makedirs(new_images_dir, exist_ok=True)

        print(f"\nProcesando la carpeta: {split}...")
        
        for label_filename in os.listdir(original_labels_dir):
            if not label_filename.endswith('.txt'):
                continue
            
            try:

                original_label_path = os.path.join(original_labels_dir, label_filename)
                
                with open(original_label_path, 'r') as f:
                    lines = f.readlines()

                new_lines = []
                for line in lines:
                    parts = line.strip().split()
                    if not parts: continue
                    
                    original_class_id = int(parts[0])
                    if original_class_id in classes_to_keep:
                        new_class_id = classes_to_keep[original_class_id]
                        new_lines.append(f"{new_class_id} {' '.join(parts[1:])}")
                
                if new_lines:
                    base_name = os.path.splitext(label_filename)[0]
                    found_image = False
                    for ext in ['.jpg', '.jpeg', '.png']:
                        image_filename = base_name + ext
                        original_image_path = os.path.join(original_images_dir, image_filename)
                        if os.path.exists(original_image_path):
                            new_image_path = os.path.join(new_images_dir, image_filename)
                            new_label_path = os.path.join(new_labels_dir, label_filename)

                            with open(new_label_path, 'w') as f:
                                f.write('\n'.join(new_lines))
                            
                            shutil.copy2(original_image_path, new_image_path)
                            found_image = True
                            break
                    
                    if not found_image:
                        print(f"  -> Advertencia: No se encontró imagen para la etiqueta '{label_filename}'. Saltando.")

            except FileNotFoundError:
                print(f"  -> ERROR: No se pudo acceder a '{label_filename}'. Posiblemente la ruta es muy larga. Se ignora este archivo.")
            except Exception as e:
                print(f"  -> ERROR INESPERADO con '{label_filename}': {e}. Se ignora este archivo.")

        print(f"Carpeta '{split}' procesada.")

    new_yaml_path = os.path.join(new_dataset_path, 'data.yaml')
    with open(new_yaml_path, 'w') as f:
        f.write(f"train: ../{os.path.basename(new_dataset_path)}/train/images\n")
        f.write(f"val: ../{os.path.basename(new_dataset_path)}/valid/images\n")
        f.write(f"test: ../{os.path.basename(new_dataset_path)}/test/images\n\n")
        f.write("nc: 2\n")
        f.write("names: ['Goggles', 'NO-Goggles']\n")
    
    print(f"\n¡Proceso completado! Tu nuevo dataset está en '{new_dataset_path}'")

if __name__ == '__main__':
    filter_yolo_dataset_final()
