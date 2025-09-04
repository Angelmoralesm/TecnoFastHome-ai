# TecnoFast IA - Plataforma de Monitoreo de Seguridad

## ⚡ Inicio Rápido

### Para Usuarios sin Conocimientos Técnicos:
📖 **[Lee la guía completa aquí](README_USUARIO.md)**

### Scripts de Automatización:
- **`iniciar_sistema.bat`** - Configuración completa (primera vez)
- **`iniciar_sistema_v2.bat`** - Versión mejorada con máxima compatibilidad
- **`iniciar_rapido.bat`** - Inicio rápido (después de la primera instalación)
- **`verificar_sistema.bat`** - Verificación del estado del sistema
- **`inicio_minimal.bat`** - Script minimalista (último recurso)

📖 **[Guía completa para usuarios](README_USUARIO.md)**  
📋 **[Instrucciones técnicas detalladas](INSTRUCCIONES_INICIO.md)**  
🛠️ **[Solución a cierres automáticos](SOLUCION_CIERRES.md)**

## ⚠️ Importante: Si los scripts se cierran automáticamente

**Lee esta guía:** [SOLUCION_CIERRES.md](SOLUCION_CIERRES.md)

**Causas comunes:**
- Ejecutar desde ubicación incorrecta
- Presionar Ctrl+C accidentalmente
- Falta de permisos de administrador
- Versiones antiguas de Windows

**Solución rápida:**
1. Abre CMD como **Administrador**
2. Ve a la carpeta del proyecto: `cd C:\ruta\a\tu\proyecto`
3. Ejecuta: `verificar_sistema.bat`
4. Sigue las instrucciones que aparecen

---

## 🏗️ Descripción del Proyecto

**TecnoFast IA** es una plataforma de monitoreo inteligente diseñada para la empresa TecnoFast, especializada en la fabricación de casas prefabricadas de alto estándar. La plataforma implementa inteligencia artificial en tiempo real para detectar riesgos durante el trabajo interno de preparación de materiales y piezas de las casas.

### 🎯 Objetivo Principal

Nuestro objetivo es garantizar el cumplimiento de las reglas de seguridad durante las horas de trabajo y mejorar la eficiencia operativa mediante:

- **Monitoreo en tiempo real** de las cámaras de los trabajadores
- **Análisis de IA** para detectar violaciones de estándares de seguridad
- **Dashboard principal** con acceso a cámaras en vivo
- **Detección automática** de riesgos y comportamientos inseguros
- **Reportes y alertas** en tiempo real para supervisores

## 🚀 Características Principales

- **🔒 Sistema de Autenticación** - Login seguro para supervisores y administradores
- **📹 Monitoreo de Cámaras** - Acceso en vivo a las cámaras de trabajo
- **🤖 Inteligencia Artificial** - Análisis automático de comportamientos y riesgos
- **📊 Dashboard Intuitivo** - Interfaz moderna y fácil de usar
- **⚡ Tiempo Real** - Alertas y notificaciones instantáneas

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Next.js 14 + TypeScript
- **UI Framework:** Mantine UI v7
- **Estilos:** CSS Modules + PostCSS
- **Fuentes:** Google Fonts (Montserrat)
- **Iconos:** Tabler Icons
- **Base de Datos:** Prisma + SQLite
- **API:** tRPC para comunicación cliente-servidor
- **Autenticación:** Sistema personalizado (a implementar)

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18.17 o superior)
- **npm** o **yarn**
- **Git**

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd tecnohome-ai
```

### 2. Instalar Dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# Configuración de la aplicación
NEXTAUTH_SECRET="tu-secreto-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Configuración de IA (futuro)
AI_API_KEY="tu-api-key-de-ia"
AI_ENDPOINT="https://api.ia-service.com"
```

### 4. Configurar la Base de Datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar las migraciones
npx prisma migrate dev

# (Opcional) Abrir el explorador de Prisma
npx prisma studio
```

### 5. Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run dev
# o
yarn dev

# Modo producción
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
tecnohome-ai/
├── prisma/                 # Esquema y migraciones de base de datos
├── public/                 # Archivos estáticos (imágenes, favicon)
├── src/
│   ├── pages/             # Páginas de Next.js
│   │   ├── api/           # API routes
│   │   └── index.tsx      # Página de login
│   ├── server/            # Lógica del servidor
│   │   ├── api/           # Routers de tRPC
│   │   └── db.ts          # Configuración de base de datos
│   ├── styles/            # Estilos globales
│   ├── theme/             # Configuración del tema de Mantine
│   └── utils/             # Utilidades y helpers
├── .env.local             # Variables de entorno (crear)
├── next.config.js         # Configuración de Next.js
├── package.json           # Dependencias del proyecto
└── tsconfig.json          # Configuración de TypeScript
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run start        # Inicia la aplicación en modo producción

# Base de datos
npm run db:generate  # Genera el cliente de Prisma
npm run db:migrate   # Ejecuta las migraciones
npm run db:studio    # Abre el explorador de Prisma

# Linting y formateo
npm run lint         # Ejecuta ESLint
npm run format       # Formatea el código con Prettier
```

## 🎨 Personalización del Tema

La aplicación utiliza Mantine UI con un tema personalizado. Puedes modificar los colores y estilos en:

```
src/theme/mantine-theme.ts
```

### Colores Principales de TecnoFast:
- **Primario:** #dc2626 (Rojo)
- **Secundario:** #374151 (Gris oscuro)
- **Acento:** #6b7280 (Gris medio)

## 🔐 Sistema de Autenticación

**Estado Actual:** Interfaz de login implementada
**Pendiente:** Lógica de autenticación y autorización

### Usuarios del Sistema:
- **Supervisores:** Acceso a cámaras y monitoreo
- **Administradores:** Gestión completa del sistema
- **Técnicos:** Mantenimiento y configuración


## 🤝 Contribución

### Guías de Desarrollo

1. **pull** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crea** un Pull Request o push a main

### Estándares de Código

- Usa **TypeScript** para todo el código
- Sigue las **convenciones de Next.js**
- Documenta **APIs** y componentes complejos

## 🐛 Solución de Problemas

### Problemas Comunes

**Error de base de datos:**
```bash
npx prisma generate
npx prisma migrate reset
```

**Error de dependencias:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error de build:**
```bash
npm run build
# Revisar errores de TypeScript
```