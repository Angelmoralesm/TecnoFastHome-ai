# Configuración de Integración con Monitor-IA

Este documento explica cómo conectar **tecnohome-ai** con la API de **monitor-ia** para gestionar configuraciones de la IA.

## 📋 Configuración de la URL de la API

La aplicación necesita saber dónde está la API de monitor-ia. Hay varias opciones:

### Opción 1: Variable de Entorno (Recomendado)

Crea un archivo `.env.local` en la raíz de `tecnohome-ai` con el siguiente contenido:

```bash
# Para desarrollo local (si monitor-ia está corriendo en tu máquina):
NEXT_PUBLIC_MONITOR_IA_API_URL=http://localhost:3001

# O si estás usando Cloudflare Tunnel:
NEXT_PUBLIC_MONITOR_IA_API_URL=https://tu-tunnel.trycloudflare.com

# O para producción:
NEXT_PUBLIC_MONITOR_IA_API_URL=https://tu-dominio-produccion.com
```

### Opción 2: Modificar Directamente el Archivo

Si no quieres usar variables de entorno, puedes editar directamente el archivo:
`src/services/monitorIaApi.ts` y cambiar esta línea:

```typescript
const MONITOR_IA_API_URL = 'http://localhost:3001'; // Cambia esta URL
```

## 🚀 Cómo Usar

Una vez configurada la URL, desde la página de **Administración** (`/admin`) podrás:

1. **Ver y editar configuración de la IA**:
   - URL RTSP de la cámara
   - Umbrales de confianza (persona, casco, guantes)
   - Números de WhatsApp para notificaciones

2. **Sincronizar con monitor-ia**:
   - Al cargar la página, se obtiene la configuración actual desde monitor-ia
   - Al guardar cambios, se envían directamente a la API de monitor-ia

3. **Probar notificaciones**:
   - Enviar mensajes de prueba por WhatsApp

## 🔧 Endpoints de la API de monitor-ia

El servicio utiliza los siguientes endpoints:

- **GET** `/api/config` - Obtener configuración actual
- **POST** `/api/config` - Actualizar configuración
- **POST** `/api/send-whatsapp` - Enviar notificación de WhatsApp
- **GET** `/api/logs` - Obtener logs/alertas

## ⚠️ Troubleshooting

### Error: "No se puede conectar con la API"

1. Verifica que monitor-ia esté ejecutándose
2. Verifica que el puerto 3001 esté accesible
3. Si estás usando Cloudflare Tunnel, verifica que la URL sea correcta
4. Revisa la consola del navegador para más detalles

### Error de CORS

Si ves errores de CORS en la consola, verifica que el backend de monitor-ia tenga configurado:

```javascript
app.use(cors({ origin: '*' }));
```

Esto ya está configurado en `monitor-ia/api-backend/index.js` (línea 13).

## 📝 Próximos Pasos

Después de configurar la URL:

1. Inicia tecnohome-ai: `npm run dev`
2. Ve a la página de Admin: `http://localhost:3000/admin`
3. Haz clic en "⚙️ Configurar IA" para ver y editar la configuración

