# Monitor de Alertas EPP con Notificaciones WhatsApp

## 📋 Descripción

Sistema inteligente de monitoring que analiza el endpoint del backend de IA y envía **notificaciones automáticas por WhatsApp** cuando detecta que una persona ha estado sin EPP por **5 segundos consecutivos**.

## 🎯 Funcionamiento

### Algoritmo de Detección

```
1. Cada 5 segundos → Consultar endpoint de logs
2. Obtener los últimos 5 logs del array
3. Verificar timestamps:
   - Calcular diferencia entre el primer y último log
   - Si la diferencia es ≤ 5 segundos → ALERTA
4. Enviar notificación por WhatsApp
5. Activar cooldown de 30 segundos (evitar spam)
```

### Ejemplo Visual

```
Logs recibidos:
[
  { "timestamp": "2025-11-02 19:31:04", "message": "¡ALERTA! Persona sin EPP..." },
  { "timestamp": "2025-11-02 19:31:05", "message": "¡ALERTA! Persona sin EPP..." },
  { "timestamp": "2025-11-02 19:31:06", "message": "¡ALERTA! Persona sin EPP..." },
  { "timestamp": "2025-11-02 19:31:07", "message": "¡ALERTA! Persona sin EPP..." },
  { "timestamp": "2025-11-02 19:31:08", "message": "¡ALERTA! Persona sin EPP..." }
]

Análisis:
- Primer log: 19:31:04
- Último log: 19:31:08
- Diferencia: 4 segundos ✓ (≤ 5 segundos)
- RESULTADO: ¡ALERTA ACTIVADA! 🚨
- ACCIÓN: Enviar WhatsApp
```

## 🚀 Uso

### Inicio Rápido

#### Windows

```batch
# Doble click o desde terminal
monitor-epp-alerts.bat
```

#### Linux/Mac

```bash
node monitor-epp-alerts.js
```

## 📊 Salida del Monitor

### Verificación Normal

```
🔍 [7:31:15 p. m.] Verificando logs... (Check #1)
   📊 Total de logs: 20
   ✓ Sin alertas (últimos 5 logs OK)
```

### Alerta Detectada

```
🔍 [7:31:20 p. m.] Verificando logs... (Check #2)
   📊 Total de logs: 25
======================================================================
 🚨 ¡ALERTA EPP DETECTADA! 🚨
======================================================================

⚠️  Persona sin EPP por 4.0 segundos consecutivos
📅 Desde: 2025-11-02 19:31:04
📅 Hasta: 2025-11-02 19:31:08

📋 Logs detectados:
   1. [2025-11-02 19:31:04] ¡ALERTA! Persona sin EPP: 1 Persona(s), SIN Casco, SIN Guantes
   2. [2025-11-02 19:31:05] ¡ALERTA! Persona sin EPP: 1 Persona(s), SIN Casco, SIN Guantes
   3. [2025-11-02 19:31:06] ¡ALERTA! Persona sin EPP: 1 Persona(s), SIN Casco, SIN Guantes
   4. [2025-11-02 19:31:07] ¡ALERTA! Persona sin EPP: 1 Persona(s), SIN Casco, SIN Guantes
   5. [2025-11-02 19:31:08] ¡ALERTA! Persona sin EPP: 1 Persona(s), SIN Casco, SIN Guantes

📱 Enviando notificación por WhatsApp...
✅ Notificación WhatsApp enviada exitosamente
```

## ⚙️ Configuración

### Parámetros Principales

Puedes modificar estos valores en `monitor-epp-alerts.js`:

```javascript
class EPPAlertMonitor {
  constructor() {
    this.endpointUrl = 'https://...';  // URL del endpoint
    this.checkInterval = 5000;          // 5 segundos entre checks
    this.alertThreshold = 5;            // 5 segundos consecutivos
    this.alertCooldown = 30000;         // 30 segundos entre alertas
  }
}
```

### Modificar Números de WhatsApp

Edita el archivo `public/bot.mjs`:

```javascript
async function enviarMensaje() {
    const numero = '56950679940';    // Cambiar aquí
    const numero2 = '56981574316';   // Cambiar aquí
    // ...
}
```

### Personalizar Mensaje de WhatsApp

En `public/bot.mjs`, modifica:

```javascript
let mensaje = '🚨 EMERGENCIA: Ha ocurrido una emergencia...';
```

## 🔐 Autenticación WhatsApp

### Primera Vez

1. El script intentará conectarse a WhatsApp
2. Si es la primera vez, necesitarás autenticarte
3. Modifica `public/bot.mjs` temporalmente:
   ```javascript
   headless: false  // Cambiar de true a false
   ```
4. Ejecuta el bot una vez para escanear el código QR
5. Vuelve a poner `headless: true`
6. La autenticación se guardará automáticamente

### Sesión Guardada

Una vez autenticado, la sesión se mantiene gracias a `LocalAuth`. No necesitarás volver a escanear el QR.

## 🛡️ Protección Anti-Spam

### Cooldown de 30 Segundos

Para evitar enviar múltiples WhatsApp por el mismo incidente:

- **Primera alerta**: Se envía inmediatamente
- **Alertas siguientes**: Solo después de 30 segundos
- **Logs duplicados**: Se ignoran automáticamente

### Deduplicación

El sistema recuerda los grupos de logs ya alertados:

```javascript
// No alertará dos veces sobre los mismos 5 logs
this.alertedTimestamps = new Set();
```

Los registros se limpian automáticamente después de 5 minutos.

## 📊 Estadísticas

Al detener el monitor (Ctrl+C), verás:

```
============================================================
📊 ESTADÍSTICAS DEL MONITOR
============================================================
Total de verificaciones: 120
Alertas enviadas: 3
Errores: 0
Última verificación: 2025-11-02T19:45:30.000Z
============================================================
```

## 🔧 Solución de Problemas

### Error: "Cannot find module"

```bash
# Asegúrate de estar en el directorio correcto
cd /ruta/a/tu/proyecto
node monitor-epp-alerts.js
```

### Error: WhatsApp no conectado

1. Verifica que el bot de WhatsApp esté configurado
2. Revisa el archivo `public/bot.mjs`
3. Si es primera vez, autentica con `headless: false`

### Error: Endpoint no responde

1. Verifica que la URL esté correcta
2. Prueba acceder manualmente: `curl https://...`
3. Revisa tu conexión a internet

### No se envían alertas

1. Verifica que haya logs en el endpoint
2. Confirma que los últimos 5 logs estén en un rango ≤ 5 segundos
3. Revisa si el cooldown está activo

## 🎯 Casos de Uso

### 1. Monitoring 24/7

Deja el script corriendo continuamente para vigilancia en tiempo real:

```bash
# Linux - Mantener corriendo incluso si cierras la terminal
nohup node monitor-epp-alerts.js > monitor.log 2>&1 &
```

### 2. Integración con Servicios

El sistema puede ser integrado con otros servicios:

```javascript
// Ejemplo: También enviar a Discord, Slack, etc.
async sendWhatsAppNotification(alertData) {
  // ... código de WhatsApp ...
  
  // Agregar otros canales
  await sendToDiscord(alertData);
  await sendToSlack(alertData);
}
```

### 3. Análisis de Logs

Los logs se muestran en consola y pueden ser redirigidos:

```bash
node monitor-epp-alerts.js > logs/monitor.log
```

## 📁 Archivos del Sistema

```
📁 Proyecto
├── monitor-epp-alerts.js          # Script principal de monitoring
├── monitor-epp-alerts.bat         # Launcher para Windows
├── public/
│   └── bot.mjs                    # Bot de WhatsApp
├── MONITOR_EPP_ALERTS_README.md   # Esta documentación
└── .wwebjs_auth/                  # Sesión de WhatsApp (auto-generado)
```

## 🔍 Detalles Técnicos

### Formato de Timestamp

El endpoint usa el formato: `"2025-11-02 19:31:04"`

El script parsea automáticamente a formato Date de JavaScript:

```javascript
parseTimestamp(timestamp) {
  const [datePart, timePart] = timestamp.split(' ');
  return new Date(`${datePart}T${timePart}`);
}
```

### Cálculo de Diferencia

```javascript
getDifferenceInSeconds(timestamp1, timestamp2) {
  const date1 = this.parseTimestamp(timestamp1);
  const date2 = this.parseTimestamp(timestamp2);
  return Math.abs((date2 - date1) / 1000);
}
```

### Análisis de Logs

1. Toma los últimos 5 elementos del array: `logs.slice(-5)`
2. Compara timestamps del primero y último
3. Si `diffSeconds <= 5` → Activa alerta
4. Genera firma única para deduplicación
5. Verifica cooldown antes de enviar

## 🚀 Mejoras Futuras

- [ ] Dashboard web para visualizar alertas
- [ ] Notificaciones por email
- [ ] Integración con Telegram
- [ ] Base de datos para historial de alertas
- [ ] API REST para consultar estadísticas
- [ ] Configuración mediante archivo JSON
- [ ] Alertas diferenciadas por tipo de EPP faltante

## 📞 Soporte

Para modificar el comportamiento o agregar funcionalidades, edita los archivos:

- **`monitor-epp-alerts.js`**: Lógica de monitoring
- **`public/bot.mjs`**: Configuración de WhatsApp

## 🎉 ¡Listo para Usar!

El sistema está completamente funcional. Solo necesitas:

1. ✅ Node.js instalado
2. ✅ WhatsApp Web autenticado
3. ✅ Endpoint del backend accesible

```bash
# ¡Comienza ahora!
node monitor-epp-alerts.js
```

¡El sistema monitoreará automáticamente y te avisará por WhatsApp cuando sea necesario! 🚨📱

