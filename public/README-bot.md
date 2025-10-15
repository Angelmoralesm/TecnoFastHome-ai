# Bot de WhatsApp - Configuración y Uso

Este directorio contiene los archivos necesarios para el bot de WhatsApp que envía alertas de emergencia desde el dashboard.

## 📁 Archivos incluidos

- **`bot.mjs`** - Bot principal en modo headless (sin interfaz gráfica)
- **`bot-with-gui.mjs`** - Versión con interfaz gráfica para primera autenticación
- **`setup-bot.mjs`** - Script de configuración inicial con instrucciones detalladas
- **`README-bot.md`** - Esta documentación

## 🚀 Configuración inicial (primera vez)

Para usar el bot por primera vez, necesitas autenticarlo con WhatsApp:

### Opción 1: Script de configuración automática (Recomendado)

```bash
node public/setup-bot.mjs
```

Este script te guiará paso a paso:
1. Muestra instrucciones claras en español
2. Genera el código QR para escanear
3. Te indica cuando la autenticación está completa
4. Envía un mensaje de prueba de confirmación

### Opción 2: Configuración manual

```bash
node public/bot-with-gui.mjs
```

## ✅ Uso normal (después de la autenticación)

Una vez autenticado, usa el botón **"Enviar Alerta de Emergencia"** en el dashboard.

El bot funcionará automáticamente en segundo plano:
- ✅ Sin abrir navegador
- ✅ Sin mostrar interfaz gráfica
- ✅ Mantiene la sesión autenticada entre ejecuciones
- ✅ Envía mensajes a los números configurados

## 🔧 Configuración de números

Para cambiar los números de teléfono, edita estos archivos:

```javascript
// En bot.mjs, bot-with-gui.mjs y setup-bot.mjs
const numero = '56950679940';  // Tu número
const numero2 = '56981574316'; // Segundo número
```

## ⚙️ Configuración técnica

### Modo Headless (producción)
- `headless: true` - No abre navegador
- Múltiples argumentos de Puppeteer para estabilidad
- Manejo de errores mejorado
- Mensajes más claros en consola

### Modo con interfaz (desarrollo)
- `headless: false` - Abre navegador para mostrar QR
- Configuración mínima para desarrollo

## 🛠️ Solución de problemas

### Error de autenticación
1. Asegúrate de que WhatsApp esté abierto en tu teléfono
2. Verifica la conexión a internet
3. Intenta nuevamente después de unos minutos

### El bot no responde
1. Verifica que tienes permisos para ejecutar Node.js
2. Asegúrate de que las dependencias estén instaladas
3. Revisa los logs del servidor

### Mensajes no se envían
1. Verifica que los números tengan WhatsApp
2. Asegúrate de que la sesión esté activa
3. Revisa las restricciones de WhatsApp

## 🔐 Seguridad

- La autenticación se guarda localmente usando `LocalAuth`
- Los números de teléfono están hardcodeados (ajústalos según necesites)
- El bot solo envía mensajes, no lee conversaciones
- Funciona completamente offline después de la autenticación inicial

## 📞 Números configurados actualmente

- **56950679940** - Número principal
- **56981574316** - Número secundario

## 🎯 Funcionamiento

1. **Dashboard** → Botón "Enviar Alerta de Emergencia"
2. **API** (`/api/execute-bot`) → Ejecuta `bot.mjs`
3. **Bot headless** → Se conecta silenciosamente a WhatsApp
4. **Envío de mensajes** → A los números configurados
5. **Confirmación** → Logs en consola del servidor

¡El bot está listo para usar! 🚀
