# 🔌 Integración TecnoHome-AI con Monitor-IA

## 📋 Descripción

Este documento explica cómo **TecnoHome-AI** puede realizar peticiones a la API de **Monitor-IA** para gestionar las configuraciones de la inteligencia artificial, de manera similar a como lo hace el frontend de Monitor-IA.

## 🎯 ¿Qué problema resuelve?

Antes de esta integración, TecnoHome-AI no podía comunicarse con la API de Monitor-IA. Esta integración permite:

- ✅ Ver la configuración actual de la IA desde TecnoHome-AI
- ✅ Modificar parámetros de detección (umbrales de confianza)
- ✅ Configurar la URL RTSP de la cámara
- ✅ Gestionar números de WhatsApp para notificaciones
- ✅ Enviar mensajes de prueba por WhatsApp
- ✅ Verificar el estado de conexión con la API

## 🚀 Configuración Inicial

### 1. Configura la URL de la API

Tienes dos opciones:

#### Opción A: Variable de Entorno (Recomendado)

Crea un archivo `.env.local` en la raíz de `tecnohome-ai`:

```bash
# Para desarrollo local (Monitor-IA corriendo en tu máquina):
NEXT_PUBLIC_MONITOR_IA_API_URL=http://localhost:3001

# Para usar Cloudflare Tunnel:
NEXT_PUBLIC_MONITOR_IA_API_URL=https://tu-tunnel-url.trycloudflare.com

# Para producción:
NEXT_PUBLIC_MONITOR_IA_API_URL=https://tu-dominio.com
```

#### Opción B: Editar el código directamente

Edita el archivo `src/services/monitorIaApi.ts` y cambia la URL por defecto:

```typescript
const MONITOR_IA_API_URL = 'http://localhost:3001'; // Cambia esta línea
```

### 2. Inicia los servicios

#### Terminal 1: Monitor-IA Backend

```bash
cd monitor-ia/api-backend
node index.js
```

Deberías ver:
```
Backend escuchando en el puerto 3001
📱 Sistema de notificaciones WhatsApp activo (Cooldown: 30s)
🔗 Servicio WhatsApp Bot: http://whatsapp-bot:3002
```

#### Terminal 2: TecnoHome-AI

```bash
cd tecnohome-ai
npm run dev
```

Deberías ver:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

## 📱 Cómo Usar

### 1. Accede a la Página de Configuración

1. Abre tu navegador en `http://localhost:3000`
2. Ve al Dashboard
3. Haz clic en **"Administración"** en el sidebar
4. Haz clic en el botón **"⚙️ Configurar IA"** (botón morado)

### 2. Verifica la Conexión

En la parte superior de la página verás un badge:
- 🟢 **"API Conectada"** (verde) = Todo bien
- 🔴 **"API Desconectada"** (rojo) = Verifica que Monitor-IA esté corriendo

### 3. Configura los Parámetros

#### Parámetros de Detección:

- **URL RTSP**: La dirección de tu cámara IP
  - Formato: `rtsp://usuario:contraseña@ip:puerto/stream`
  - Ejemplo: `rtsp://admin:admin123@192.168.1.100:554/stream1`

- **Umbral de Confianza - Persona** (0.1 - 1.0)
  - Valor por defecto: `0.50`
  - Más bajo = más detecciones (pero puede haber falsos positivos)
  - Más alto = solo detecciones muy seguras

- **Umbral de Confianza - Casco** (0.1 - 1.0)
  - Valor por defecto: `0.70`
  - Controla qué tan seguro debe estar el modelo de que hay un casco

- **Umbral de Confianza - Guantes** (0.1 - 1.0)
  - Valor por defecto: `0.70`
  - Controla qué tan seguro debe estar el modelo de que hay guantes

#### Notificaciones WhatsApp:

1. En el campo de texto, ingresa un número con el formato: `+56912345678`
2. Haz clic en **"Agregar"**
3. Repite para agregar más números
4. Para eliminar un número, haz clic en el ícono de papelera (🗑️)

### 4. Guarda los Cambios

1. Haz clic en **"Guardar Configuración"**
2. Verás una notificación de éxito
3. Los cambios se aplican inmediatamente en Monitor-IA

### 5. Prueba las Notificaciones

1. Asegúrate de tener al menos un número configurado
2. Haz clic en **"Enviar Mensaje de Prueba"**
3. Deberías recibir un WhatsApp en unos segundos

## 🔧 Arquitectura de la Integración

```
┌─────────────────┐
│  TecnoHome-AI   │
│   (Next.js)     │
│  localhost:3000 │
└────────┬────────┘
         │
         │ HTTP/HTTPS
         │ fetch()
         ▼
┌─────────────────┐
│   Monitor-IA    │
│  API Backend    │
│   (Express)     │
│  localhost:3001 │
└────────┬────────┘
         │
         │ HTTP
         ▼
┌─────────────────┐
│  WhatsApp Bot   │
│   Service       │
│  localhost:3002 │
└─────────────────┘
```

## 📂 Archivos Creados

### 1. `src/services/monitorIaApi.ts`

Servicio que encapsula todas las peticiones a la API de Monitor-IA:

- `getMonitorIaConfig()` - Obtiene la configuración actual
- `updateMonitorIaConfig()` - Actualiza la configuración
- `sendWhatsAppNotification()` - Envía notificaciones de WhatsApp
- `getMonitorIaLogs()` - Obtiene los logs/alertas
- `checkMonitorIaApiHealth()` - Verifica si la API está disponible

### 2. `src/pages/config-ia.tsx`

Nueva página con interfaz completa para:
- Ver estado de conexión con la API
- Configurar parámetros de detección
- Gestionar números de WhatsApp
- Enviar mensajes de prueba
- Guardar configuración

### 3. Modificaciones en `src/pages/admin.tsx`

- Agregado botón **"Configurar IA"** para acceder a la nueva página
- Importado el ícono `IconRobot`

## 🔍 Endpoints de la API Utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/config` | Obtiene la configuración actual |
| POST | `/api/config` | Actualiza la configuración |
| POST | `/api/send-whatsapp` | Envía notificación por WhatsApp |
| GET | `/api/logs` | Obtiene logs/alertas del sistema |

## ⚠️ Troubleshooting

### Error: "No se puede conectar con monitor-ia"

**Posibles causas:**

1. Monitor-IA no está ejecutándose
   ```bash
   # Solución: Inicia el backend
   cd monitor-ia/api-backend
   node index.js
   ```

2. URL mal configurada
   ```bash
   # Verifica tu archivo .env.local
   # Debe ser: http://localhost:3001 (para desarrollo local)
   ```

3. Puerto bloqueado por firewall
   ```bash
   # Verifica que el puerto 3001 esté abierto
   netstat -an | findstr 3001
   ```

### Error de CORS

Si ves errores de CORS en la consola del navegador:

1. Verifica que `monitor-ia/api-backend/index.js` tenga esta línea:
   ```javascript
   app.use(cors({ origin: '*' }));
   ```

2. Reinicia el backend de Monitor-IA

### La configuración no se guarda

1. Verifica que todos los campos estén completos
2. Revisa la consola del navegador (F12) para ver errores
3. Verifica que Monitor-IA esté guardando en `config.json`:
   ```bash
   cd monitor-ia/api-backend
   cat config.json  # Linux/Mac
   type config.json  # Windows
   ```

### Los mensajes de WhatsApp no llegan

1. Verifica que el servicio de WhatsApp Bot esté corriendo
2. Verifica que los números tengan el formato correcto: `+56912345678`
3. Revisa los logs del backend de Monitor-IA
4. Respeta el cooldown de 30 segundos entre mensajes

## 📊 Comparación: Antes vs Después

### Antes

❌ TecnoHome-AI no podía comunicarse con Monitor-IA
❌ Había que usar el frontend HTML de Monitor-IA por separado
❌ Gestión fragmentada de configuraciones
❌ Interfaz básica (HTML estático)

### Después

✅ TecnoHome-AI se integra completamente con Monitor-IA
✅ Una sola interfaz moderna para todo
✅ Gestión centralizada desde TecnoHome-AI
✅ Interfaz profesional con Mantine UI
✅ Notificaciones en tiempo real
✅ Validación de formularios
✅ Verificación de estado de API

## 🎨 Capturas de Funcionalidades

### Estado de Conexión
- Badge verde: API conectada ✅
- Badge rojo: API desconectada ❌

### Parámetros de Detección
- Campo de texto para URL RTSP
- Sliders para umbrales de confianza
- Descripciones para cada parámetro

### Notificaciones WhatsApp
- Lista de números configurados
- Botón para agregar números
- Botón para eliminar números
- Validación de formato
- Botón de prueba

## 🔗 Enlaces Útiles

- [Documentación Monitor-IA](../monitor-ia/README.md)
- [Documentación WhatsApp Bot](../monitor-ia/whatsapp-bot/README.md)
- [CORS en Express](https://expressjs.com/en/resources/middleware/cors.html)

## 🤝 Contribuciones

Para modificar o extender esta integración:

1. **Agregar nuevos endpoints**: Edita `src/services/monitorIaApi.ts`
2. **Modificar la interfaz**: Edita `src/pages/config-ia.tsx`
3. **Agregar validaciones**: Usa las funciones en el servicio

## 📝 Notas Importantes

- La configuración se guarda en `monitor-ia/api-backend/config.json`
- Los cambios son inmediatos (no requiere reinicio)
- El cooldown de WhatsApp es de 30 segundos
- Puedes forzar el envío con la opción `force: true`

## ✅ Checklist de Verificación

Antes de usar la integración, verifica:

- [ ] Monitor-IA backend está corriendo (puerto 3001)
- [ ] TecnoHome-AI está corriendo (puerto 3000)
- [ ] La variable `NEXT_PUBLIC_MONITOR_IA_API_URL` está configurada
- [ ] El badge muestra "API Conectada" (verde)
- [ ] Puedes ver la configuración actual
- [ ] Puedes guardar cambios
- [ ] Los números de WhatsApp están en formato correcto

¡Listo! Ahora TecnoHome-AI puede gestionar completamente la configuración de Monitor-IA. 🎉

