# 🚨 Sistema de Monitoreo con IA - Guía para Principiantes

¡Bienvenido! Este sistema usa Inteligencia Artificial para detectar incendios y verificar equipos de protección personal (EPP) en tiempo real. Sigue estos pasos simples para comenzar.

## 📋 Antes de Empezar

### ✅ Requisitos Mínimos
- **Computadora con Windows** (10 o superior)
- **Cámara web** conectada (interna o externa)
- **Conexión a internet** para la primera instalación

### 📦 ¿Qué Hace Este Sistema?
- **Detecta incendios automáticamente** usando IA avanzada
- **Verifica que los trabajadores usen EPP** (cascos, guantes, etc.)
- **Envía alertas en tiempo real** cuando detecta problemas
- **Muestra video en vivo** desde tu cámara

## 🚀 Guía Paso a Paso

### Paso 1: Preparar el Sistema

1. **Descarga e instala Python** (si no lo tienes):
   - Ve a https://www.python.org/downloads/
   - Descarga la versión más reciente (3.8 o superior)
   - **IMPORTANTE**: Marca la casilla "Add Python to PATH" durante la instalación

2. **Instala dependencias necesarias**:
   - Abre la carpeta del proyecto
   - Ejecuta el script de instalación automática

### Paso 2: Ejecutar el Sistema

#### 🔘 Opción Fácil (Recomendada)
1. **Haz doble clic** en `iniciar_sistema.bat`
2. **Espera** a que se abra la ventana negra
3. **Sigue las instrucciones** en pantalla

#### 🔧 Opción Manual (Si la automática no funciona)
1. Abre una **ventana de comandos** (busca "cmd" en el menú inicio)
2. Escribe estos comandos uno por uno:

```cmd
# Instalar dependencias
pip install flask opencv-python onnxruntime

# Iniciar los servidores de IA
cd public
start_servers.bat
```

### Paso 3: Usar el Dashboard

1. **Después de ejecutar el script**, se abrirá automáticamente tu navegador
2. **Verás dos tarjetas de cámaras**:
   - **Cámara 1**: Para detectar incendios
   - **Cámara 2**: Para verificar EPP

3. **Haz clic en "Ver Cámara"** en cualquiera de las tarjetas
4. **¡Listo!** Verás el video en vivo con detección automática

## 🎥 Cómo Usar Cada Cámara

### Cámara de Incendios
- **Muestra**: Video con detección de fuego y humo
- **Alertas**: Se activan cuando detecta llamas o humo
- **Indicador**: 🔥 (emoji de fuego)

### Cámara de EPP
- **Muestra**: Video con detección de equipos de seguridad
- **Alertas**: Se activan cuando falta casco, guantes, etc.
- **Indicador**: 🛡️ (emoji de escudo)

## ⚠️ Solución de Problemas

### "La ventana se cierra automáticamente"
**Este es el problema más común.** Si el script se cierra sin que puedas ver nada:

1. **Ejecuta como Administrador:**
   - Clic derecho en `iniciar_sistema.bat`
   - Seleccionar "Ejecutar como administrador"

2. **Verifica la ubicación:**
   - Asegúrate de estar en la carpeta correcta
   - Debe contener: `package.json`, `public/`, `src/`

3. **Ejecuta primero la verificación:**
   ```cmd
   verificar_sistema.bat
   ```

4. **Lee los mensajes de error** que aparecen

### "Python no se reconoce"
- Reinicia tu computadora
- Vuelve a instalar Python con la opción "Add to PATH"

### "No se puede abrir la cámara"
- Asegúrate de que tu cámara esté conectada
- Cierra otras aplicaciones que usen la cámara (Zoom, Teams, etc.)
- Prueba con una cámara diferente

### "Error al cargar modelo"
- Verifica que estés ejecutando desde la carpeta correcta
- Asegúrate de que todos los archivos estén en la carpeta `public/`

### "El sistema no responde"
- Cierra todas las ventanas
- Reinicia el proceso desde el inicio
- Si persiste, contacta al administrador del sistema

## 🛑 Para Detener el Sistema

1. **Presiona Ctrl+C** en cada ventana negra que esté abierta
2. **O simplemente cierra las ventanas**
3. El sistema se detendrá automáticamente

## 📞 Soporte Técnico

Si tienes problemas:
1. **Lee esta guía completa** primero
2. **Verifica los requisitos** del sistema
3. **Sigue los pasos en orden**
4. Si aún no funciona, pide ayuda a tu supervisor técnico

## 🎯 Consejos Útiles

- ✅ **Mantén la cámara limpia** para mejor detección
- ✅ **Buena iluminación** mejora la precisión de la IA
- ✅ **No tapes la lente** de la cámara
- ✅ **Cierra otras aplicaciones** que usen la cámara
- ✅ **Reinicia el sistema** si hay problemas

---

¡Tu sistema de seguridad inteligente está listo para proteger tu área de trabajo! 🛡️🔥
