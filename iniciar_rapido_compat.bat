@echo off
REM Script de inicio rapido compatible con Windows
title Sistema de Monitoreo con IA - Inicio Rapido

echo.
echo ================================================
echo      INICIO RAPIDO DEL SISTEMA
echo ================================================
echo.
echo Este script inicia el sistema sin instalar
echo dependencias (util despues de la primera vez).
echo.
echo IMPORTANTE: No presiones Ctrl+C durante la ejecucion
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo.
    echo ERROR: No se encuentra package.json
    echo.
    echo SOLUCION:
    echo - Asegurate de ejecutar este script desde la carpeta raiz del proyecto
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
    echo ERROR: No se encuentra main.py
    echo.
    echo Ejecuta primero 'iniciar_sistema_compat.bat'
    pause
    exit /b 1
) else (
    echo [OK] main.py encontrado
)

if not exist "public\EPP.py" (
    echo ERROR: No se encuentra EPP.py
    echo.
    echo Ejecuta primero 'iniciar_sistema_compat.bat'
    pause
    exit /b 1
) else (
    echo [OK] EPP.py encontrado
)

REM Verificar que Python este disponible
echo.
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

echo ERROR: No se pudo encontrar Python instalado
echo Instala Python desde https://python.org
pause
exit /b 1

:python_found
echo [OK] Python encontrado: %PYTHON_CMD%

echo.
echo ================================================
echo Iniciando servidores de IA...
echo ================================================
echo.

cd public
echo Iniciando servidor de deteccion de incendios...
start "Servidor de Fuego - Puerto 5000" %PYTHON_CMD% main.py --port 5000
timeout /t 2 /nobreak >nul

echo Iniciando servidor de deteccion de EPP...
start "Servidor de EPP - Puerto 5001" %PYTHON_CMD% EPP.py --port 5001

echo.
echo [OK] Servidores iniciados correctamente
echo.
echo Esperando que los servidores se inicien...
timeout /t 3 /nobreak >nul

echo.
echo ================================================
echo Iniciando Dashboard...
echo ================================================
echo.

cd ..
echo Iniciando servidor de Next.js...
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
echo      SISTEMA LISTO
echo ================================================
echo.
echo [OK] Servidor de Incendios: http://localhost:5000/video_feed
echo [OK] Servidor de EPP: http://localhost:5001/video_feed
echo [OK] Dashboard: http://localhost:3000
echo.
echo INSTRUCCIONES:
echo 1. El dashboard se abrio en tu navegador
echo 2. Haz clic en "Ver Camara" en cualquiera de las tarjetas
echo 3. Disfruta del sistema de deteccion inteligente!
echo.
echo IMPORTANTE:
echo - No cierres esta ventana mientras uses el sistema
echo - Los servidores se ejecutan en segundo plano
echo.
echo ================================================
echo.
echo OPCIONES:
echo [1] Mantener esta ventana abierta (recomendado)
echo [2] Cerrar esta ventana
echo [3] Reiniciar sistema rapido
echo.
echo Elige una opcion (1/2/3) o presiona Enter para mantener abierta:

set /p opcion=
if "!opcion!"=="2" (
    echo.
    echo Cerrando...
    echo Los servidores seguiran ejecutandose en segundo plano
    timeout /t 2 >nul
    exit /b 0
) else if "!opcion!"=="3" (
    echo.
    echo Reiniciando sistema rapido...
    timeout /t 2 >nul
    goto :inicio_rapido
) else (
    echo.
    echo Manteniendo ventana abierta
    echo Presiona Ctrl+C para detener todo el sistema
    echo.
    echo Esperando... (presiona cualquier tecla para mostrar menu)
    pause >nul
    goto :menu_rapido
)

:menu_rapido
echo.
echo ================================================
echo         MENU SISTEMA RAPIDO ACTIVO
echo ================================================
echo.
echo [OK] Sistema ejecutandose
echo.
echo [R] Revisar estado de servidores
echo [N] Abrir navegador
echo [S] Salir
echo.
echo Presiona la tecla correspondiente:

set /p menu_opcion=
if /i "!menu_opcion!"=="R" (
    echo.
    echo Revisando servidores...
    netstat -ano | findstr "5000\|5001\|3000" 2>nul | findstr LISTENING >nul 2>nul
    if !errorlevel! equ 0 (
        echo [OK] Servidores activos
    ) else (
        echo [WARN] Verifica que los servidores esten ejecutandose
    )
    echo.
    pause
    goto :menu_rapido
) else if /i "!menu_opcion!"=="N" (
    echo.
    echo Abriendo navegador...
    start http://localhost:3000
    goto :menu_rapido
) else if /i "!menu_opcion!"=="S" (
    echo.
    echo Saliendo...
    timeout /t 1 >nul
    exit /b 0
) else (
    echo Opcion no valida
    goto :menu_rapido
)

:inicio_rapido
echo.
echo ================================================
echo      INICIO RAPIDO DEL SISTEMA
echo ================================================
echo.
echo Reinicio completado. Presiona cualquier tecla...
pause >nul
goto :inicio_rapido
