# 🚀 Inicio Rápido - Integración Monitor-IA

## ⚡ Configuración en 3 Pasos

### Paso 1: Configura la URL de la API

Crea el archivo `.env.local` en la raíz de `tecnohome-ai`:

```bash
NEXT_PUBLIC_MONITOR_IA_API_URL=http://localhost:3001
```

> 💡 Si usas Cloudflare Tunnel, reemplaza con tu URL de Cloudflare.

### Paso 2: Inicia los Servicios

**Terminal 1 - Monitor-IA:**
```bash
cd monitor-ia/api-backend
node index.js
```

**Terminal 2 - TecnoHome-AI:**
```bash
cd tecnohome-ai
npm run dev
```

### Paso 3: Accede a la Configuración

1. Abre: `http://localhost:3000`
2. Ve a **"Administración"**
3. Haz clic en **"⚙️ Configurar IA"**

## ✅ ¡Listo!

Ahora puedes:

- ✅ Ver la configuración actual de Monitor-IA
- ✅ Modificar parámetros de detección (umbrales)
- ✅ Configurar URL RTSP de la cámara
- ✅ Gestionar números de WhatsApp
- ✅ Enviar mensajes de prueba

## 📚 Documentación Completa

Para más detalles, consulta:
- `README_INTEGRACION_MONITOR_IA.md` - Documentación completa
- `CONFIGURACION_MONITOR_IA.md` - Guía de configuración

## 🆘 Problemas Comunes

### ❌ "API Desconectada"

**Solución:**
```bash
# Verifica que Monitor-IA esté corriendo:
cd monitor-ia/api-backend
node index.js
```

### ❌ "No se puede conectar"

**Solución:**
- Verifica que el archivo `.env.local` exista
- Verifica que la URL sea `http://localhost:3001`
- Reinicia TecnoHome-AI (`Ctrl+C` y `npm run dev`)

## 🎯 Endpoints Disponibles

| Acción | Descripción |
|--------|-------------|
| Ver Config | Obtiene configuración actual de Monitor-IA |
| Guardar Config | Actualiza configuración en Monitor-IA |
| Enviar WhatsApp | Envía mensaje de prueba |

---

**¿Necesitas ayuda?** Consulta `README_INTEGRACION_MONITOR_IA.md` para troubleshooting detallado.

