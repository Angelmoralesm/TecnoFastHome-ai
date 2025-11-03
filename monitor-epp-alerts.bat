@echo off
chcp 65001 >nul
title Monitor de Alertas EPP con WhatsApp - TecnoHome AI

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║      MONITOR DE ALERTAS EPP CON NOTIFICACIONES WSP          ║
echo ║                    TECNOHOME AI                             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Este script monitorea continuamente el backend de IA y envía
echo notificaciones por WhatsApp cuando detecta que una persona
echo estuvo sin EPP por 5 segundos consecutivos.
echo.
echo Características:
echo   • Consulta el endpoint cada 5 segundos
echo   • Analiza los últimos 5 logs
echo   • Detecta secuencias de 5 segundos sin EPP
echo   • Envía notificación automática por WhatsApp
echo   • Control de cooldown para evitar spam (30 segundos)
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

REM Verificar si el archivo monitor-epp-alerts.js existe
if not exist "monitor-epp-alerts.js" (
    echo ❌ ERROR: No se encuentra el archivo monitor-epp-alerts.js
    echo.
    echo Asegúrate de estar ejecutando este script desde el directorio raíz del proyecto.
    echo.
    pause
    exit /b 1
)

REM Verificar si el bot de WhatsApp existe
if not exist "public\bot.mjs" (
    echo ❌ ERROR: No se encuentra el bot de WhatsApp (public\bot.mjs)
    echo.
    echo Asegúrate de que el bot de WhatsApp esté configurado correctamente.
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo ✅ Script de monitor encontrado
echo ✅ Bot de WhatsApp encontrado
echo.

echo ┌─ IMPORTANTE ───────────────────────────────────────────────┐
echo │                                                            │
echo │ PRIMERA VEZ:                                               │
echo │ Si es la primera vez que usas el bot de WhatsApp, debes   │
echo │ autenticarte escaneando el código QR.                      │
echo │                                                            │
echo │ COOLDOWN:                                                  │
echo │ Para evitar spam, hay un período de espera de 30 segundos │
echo │ entre cada notificación de WhatsApp.                      │
echo │                                                            │
echo └────────────────────────────────────────────────────────────┘
echo.

set /p confirm="¿Deseas iniciar el monitor? (S/N): "

if /i "%confirm%" neq "S" (
    echo.
    echo ❌ Operación cancelada.
    echo.
    pause
    exit /b 0
)

echo.
echo 🚀 Iniciando monitor de alertas EPP...
echo.
echo ┌─ CONTROLES ────────────────────────────────────────────────┐
echo │ Presiona Ctrl+C para detener el monitor en cualquier      │
echo │ momento y ver las estadísticas.                            │
echo └────────────────────────────────────────────────────────────┘
echo.

node monitor-epp-alerts.js

echo.
echo 🛑 Monitor finalizado.
echo.
pause
