@echo off
chcp 65001 >nul
title Sistema de Monitoreo con IA - Inicio Automático

echo.
echo ================================================
echo      🚨 SISTEMA DE MONITOREO CON IA 🚨
echo ================================================
echo.
echo Este script instalará y ejecutará automáticamente
echo el sistema completo de detección de incendios
echo y verificación de EPP.
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

echo.
echo ================================================
echo PASO 1: Verificando instalación de Python...
echo ================================================
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python no está instalado o no está en el PATH
    echo.
    echo 📥 SOLUCIÓN:
    echo 1. Ve a: https://www.python.org/downloads/
    echo 2. Descarga Python 3.8 o superior
    echo 3. Durante la instalación, marca "Add Python to PATH"
    echo 4. Reinicia tu computadora
    echo 5. Vuelve a ejecutar este script
    echo.
    echo Presiona cualquier tecla para salir...
    pause >nul
    exit /b 1
) else (
    echo ✅ Python está instalado correctamente
)

echo.
echo ================================================
echo PASO 1.5: Verificando instalación de Node.js...
echo ================================================
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no está instalado
    echo.
    echo 📥 SOLUCIÓN:
    echo 1. Ve a: https://nodejs.org/
    echo 2. Descarga la versión LTS (recomendada)
    echo 3. Instala normalmente
    echo 4. Reinicia tu computadora
    echo 5. Vuelve a ejecutar este script
    echo.
    echo Presiona cualquier tecla para salir...
    pause >nul
    exit /b 1
) else (
    echo ✅ Node.js está instalado correctamente
)

echo.
echo ================================================
echo PASO 2: Instalando dependencias de Python...
echo ================================================
echo.
echo Instalando Flask, OpenCV y ONNX Runtime...
echo (Esto puede tomar unos minutos)
echo.

pip install flask opencv-python onnxruntime --quiet

echo.
echo ================================================
echo PASO 3: Instalando dependencias de Node.js...
echo ================================================
echo.
echo Instalando dependencias del proyecto...
echo (Esto puede tomar unos minutos)
echo.

npm install --silent
if %errorlevel% neq 0 (
    echo ❌ ERROR: No se pudieron instalar las dependencias de Node.js
    echo.
    echo 📥 SOLUCIÓN:
    echo - Verifica tu conexión a internet
    echo - Ejecuta como administrador
    echo - O instala manualmente: npm install
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Dependencias de Node.js instaladas correctamente
)

if %errorlevel% neq 0 (
    echo ❌ ERROR: No se pudieron instalar las dependencias de Python
    echo.
    echo 📥 SOLUCIÓN:
    echo - Verifica tu conexión a internet
    echo - Ejecuta como administrador
    echo - O instala manualmente: pip install flask opencv-python onnxruntime
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Dependencias de Python instaladas correctamente
)

echo.
echo ================================================
echo PASO 4: Verificando archivos del sistema...
echo ================================================
echo.

if not exist "public\main.py" (
    echo ❌ ERROR: No se encuentra main.py
    echo.
    pause
    exit /b 1
) else (
    echo ✅ main.py encontrado
)

if not exist "public\EPP.py" (
    echo ❌ ERROR: No se encuentra EPP.py
    echo.
    pause
    exit /b 1
) else (
    echo ✅ EPP.py encontrado
)

if not exist "public\best2.onnx" (
    echo ❌ ERROR: No se encuentra best2.onnx (modelo de fuego)
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Modelo de fuego encontrado
)

if not exist "public\modelo2.onnx" (
    echo ❌ ERROR: No se encuentra modelo2.onnx (modelo EPP)
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Modelo EPP encontrado
)

echo.
echo ================================================
echo PASO 5: Iniciando servidores de IA...
echo ================================================
echo.
echo 🚀 Iniciando servidor de detección de incendios...
echo 🚀 Iniciando servidor de detección de EPP...
echo.

cd public
start "Servidor de Fuego - Puerto 5000" python main.py --port 5000
timeout /t 3 /nobreak >nul
start "Servidor de EPP - Puerto 5001" python EPP.py --port 5001

echo.
echo ✅ Servidores iniciados correctamente
echo.
echo Esperando que los servidores se inicien completamente...
timeout /t 5 /nobreak >nul

echo.
echo ================================================
echo PASO 6: Iniciando Dashboard de Next.js...
echo ================================================
echo.

echo Iniciando servidor de Next.js...
cd ..
start "Dashboard Next.js" cmd /k "npm run dev"

echo.
echo Esperando que Next.js se inicie...
timeout /t 10 /nobreak >nul

echo.
echo ================================================
echo PASO 7: Abriendo navegador...
echo ================================================
echo.

echo Abriendo navegador con el dashboard...
start http://localhost:3000

echo.
echo ================================================
echo      🎉 ¡SISTEMA INICIADO CORRECTAMENTE! 🎉
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
echo ⚠️ NOTA: No cierres esta ventana mientras uses el sistema
echo.
echo ================================================
echo Presiona cualquier tecla para cerrar...
pause >nul
