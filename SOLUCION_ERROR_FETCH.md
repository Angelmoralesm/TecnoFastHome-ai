# 🔧 Solución al Error "Failed to fetch"

## ❌ Error que estás viendo

```
Runtime TypeError: Failed to fetch
at checkMonitorIaApiHealth (src/services/monitorIaApi.ts:123:28)
```

## ✅ ¿Qué significa?

Este error ocurre porque **TecnoHome-AI no puede conectarse con Monitor-IA**. 

La aplicación está intentando conectarse a `http://localhost:3001`, pero el servidor de Monitor-IA no está ejecutándose.

## 🚀 Solución (2 Pasos)

### Paso 1: Inicia Monitor-IA

Abre una **nueva terminal** y ejecuta:

```bash
cd monitor-ia/api-backend
node index.js
```

**Deberías ver:**
```
Backend escuchando en el puerto 3001
📱 Sistema de notificaciones WhatsApp activo (Cooldown: 30s)
🔗 Servicio WhatsApp Bot: http://whatsapp-bot:3002
```

### Paso 2: Recarga la Página

Ahora vuelve a tu navegador y recarga la página de configuración:
- URL: `http://localhost:3000/config-ia`
- El badge debería cambiar de 🔴 **"API Desconectada"** a 🟢 **"API Conectada"**

## ✅ ¡Listo!

Ahora deberías poder:
- Ver la configuración actual
- Modificar parámetros
- Guardar cambios
- Enviar mensajes de prueba

---

## 🔍 Verificación

### ¿Cómo saber si Monitor-IA está corriendo?

**Opción 1:** Revisa la terminal donde ejecutaste `node index.js`
- Deberías ver el mensaje "Backend escuchando en el puerto 3001"

**Opción 2:** Abre tu navegador en `http://localhost:3001/api/config`
- Deberías ver un JSON con la configuración

**Opción 3:** Verifica el puerto en Windows:
```cmd
netstat -ano | findstr :3001
```

**Opción 3 (Linux/Mac):**
```bash
lsof -i :3001
# o
netstat -an | grep 3001
```

---

## 🎯 Flujo Correcto de Inicio

Para usar la integración correctamente, necesitas **DOS terminales**:

### Terminal 1: Monitor-IA Backend
```bash
cd C:\Things\CODE\TecnoHome\monitor-ia\api-backend
node index.js
```
✅ Déjala ejecutándose (NO la cierres)

### Terminal 2: TecnoHome-AI Frontend
```bash
cd C:\Things\CODE\TecnoHome\tecnohome-ai
npm run dev
```
✅ Déjala ejecutándose (NO la cierres)

---

## ⚙️ Lo que se Mejoró

He actualizado el código para que:

✅ **No crashee** cuando Monitor-IA no está disponible
✅ **Muestre un mensaje claro** en la consola
✅ **Muestre un badge rojo** indicando "API Desconectada"
✅ **Muestre un mensaje claro al usuario** cuando intente guardar cambios

### Antes:
```
❌ Crash con "Failed to fetch"
❌ Error confuso
❌ Aplicación se congela
```

### Ahora:
```
✅ Muestra badge "API Desconectada"
✅ Mensaje claro: "No se puede conectar con Monitor-IA"
✅ Aplicación funciona, solo deshabilitada
✅ Advertencia en consola con instrucciones
```

---

## 📊 Estados de la Aplicación

La página de configuración ahora tiene dos estados:

### Estado 1: 🔴 API Desconectada (Monitor-IA apagado)
```
┌─────────────────────────────────────┐
│ 🤖 Configuración de la IA          │
│ [🔴 API Desconectada]              │
├─────────────────────────────────────┤
│ ⚠️ No se puede conectar con         │
│    monitor-ia                       │
│                                     │
│ Verifica que esté ejecutándose     │
│ en el puerto 3001                   │
│                                     │
│ [Recargar] [Botones deshabilitados] │
└─────────────────────────────────────┘
```

### Estado 2: 🟢 API Conectada (Monitor-IA corriendo)
```
┌─────────────────────────────────────┐
│ 🤖 Configuración de la IA          │
│ [🟢 API Conectada]                 │
├─────────────────────────────────────┤
│ 📷 Parámetros de Detección         │
│ ┌─────────────────────────────────┐ │
│ │ URL RTSP: [input]               │ │
│ │ Umbral Persona: [0.5]           │ │
│ │ ...                             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Descartar] [💾 Guardar Config]    │
└─────────────────────────────────────┘
```

---

## 🆘 Otros Problemas Comunes

### Problema: "Puerto 3001 ya está en uso"

**Causa:** Ya hay otra instancia de Monitor-IA corriendo

**Solución Windows:**
```cmd
netstat -ano | findstr :3001
taskkill /PID [número_del_PID] /F
```

**Solución Linux/Mac:**
```bash
lsof -i :3001
kill -9 [PID]
```

### Problema: "Cannot find module"

**Causa:** Dependencias no instaladas

**Solución:**
```bash
cd monitor-ia/api-backend
npm install

cd ../../tecnohome-ai
npm install
```

### Problema: El badge sigue rojo después de iniciar Monitor-IA

**Solución:**
1. Verifica que Monitor-IA muestre "Backend escuchando en el puerto 3001"
2. Haz clic en el botón **"Recargar"** en la página
3. O recarga la página completa (F5)

---

## 🎓 ¿Por qué pasó esto?

### Arquitectura del Sistema

```
┌─────────────────┐
│  TecnoHome-AI   │  ← FRONTEND (React/Next.js)
│  localhost:3000 │     Corre en el navegador
└────────┬────────┘
         │
         │ HTTP fetch() 
         │ ❌ "Failed to fetch" si no hay servidor
         │
         ▼
┌─────────────────┐
│  Monitor-IA     │  ← BACKEND (Express.js)
│  localhost:3001 │     Debe estar CORRIENDO
└─────────────────┘     para recibir peticiones
```

### El Error Paso a Paso:

1. **TecnoHome-AI carga** (`npm run dev`)
2. **Página config-ia.tsx se renderiza**
3. **useEffect se ejecuta** (línea 79)
4. **Llama a loadConfiguration()** (línea 86)
5. **Llama a checkMonitorIaApiHealth()** (línea 123)
6. **Intenta fetch a `http://localhost:3001/api/config`**
7. **❌ No hay servidor escuchando en ese puerto**
8. **⚠️ "Failed to fetch"**

### La Solución:

Ahora el error se captura y:
- ✅ Retorna `false` en lugar de crashear
- ✅ Muestra advertencia en consola
- ✅ Actualiza el badge a "API Desconectada"
- ✅ Deshabilita los botones hasta que conecte

---

## 📝 Resumen

### Para usar la integración:

1. ✅ **Inicia Monitor-IA** (puerto 3001)
2. ✅ **Inicia TecnoHome-AI** (puerto 3000)
3. ✅ **Accede a /config-ia**
4. ✅ **Verifica badge verde "API Conectada"**
5. ✅ **¡Configura tu IA!**

### Si ves "API Desconectada":

1. ⚠️ **Verifica que Monitor-IA esté corriendo**
2. 🔄 **Reinicia Monitor-IA si es necesario**
3. 🔄 **Haz clic en "Recargar" en la página**

---

**¿Sigue sin funcionar?** 

Revisa:
- `INICIO_RAPIDO_INTEGRACION.md` - Guía de inicio
- `README_INTEGRACION_MONITOR_IA.md` - Troubleshooting completo

---

**¡Listo!** 🎉 El error ya está manejado correctamente.

