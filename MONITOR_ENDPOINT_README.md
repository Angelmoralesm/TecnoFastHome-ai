# Monitor de Endpoint Backend IA - TecnoHome AI

## 📋 Descripción

Sistema de monitoring en **Node.js** para monitorear el endpoint del backend de IA que provee logs de detección de EPP (Equipo de Protección Personal). 

**Compatible con Vercel** y cualquier entorno Node.js.

## 🎯 Endpoint Monitoreado

```
URL: https://lodging-sir-exhibitions-refine.trycloudflare.com/api/logs
Tipo: JSON
Descripción: Backend IA - Sistema de alertas EPP
```

### Formato de Respuesta

```json
[
  {
    "timestamp": "2025-11-02T22:23:59.804Z",
    "message": "¡ALERTA! Persona sin EPP: 1 Persona(s), CON Casco, SIN Guantes"
  },
  {
    "timestamp": "2025-11-02T22:24:00.823Z",
    "message": "¡ALERTA! Persona sin EPP: 1 Persona(s), CON Casco, SIN Guantes"
  }
]
```

## 🚀 Uso

### Opción 1: Script Standalone (Recomendado para desarrollo local)

#### Windows - Usando el archivo .bat

```batch
# Desde el directorio raíz del proyecto
monitor-endpoints-nodejs.bat
```

#### Linux/Mac - Directamente con Node.js

```bash
# Configuración por defecto (cada 5 segundos, timeout 2s)
node monitor-endpoints.js

# Configuración personalizada
node monitor-endpoints.js --interval 10 --timeout 5

# Ver ayuda
node monitor-endpoints.js --help
```

### Opción 2: API Endpoint (Para integración en la aplicación Next.js)

El sistema incluye un endpoint API compatible con Vercel que puede ser llamado desde cualquier parte de tu aplicación:

```typescript
// Desde cualquier componente o página de Next.js
const checkEndpoints = async () => {
  try {
    const response = await fetch('/api/monitor-endpoints');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Respuesta del API

```json
{
  "timestamp": "2025-11-02T22:30:00.000Z",
  "summary": {
    "total": 1,
    "available": 1,
    "unavailable": 0,
    "totalLogs": 50
  },
  "endpoints": [
    {
      "endpointId": "epp-logs",
      "name": "Logs de Detección EPP",
      "url": "https://lodging-sir-exhibitions-refine.trycloudflare.com/api/logs",
      "description": "Backend IA - Sistema de alertas EPP",
      "isAvailable": true,
      "lastChecked": "2025-11-02T22:30:00.000Z",
      "responseTime": 250,
      "logCount": 50,
      "recentLogs": [
        {
          "timestamp": "2025-11-02T22:29:58.364Z",
          "message": "¡ALERTA! Persona sin EPP: 1 Persona(s), CON Casco, SIN Guantes"
        }
      ]
    }
  ],
  "message": "Verificación completada. 1/1 endpoint(s) disponible(s). Total de logs: 50"
}
```

## 📊 Características

### ✅ Detección Automática

- **Cambio de estado**: Detecta cuando el endpoint se conecta o desconecta
- **Nuevos logs**: Avisa cuando aparecen nuevos logs en el endpoint
- **Tiempo real**: Monitoreo continuo con intervalos configurables

### 🎨 Salida Coloreada (Script Standalone)

```
==================================================
🖥️  MONITOR DE ENDPOINTS DE IA - TECNOHOME AI
==================================================
⏱️  Intervalo de verificación: 5 segundos
⏳ Timeout por request: 2 segundos
==================================================

🚀 Iniciando monitoring continuo...
Presiona Ctrl+C para detener

🔍 [2:30:15 p. m.] Verificando endpoint...

🟢 PRIMERA VERIFICACIÓN - Logs de Detección EPP
   Estado: DISPONIBLE
   Descripción: Backend IA - Sistema de alertas EPP
   URL: https://lodging-sir-exhibitions-refine.trycloudflare.com/api/logs
   Tiempo de respuesta: 250ms
   Total de logs: 50
   📋 Últimos logs:
      [10:26:47 p. m.] ¡ALERTA! Persona sin EPP: 1 Persona(s), SIN Casco, SIN Guantes
      [10:26:48 p. m.] ¡ALERTA! Persona sin EPP: 1 Persona(s), SIN Casco, SIN Guantes
      [10:26:49 p. m.] ¡ALERTA! Persona sin EPP: 1 Persona(s), SIN Casco, SIN Guantes

🔍 [2:30:20 p. m.] Verificando endpoint...
____________________________________________________________
 📢 ¡NUEVOS LOGS DETECTADOS!
____________________________________________________________

📊 [2:30:20 p. m.] 3 nuevo(s) log(s)
   Total de logs: 50 → 53
   Servicio: Logs de Detección EPP
   🆕 Nuevos logs:
      [10:26:50 p. m.] ¡ALERTA! Persona sin EPP: 1 Persona(s), SIN Casco, SIN Guantes
      [10:26:51 p. m.] ¡ALERTA! Persona sin EPP: 1 Persona(s), CON Casco, SIN Guantes
      [10:26:52 p. m.] ¡ALERTA! Persona sin EPP: 1 Persona(s), CON Casco, CON Guantes
```

### ⚙️ Configuración

#### Parámetros del Script

```bash
node monitor-endpoints.js [opciones]

Opciones:
  -i, --interval <segundos>    Intervalo entre verificaciones (default: 5)
  -t, --timeout <segundos>     Timeout por request (default: 2)
  -h, --help                   Mostrar ayuda
```

#### Ejemplos

```bash
# Verificación cada 10 segundos
node monitor-endpoints.js --interval 10

# Timeout de 5 segundos por request
node monitor-endpoints.js --timeout 5

# Configuración rápida (cada 2 segundos, timeout 1 segundo)
node monitor-endpoints.js -i 2 -t 1
```

## 🔧 Integración con Vercel

### Despliegue

El endpoint API está listo para ser desplegado en Vercel:

1. **Archivo API**: `src/pages/api/monitor-endpoints.ts`
2. **Sin dependencias externas**: Solo usa módulos nativos de Node.js
3. **Compatible con serverless**: Funciona perfectamente en funciones serverless

### Uso en Producción

```typescript
// En cualquier componente de tu aplicación
import { useEffect, useState } from 'react';

function EndpointMonitor() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      const res = await fetch('/api/monitor-endpoints');
      const data = await res.json();
      setStatus(data);
    };

    // Verificar cada 10 segundos
    const interval = setInterval(checkStatus, 10000);
    checkStatus(); // Primera verificación inmediata

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {status && (
        <div>
          <h3>Estado del Backend IA</h3>
          <p>Disponible: {status.summary.available}/{status.summary.total}</p>
          <p>Total de logs: {status.summary.totalLogs}</p>
        </div>
      )}
    </div>
  );
}
```

## 📝 Archivos del Sistema

```
📁 Proyecto
├── monitor-endpoints.js              # Script standalone de Node.js
├── monitor-endpoints-nodejs.bat      # Launcher para Windows
├── src/pages/api/monitor-endpoints.ts # API endpoint para Next.js/Vercel
└── MONITOR_ENDPOINT_README.md        # Esta documentación
```

## 🛠️ Solución de Problemas

### Error: "Cannot find module"

Asegúrate de estar en el directorio raíz del proyecto al ejecutar el script.

### Timeout al conectar

El endpoint puede estar temporalmente no disponible o la red puede ser lenta. Intenta aumentar el timeout:

```bash
node monitor-endpoints.js --timeout 10
```

### El endpoint no responde

Verifica que la URL del endpoint esté correcta y sea accesible desde tu ubicación. Puedes probar manualmente con:

```bash
curl https://lodging-sir-exhibitions-refine.trycloudflare.com/api/logs
```

### CORS en desarrollo

Si estás llamando al API desde un frontend, asegúrate de que el endpoint permita CORS. El API endpoint de Next.js ya maneja esto automáticamente.

## 🎯 Casos de Uso

### 1. Desarrollo Local

Usa el script standalone para monitorear el endpoint mientras desarrollas:

```bash
node monitor-endpoints.js
```

### 2. Dashboard de Monitoreo

Integra el API endpoint en un dashboard React/Next.js para mostrar el estado en tiempo real.

### 3. Alertas Automatizadas

Combina con webhooks o notificaciones push para alertar cuando hay problemas:

```typescript
const checkAndAlert = async () => {
  const res = await fetch('/api/monitor-endpoints');
  const data = await res.json();
  
  if (data.summary.available === 0) {
    // Enviar alerta
    await sendAlert('El backend de IA está caído');
  }
};
```

### 4. Logs en Producción

Usa el logging del servidor para mantener un historial de cambios y nuevos logs detectados.

## 📚 Referencias

- [Endpoint de logs del backend IA](https://lodging-sir-exhibitions-refine.trycloudflare.com/api/logs)
- Documentación de Next.js API Routes
- Documentación de Vercel Serverless Functions

## 🤝 Contribuciones

Este sistema es parte del proyecto TecnoHome AI. Para modificar el endpoint monitoreado, edita la configuración en:

- **Script**: `monitor-endpoints.js` (línea 34-40)
- **API**: `src/pages/api/monitor-endpoints.ts` (línea 30-37)

