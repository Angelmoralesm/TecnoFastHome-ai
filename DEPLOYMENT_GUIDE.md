# Guía de Despliegue - Monitor EPP con WhatsApp

## 🎯 Resumen del Problema

El **Monitor de Alertas EPP** requiere un **proceso en ejecución continua** que:
- Consulte el endpoint cada 5 segundos
- Mantenga una sesión de WhatsApp Web activa
- Esté disponible 24/7

**⚠️ IMPORTANTE**: Este tipo de proceso **NO puede correr en Vercel** porque:
- Vercel es serverless (solo ejecuta código cuando recibe requests HTTP)
- WhatsApp Web requiere una sesión de navegador persistente
- No puedes mantener procesos corriendo indefinidamente

## ✅ Soluciones por Entorno

### 1️⃣ Desarrollo Local

#### Opción A: Solo Next.js (sin monitor)
```bash
npm run dev
```

#### Opción B: Next.js + Monitor EPP (Recomendado para desarrollo)
```bash
npm run dev:monitor
```
Esto inicia **ambos servicios simultáneamente**:
- Next.js en `http://localhost:3000`
- Monitor EPP con WhatsApp

#### Opción C: Solo Monitor EPP
```bash
npm run monitor
# O directamente:
node monitor-epp-alerts.js
```

---

### 2️⃣ Producción en Vercel (Frontend)

**Vercel es solo para el frontend Next.js:**

```bash
# Desplegar a Vercel
vercel --prod
```

**❌ El monitor EPP NO se ejecutará en Vercel**

**✅ Necesitas un servidor separado para el monitor** (ver opciones abajo)

---

### 3️⃣ Servidor para el Monitor (Backend)

Necesitas un servidor que esté corriendo 24/7. Aquí tus opciones:

#### Opción A: VPS/Servidor Dedicado (Recomendado)

**Servicios sugeridos:**
- DigitalOcean (desde $6/mes)
- AWS EC2 (capa gratuita disponible)
- Google Cloud Compute Engine
- Linode
- Vultr

**Configuración:**

1. **Instalar Node.js en el servidor**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Clonar tu proyecto**
```bash
git clone [tu-repositorio]
cd tecnohome-ai
npm install
```

3. **Instalar PM2 (Gestor de procesos)**
```bash
npm install -g pm2
```

4. **Iniciar el monitor con PM2**
```bash
pm2 start monitor-epp-alerts.js --name epp-monitor
pm2 save
pm2 startup  # Para que se inicie automáticamente al reiniciar el servidor
```

5. **Monitorear el proceso**
```bash
pm2 status          # Ver estado
pm2 logs epp-monitor  # Ver logs
pm2 restart epp-monitor  # Reiniciar
pm2 stop epp-monitor     # Detener
```

#### Opción B: Railway.app (Fácil, desde gratis)

1. Crea una cuenta en [Railway.app](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Crea un archivo `Procfile` en la raíz:
```
worker: node monitor-epp-alerts.js
```
4. Railway detectará automáticamente y ejecutará el monitor

#### Opción C: Heroku (Fácil, pero limitado en capa gratuita)

1. Crea una cuenta en [Heroku](https://heroku.com)
2. Instala Heroku CLI
3. Crea un archivo `Procfile`:
```
worker: node monitor-epp-alerts.js
```
4. Desplegar:
```bash
heroku create tu-app-monitor
git push heroku main
heroku ps:scale worker=1
```

#### Opción D: Docker en cualquier servidor

**Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./
RUN npm ci --only=production

# Copiar código
COPY monitor-epp-alerts.js ./
COPY public/bot.mjs ./public/

# Instalar chromium para WhatsApp Web
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

CMD ["node", "monitor-epp-alerts.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  epp-monitor:
    build: .
    restart: unless-stopped
    volumes:
      - ./wwebjs_auth:/app/.wwebjs_auth
    environment:
      - NODE_ENV=production
```

**Ejecutar:**
```bash
docker-compose up -d
```

---

## 🏗️ Arquitectura Recomendada para Producción

```
┌─────────────────────────────────────────────────┐
│                   VERCEL                        │
│  ┌───────────────────────────────────────────┐  │
│  │     Next.js Frontend                      │  │
│  │     - Dashboard                           │  │
│  │     - Páginas web                         │  │
│  │     - API Routes                          │  │
│  └───────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────┘
                     │
                     │ (Consulta estado)
                     ▼
┌─────────────────────────────────────────────────┐
│         VPS/Railway/Heroku                      │
│  ┌───────────────────────────────────────────┐  │
│  │   Monitor EPP (Node.js)                   │  │
│  │   - Monitorea endpoint cada 5s            │  │
│  │   - Detecta alertas                       │  │
│  │   - Envía WhatsApp                        │  │
│  │   - WhatsApp Web Session                  │  │
│  └───────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────┘
                     │
                     │ (Consulta cada 5s)
                     ▼
┌─────────────────────────────────────────────────┐
│         Backend IA (Cloudflare)                 │
│         https://lodging-sir-...                 │
│         /api/logs                               │
└─────────────────────────────────────────────────┘
```

---

## 📋 Checklist de Despliegue

### Frontend (Vercel)
- [ ] Subir código a GitHub
- [ ] Conectar repositorio en Vercel
- [ ] Configurar variables de entorno (si las hay)
- [ ] Desplegar
- [ ] Verificar que la web funcione

### Monitor EPP (Servidor separado)
- [ ] Elegir proveedor de servidor
- [ ] Instalar Node.js
- [ ] Clonar proyecto
- [ ] Instalar dependencias (`npm install`)
- [ ] **IMPORTANTE**: Autenticar WhatsApp la primera vez
  - Cambiar `headless: false` en `public/bot.mjs`
  - Ejecutar una vez manualmente
  - Escanear código QR
  - Cambiar de vuelta a `headless: true`
- [ ] Configurar PM2 o gestor de procesos
- [ ] Iniciar monitor
- [ ] Verificar logs
- [ ] Configurar auto-reinicio

---

## 🔧 Configuración de WhatsApp para Producción

### Primera Autenticación (Una sola vez)

1. **En tu servidor**, edita `public/bot.mjs`:
```javascript
puppeteer: {
    headless: false,  // Cambiar a false temporalmente
    // ...
}
```

2. **Ejecuta el bot manualmente**:
```bash
node public/bot.mjs
```

3. **Conecta con SSH con port forwarding** (para ver el QR):
```bash
ssh -L 6080:localhost:6080 usuario@tu-servidor
```

O usa **bot-with-gui.mjs** que genera el QR en terminal:
```bash
node public/bot-with-gui.mjs
```

4. **Escanea el código QR** con WhatsApp

5. **Una vez autenticado**, cambia de vuelta:
```javascript
headless: true,
```

6. **Inicia el monitor con PM2**:
```bash
pm2 start monitor-epp-alerts.js --name epp-monitor
```

La sesión se guardará en `.wwebjs_auth/` y no necesitarás autenticar de nuevo.

---

## 🚨 Troubleshooting

### Error: WhatsApp no conecta en servidor

**Problema**: Falta Chromium o dependencias

**Solución Ubuntu/Debian**:
```bash
sudo apt-get update
sudo apt-get install -y \
    chromium-browser \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm1 \
    libasound2
```

**Solución Alpine (Docker)**:
```bash
apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont
```

### Error: Puerto ya en uso

```bash
# Encontrar proceso
lsof -i :3000
# O
netstat -tulpn | grep 3000

# Matar proceso
kill -9 [PID]
```

### Monitor se detiene solo

**Usar PM2**:
```bash
pm2 start monitor-epp-alerts.js --name epp-monitor --restart-delay=3000
```

### Ver logs en tiempo real

```bash
# PM2
pm2 logs epp-monitor --lines 100

# Docker
docker logs -f epp-monitor

# Sistema (journald)
journalctl -u epp-monitor -f
```

---

## 💰 Costos Estimados

### Opción 1: Vercel (Frontend) + DigitalOcean (Monitor)
- Vercel: **Gratis** (Hobby tier)
- DigitalOcean VPS: **$6/mes**
- **Total: $6/mes**

### Opción 2: Vercel + Railway
- Vercel: **Gratis**
- Railway: **Gratis** (hasta 500 horas/mes) o **$5/mes**
- **Total: Gratis o $5/mes**

### Opción 3: Todo en VPS
- VPS más grande: **$12-20/mes**
- **Total: $12-20/mes**

---

## 🎯 Comandos Rápidos

### Desarrollo Local
```bash
# Next.js + Monitor EPP
npm run dev:monitor

# Solo Next.js
npm run dev

# Solo Monitor
npm run monitor
```

### Producción
```bash
# Frontend (Vercel)
vercel --prod

# Monitor (con PM2)
pm2 start monitor-epp-alerts.js --name epp-monitor
pm2 save
pm2 startup
```

---

## 📞 Resumen

✅ **Frontend en Vercel**: Funciona perfectamente
❌ **Monitor EPP en Vercel**: NO POSIBLE
✅ **Monitor EPP en servidor separado**: NECESARIO

**Solución más simple**: Vercel (frontend) + Railway.app (monitor)
**Solución más profesional**: Vercel + VPS con PM2
**Desarrollo local**: `npm run dev:monitor`

