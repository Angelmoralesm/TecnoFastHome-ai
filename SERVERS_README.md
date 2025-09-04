# Servidores de Detección de IA - Guía de Configuración

## 📋 Resumen
El sistema ejecuta **dos modelos de IA diferentes** en la **misma cámara física** (índice 0):

- **Puerto 5000**: `main.py` - Detección de Incendios (YOLOv8 - modelo best2.onnx)
- **Puerto 5001**: `EPP.py` - Detección de EPP/Seguridad (YOLOv8 - modelo best.onnx)

**Ambos servidores usan la misma cámara física** pero procesan el video con modelos diferentes.

## 🚀 Inicio Rápido

### Opción 1: Script Batch (Windows)
```batch
cd public
start_servers.bat
```

### Opción 2: Script PowerShell (Windows)
```powershell
cd public
.\start_servers.ps1
```

### Opción 3: Inicio Manual
```bash
# Terminal 1 - Detección de Incendios
python public/main.py --port 5000

# Terminal 2 - Detección de EPP/Seguridad
python public/EPP.py --port 5001
```

## 🔧 Configuración del Dashboard

### Cambios Realizados

1. **VideoFeed Component** (`src/components/VideoFeed.tsx`):
   - Ahora acepta prop `port` opcional
   - Por defecto usa puerto 5000

2. **Dashboard** (`src/pages/dashboard.tsx`):
   - Función `getCameraPort()` determina puerto según ID de cámara
   - Usa campo `aiServerPort` de los datos de la cámara

3. **Tipos TypeScript** (`src/types/dashboard.ts`):
   - Agregado campo `aiServerPort` a interfaz `Camera`

4. **Datos Mock** (`src/data/mockData.ts`):
   - Cámara 1: `aiServerPort: 5000`
   - Cámara 2: `aiServerPort: 5001`

## 📡 Endpoints Disponibles

- **Detección de Incendios** (`main.py`): `http://localhost:5000/video_feed`
- **Detección de EPP/Seguridad** (`EPP.py`): `http://localhost:5001/video_feed`

## 🎯 Arquitectura

```
┌─────────────────────────────────────────────────┐
│              CÁMARA FÍSICA (ÍNDICE 0)           │
│                Webcam/Webcam externa            │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼──────┐   ┌────────▼──────┐
│   main.py    │   │    EPP.py     │
│ Puerto 5000  │   │ Puerto 5001   │
│              │   │               │
│ Modelo:      │   │ Modelo:       │
│ best2.onnx   │   │ best.onnx     │
│              │   │               │
│ Detección de │   │ Detección de  │
│ INCENDIOS    │   │ EPP/SEGURIDAD │
└───────┬──────┘   └───────┬───────┘
        │                   │
┌───────▼──────┐   ┌────────▼──────┐
│ Dashboard    │   │ Dashboard     │
│ Cámara 1     │   │ Cámara 2      │
│ (Fuego)      │   │ (EPP)         │
└──────────────┘   └───────────────┘
```

## 🔍 Verificación

Para verificar que los servidores están corriendo:

```batch
netstat -ano | findstr "5000\|5001"
```

O visita las URLs directamente en tu navegador.

## 🛠️ Solución de Problemas

### Puerto ya en uso
```batch
# Ver qué proceso usa el puerto
netstat -ano | findstr :5000
netstat -ano | findstr :5001

# Matar proceso si es necesario
taskkill /PID <PID> /F
```

### Error de modelo ONNX
- Verifica que los archivos `.onnx` estén en `public/`:
  - **main.py** (puerto 5000): usa `best2.onnx` para detección de incendios
  - **EPP.py** (puerto 5001): usa `best.onnx` para detección de EPP

### Error de cámara
- Verifica que la cámara con índice 0 esté disponible
- Ambos servidores intentan acceder a la misma cámara física
- Si hay conflictos de acceso, solo uno podrá usar la cámara a la vez
- En Windows, cierra otras aplicaciones que puedan estar usando la webcam

## 📝 Notas Técnicas

- **Dos modelos diferentes**: `main.py` usa `best2.onnx` para fuego, `EPP.py` usa `best.onnx` para EPP
- **Misma cámara física**: Ambos servidores acceden a la cámara con índice 0
- **Servidores independientes**: Cada uno corre en su propio proceso y puerto
- **Dashboard inteligente**: Se conecta automáticamente al puerto correcto según la cámara seleccionada

## 🎯 Limitaciones Actuales

- **Acceso a cámara**: Solo un servidor puede acceder a la webcam a la vez
- **Recursos del sistema**: Dos modelos corriendo simultáneamente consumen más CPU/GPU
- **Sincronización**: No hay comunicación entre los dos servidores

## 🚀 Próximos Pasos

- Implementar rotación automática entre modelos cuando sea necesario
- Agregar health checks para verificar estado de ambos servidores
- Implementar logging centralizado para debugging
- Considerar optimizaciones de performance (GPU sharing, etc.)
- Evaluar posibilidad de usar un solo servidor con múltiples modelos
