@echo off
REM Script mejorado para máxima compatibilidad y evitar cierres
chcp 65001 >nul 2>nul
title Sistema de Monitoreo con IA - Inicio Rápido

REM Habilitar delayed expansion
setlocal enabledelayedexpansion

:inicio_rapido
echo.
echo ================================================
echo      🚀 INICIO RÁPIDO DEL SISTEMA 🚀
echo ================================================
echo.
echo Este script inicia el sistema sin instalar
echo dependencias (útil después de la primera vez).
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

REM Verificar que Python esté disponible antes de intentar ejecutar
echo Verificando disponibilidad de Python...
python --version >nul 2>nul
if %errorlevel% equ 0 (
    set PYTHON_CMD=python
    goto :python_found
)

py --version >nul 2>nul
if %errorlevel% equ 0 (
    set PYTHON_CMD=py
    goto :python_found
)

python3 --version >nul 2>nul
if %errorlevel% equ 0 (
    set PYTHON_CMD=python3
    goto :python_found
)

echo ❌ ERROR: No se pudo encontrar Python instalado
echo Instala Python desde https://python.org
pause
exit /b 1

:python_found
echo ✅ Python encontrado: %PYTHON_CMD%

REM Ahora iniciar el servidor directamente
echo 🚀 Iniciando servidor de detección de incendios...
start "Servidor de Fuego - Puerto 5000" %PYTHON_CMD% main.py --port 5000

timeout /t 2 /nobreak >nul

echo 🚀 Iniciando servidor de detección de EPP...
start "Servidor de EPP - Puerto 5001" %PYTHON_CMD% EPP.py --port 5001

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
echo.
echo OPCIONES:
echo [1] Mantener esta ventana abierta (recomendado)
echo [2] Cerrar esta ventana
echo [3] Reiniciar sistema rápido
echo.
echo Elige una opción (1/2/3) o presiona Enter para mantener abierta:

set /p opcion=
if "!opcion!"=="2" (
    echo.
    echo ⚠️  Cerrando...
    echo Los servidores seguirán ejecutándose en segundo plano
    timeout /t 2 >nul
    exit /b 0
) else if "!opcion!"=="3" (
    echo.
    echo 🔄 Reiniciando sistema rápido...
    timeout /t 2 >nul
    goto :inicio_rapido
) else (
    echo.
    echo ✅ Manteniendo ventana abierta
    echo Presiona Ctrl+C para detener todo el sistema
    echo.
    echo Esperando... (presiona cualquier tecla para mostrar menú)
    pause >nul
    goto :menu_rapido
)

:menu_rapido
echo.
echo ================================================
echo         MENÚ SISTEMA RÁPIDO ACTIVO
echo ================================================
echo.
echo ✅ Sistema ejecutándose
echo.
echo [R] Revisar estado de servidores
echo [N] Abrir navegador
echo [S] Salir
echo.
echo Presiona la tecla correspondiente:

set /p menu_opcion=
if /i "!menu_opcion!"=="R" (
    echo.
    echo 🔍 Revisando servidores...
    netstat -ano | findstr "5000\|5001\|3000" 2>nul | findstr LISTENING >nul 2>nul
    if !errorlevel! equ 0 (
        echo ✅ Servidores activos
    ) else (
        echo ⚠️  Verifica que los servidores estén ejecutándose
    )
    echo.
    pause
    goto :menu_rapido
) else if /i "!menu_opcion!"=="N" (
    echo.
    echo 🌐 Abriendo navegador...
    start http://localhost:3000
    goto :menu_rapido
) else if /i "!menu_opcion!"=="S" (
    echo.
    echo 👋 Saliendo...
    timeout /t 1 >nul
    exit /b 0
) else (
    echo Opción no válida
    goto :menu_rapido
)
