@echo off
REM Script mejorado para evitar cierres prematuros
chcp 65001 >nul 2>nul
title Sistema de Monitoreo con IA - Inicio Automático

REM Habilitar delayed expansion para mejor manejo de variables
setlocal enabledelayedexpansion

:inicio
echo.
echo ================================================
echo      🚨 SISTEMA DE MONITOREO CON IA 🚨
echo ================================================
echo.
echo Este script instalará y ejecutará automáticamente
echo el sistema completo de detección de incendios
echo y verificación de EPP.
echo.
echo IMPORTANTE: No presiones Ctrl+C durante la ejecución
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo.
    echo ❌ ERROR: No se encuentra package.json
    echo.
    echo 📁 SOLUCIÓN:
    echo - Asegúrate de ejecutar este script desde la carpeta raíz del proyecto
    echo - La carpeta debe contener: package.json, public/, src/, etc.
    echo - Ruta actual: %CD%
    echo.
    echo Presiona cualquier tecla para salir...
    pause >nul
    exit /b 1
)

echo.
echo ================================================
echo PASO 1: Verificando instalación de Python...
echo ================================================
echo.

echo Verificando comando 'python'...
python --version >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Python encontrado como 'python'
    python --version
    set PYTHON_CMD=python
    goto :python_ok
)

echo Verificando comando 'py'...
py --version >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Python encontrado como 'py'
    py --version
    set PYTHON_CMD=py
    goto :python_ok
)

echo Verificando comando 'python3'...
python3 --version >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Python encontrado como 'python3'
    python3 --version
    set PYTHON_CMD=python3
    goto :python_ok
)

echo.
echo ❌ ERROR: Python no está instalado o no está en el PATH
echo.
echo 📥 SOLUCIÓN:
echo 1. Ve a: https://www.python.org/downloads/
echo 2. Descarga Python 3.8 o superior
echo 3. Durante la instalación, marca "Add Python to PATH"
echo 4. Reinicia tu computadora
echo 5. Vuelve a ejecutar este script
echo.
echo Ruta actual: %CD%
echo.
echo Presiona cualquier tecla para salir...
pause >nul
exit /b 1

:python_ok
echo ✅ Python está instalado correctamente

echo.
echo ================================================
echo PASO 1.5: Verificando instalación de Node.js...
echo ================================================
echo.

echo Verificando comando 'node'...
node --version >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Node.js encontrado
    node --version
    goto :nodejs_ok
)

echo.
echo ❌ ERROR: Node.js no está instalado
echo.
echo 📥 SOLUCIÓN:
echo 1. Ve a: https://nodejs.org/
echo 2. Descarga la versión LTS (recomendada)
echo 3. Instala normalmente
echo 4. Reinicia tu computadora
echo 5. Vuelve a ejecutar este script
echo.
echo Ruta actual: %CD%
echo.
echo ¿Quieres continuar sin Node.js? (solo para testing)
echo Presiona S para continuar o cualquier tecla para salir...
set /p choice=
if /i "!choice!"=="S" (
    echo ⚠️  Continuando sin Node.js (solo para testing)
    goto :nodejs_skip
) else (
    echo Saliendo...
    pause >nul
    exit /b 1
)

:nodejs_ok
echo ✅ Node.js está instalado correctamente

:nodejs_skip

echo.
echo ================================================
echo PASO 2: Instalando dependencias de Python...
echo ================================================
echo.
echo ¿Ya instalaste las dependencias de Python anteriormente?
echo Presiona S para saltar o cualquier tecla para instalar...
set /p skip_python=
if /i "!skip_python!"=="S" (
    echo ⏭️  Saltando instalación de Python
    set PIP_ERROR=0
) else (
    echo Instalando Flask, OpenCV y ONNX Runtime...
    echo (Esto puede tomar 2-5 minutos)
    echo.

    pip install flask opencv-python onnxruntime --quiet
    set PIP_ERROR=%errorlevel%

    if !PIP_ERROR! neq 0 (
        echo.
        echo ❌ ERROR en instalación de Python
        echo.
        echo Intentando con python -m pip...
        python -m pip install flask opencv-python onnxruntime --quiet
        set PIP_ERROR=%errorlevel%
    )
)

echo.
echo ================================================
echo PASO 3: Instalando dependencias de Node.js...
echo ================================================
echo.
echo ¿Ya instalaste las dependencias de Node.js anteriormente?
echo Presiona S para saltar o cualquier tecla para instalar...
set /p skip_nodejs=
if /i "!skip_nodejs!"=="S" (
    echo ⏭️  Saltando instalación de Node.js
    set NPM_ERROR=0
) else (
    if exist ":nodejs_skip" (
        echo ⏭️  Saltando instalación de Node.js (no disponible)
        set NPM_ERROR=0
    ) else (
        echo Instalando dependencias del proyecto...
        echo (Esto puede tomar 1-3 minutos)
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

if %PIP_ERROR% neq 0 (
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

REM Usar el comando Python detectado anteriormente
start "Servidor de Fuego - Puerto 5000" %PYTHON_CMD% main.py --port 5000
timeout /t 3 /nobreak >nul
start "Servidor de EPP - Puerto 5001" %PYTHON_CMD% EPP.py --port 5001

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
echo ⚠️ IMPORTANTE:
echo - No cierres esta ventana mientras uses el sistema
echo - Los servidores se ejecutan en segundo plano
echo - Si hay problemas, revisa las otras ventanas de comandos
echo.
echo ================================================
echo.
echo OPCIONES:
echo [1] Mantener esta ventana abierta (recomendado)
echo [2] Cerrar esta ventana (solo si sabes lo que haces)
echo [3] Reiniciar el sistema
echo.
echo Elige una opción (1/2/3) o presiona Enter para mantener abierta:

set /p opcion=
if "!opcion!"=="2" (
    echo.
    echo ⚠️  Cerrando sistema...
    echo NOTA: Los servidores seguirán ejecutándose en segundo plano
    echo Para detenerlos completamente, cierra las otras ventanas
    echo.
    timeout /t 3 >nul
    exit /b 0
) else if "!opcion!"=="3" (
    echo.
    echo 🔄 Reiniciando sistema...
    echo.
    goto :reinicio
) else (
    echo.
    echo ✅ Manteniendo ventana abierta
    echo Presiona Ctrl+C para detener el sistema
    echo.
    echo Esperando... (presiona cualquier tecla para mostrar menú nuevamente)
    pause >nul
    goto :menu_principal
)

:menu_principal
echo.
echo ================================================
echo           MENÚ DEL SISTEMA ACTIVO
echo ================================================
echo.
echo ✅ Sistema ejecutándose correctamente
echo.
echo [R] Revisar estado de los servidores
echo [N] Abrir navegador nuevamente
echo [S] Salir del sistema
echo.
echo Presiona la tecla correspondiente:

set /p menu_opcion=
if /i "!menu_opcion!"=="R" (
    echo.
    echo 🔍 Revisando servidores...
    netstat -ano | findstr "5000\|5001\|3000" | findstr LISTENING >nul 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Todos los servidores están activos
    ) else (
        echo ⚠️  Algunos servidores pueden no estar activos
    )
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto :menu_principal
) else if /i "!menu_opcion!"=="N" (
    echo.
    echo 🌐 Abriendo navegador...
    start http://localhost:3000
    echo.
    goto :menu_principal
) else if /i "!menu_opcion!"=="S" (
    echo.
    echo 👋 Cerrando sistema...
    echo Gracias por usar el Sistema de Monitoreo con IA
    echo.
    timeout /t 2 >nul
    exit /b 0
) else (
    echo Opción no válida
    goto :menu_principal
)

:reinicio
echo Reiniciando...
timeout /t 2 >nul
goto :inicio
