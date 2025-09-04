@echo off
chcp 65001 >nul
title Sistema de Monitoreo con IA - Inicio Rápido

echo.
echo ================================================
echo      🚀 INICIO RÁPIDO DEL SISTEMA 🚀
echo ================================================
echo.
echo Este script inicia el sistema sin instalar
echo dependencias (útil después de la primera vez).
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

echo.
echo ================================================
echo Verificando archivos necesarios...
echo ================================================
echo.

if not exist "public\main.py" (
    echo ❌ ERROR: No se encuentra main.py
    echo.
    echo Ejecuta primero 'iniciar_sistema.bat'
    pause
    exit /b 1
) else (
    echo ✅ main.py encontrado
)

if not exist "public\EPP.py" (
    echo ❌ ERROR: No se encuentra EPP.py
    echo.
    echo Ejecuta primero 'iniciar_sistema.bat'
    pause
    exit /b 1
) else (
    echo ✅ EPP.py encontrado
)

echo.
echo ================================================
echo Iniciando servidores de IA...
echo ================================================
echo.

cd public
echo 🚀 Iniciando servidor de detección de incendios...
start "Servidor de Fuego - Puerto 5000" python main.py --port 5000
timeout /t 2 /nobreak >nul

echo 🚀 Iniciando servidor de detección de EPP...
start "Servidor de EPP - Puerto 5001" python EPP.py --port 5001

echo.
echo ✅ Servidores iniciados correctamente
echo.
echo Esperando que los servidores se inicien...
timeout /t 3 /nobreak >nul

echo.
echo ================================================
echo Iniciando Dashboard...
echo ================================================
echo.

cd ..
echo 🚀 Iniciando servidor de Next.js...
start "Dashboard Next.js" cmd /k "npm run dev"

echo.
echo Esperando que Next.js se inicie...
timeout /t 8 /nobreak >nul

echo.
echo ================================================
echo Abriendo navegador...
echo ================================================
echo.

start http://localhost:3000

echo.
echo ================================================
echo      🎉 ¡SISTEMA LISTO! 🎉
echo ================================================
echo.
echo ✅ Servidor de Incendios: http://localhost:5000/video_feed
echo ✅ Servidor de EPP: http://localhost:5001/video_feed
echo ✅ Dashboard: http://localhost:3000
echo.
echo 📋 INSTRUCCIONES:
echo 1. El dashboard se abrió en tu navegador
echo 2. Haz clic en "Ver Cámara" en cualquiera de las tarjetas
echo 3. ¡Disfruta del sistema de detección inteligente!
echo.
echo ⚠️ IMPORTANTE:
echo - No cierres esta ventana mientras uses el sistema
echo - Los servidores se ejecutan en segundo plano
echo.
echo ================================================
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
