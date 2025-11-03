@echo off
chcp 65001 >nul
title Monitor de Endpoints IA - TecnoHome AI (Node.js)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║         MONITOR DE ENDPOINTS DE IA - NODE.JS                ║
echo ║                    TECNOHOME AI                             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Este script monitorea continuamente el estado de los endpoints
echo de los modelos de IA usando Node.js (compatible con Vercel).
echo.
echo Endpoints monitoreados:
echo   • Puerto 5000: Detección de Incendios (main.py)
echo   • Puerto 5001: Detección de EPP/Seguridad (EPP.py)
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no está instalado o no está en el PATH
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Verificar si el archivo monitor-endpoints.js existe
if not exist "monitor-endpoints.js" (
    echo ❌ ERROR: No se encuentra el archivo monitor-endpoints.js
    echo.
    echo Asegúrate de estar ejecutando este script desde el directorio raíz del proyecto.
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo ✅ Script de monitor encontrado
echo.

REM Mostrar opciones disponibles
echo ┌─ OPCIONES DISPONIBLES ──────────────────────────┐
echo │ 1. Iniciar monitor con configuración por defecto │
echo │    (cada 5 segundos, timeout 2 segundos)        │
echo │                                                 │
echo │ 2. Configuración personalizada                   │
echo └─────────────────────────────────────────────────┘
echo.

set /p choice="Selecciona una opción (1-2): "

if "%choice%"=="1" goto default_config
if "%choice%"=="2" goto custom_config

echo ❌ Opción inválida. Selecciona 1 o 2.
echo.
pause
exit /b 1

:default_config
echo.
echo 🚀 Iniciando monitor con configuración por defecto...
echo.
node monitor-endpoints.js
goto end

:custom_config
echo.
echo ┌─ CONFIGURACIÓN PERSONALIZADA ──────────────────┐
echo │                                               │
echo │ Intervalo: tiempo entre verificaciones       │
echo │ Timeout: tiempo máximo de espera por request │
echo └───────────────────────────────────────────────┘
echo.
set /p interval="Intervalo en segundos (recomendado: 5): "
set /p timeout="Timeout en segundos (recomendado: 2): "

REM Validar entrada
if "%interval%"=="" set interval=5
if "%timeout%"=="" set timeout=2

echo.
echo 🚀 Iniciando monitor con configuración personalizada...
echo    Intervalo: %interval% segundos
echo    Timeout: %timeout% segundos
echo.
node monitor-endpoints.js --interval %interval% --timeout %timeout%
goto end

:end
echo.
echo 🛑 Monitor finalizado.
echo.
pause
