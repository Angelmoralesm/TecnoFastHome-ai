@echo off
echo.
echo ================================================
echo     🚨 INICIO MÍNIMAL - ÚLTIMO RECURSO 🚨
echo ================================================
echo.
echo Si todos los otros scripts fallan, usa este.
echo Este script tiene muchas pausas para que puedas leer.
echo.
pause

echo.
echo PASO 1: Verificando directorio...
echo.
if exist "package.json" (
    echo ✅ Estamos en el directorio correcto
) else (
    echo ❌ ERROR: No estamos en el directorio correcto
    echo.
    echo SOLUCIÓN:
    echo - Ejecuta este script desde la carpeta raíz del proyecto
    echo - La carpeta debe tener package.json
    echo.
    pause
    exit /b 1
)
echo.
pause

echo.
echo PASO 2: Verificando Python...
echo.
python --version
if %errorlevel% equ 0 (
    echo ✅ Python encontrado
) else (
    echo ❌ Python no encontrado
    echo.
    echo SOLUCIÓN:
    echo - Instala Python desde https://python.org
    echo - Marca "Add to PATH" durante instalación
    echo.
    pause
    exit /b 1
)
echo.
pause

echo.
echo PASO 3: Verificando Node.js...
echo.
node --version
if %errorlevel% equ 0 (
    echo ✅ Node.js encontrado
) else (
    echo ❌ Node.js no encontrado
    echo.
    echo SOLUCIÓN:
    echo - Instala Node.js desde https://nodejs.org
    echo.
    pause
    exit /b 1
)
echo.
pause

echo.
echo PASO 4: Verificando archivos...
echo.
if exist "public\main.py" (
    echo ✅ main.py encontrado
) else (
    echo ❌ main.py NO encontrado
    pause
    exit /b 1
)

if exist "public\EPP.py" (
    echo ✅ EPP.py encontrado
) else (
    echo ❌ EPP.py NO encontrado
    pause
    exit /b 1
)
echo.
pause

echo.
echo PASO 5: Iniciando servidores...
echo.
echo Iniciando servidor de incendios (puerto 5000)...
start "Fuego-5000" python public\main.py --port 5000
echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo Iniciando servidor de EPP (puerto 5001)...
start "EPP-5001" python public\EPP.py --port 5001
echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo.
pause

echo.
echo PASO 6: Iniciando dashboard...
echo.
echo Iniciando Next.js...
start "Dashboard" cmd /k "npm run dev"
echo Esperando 8 segundos para que inicie...
timeout /t 8 /nobreak >nul

echo.
pause

echo.
echo PASO 7: Abriendo navegador...
echo.
start http://localhost:3000
echo.
pause

echo.
echo ================================================
echo           ✅ SISTEMA INICIADO ✅
echo ================================================
echo.
echo URLs del sistema:
echo - Dashboard: http://localhost:3000
echo - Fuego: http://localhost:5000/video_feed
echo - EPP: http://localhost:5001/video_feed
echo.
echo IMPORTANTE:
echo - No cierres esta ventana
echo - Los servidores están ejecutándose
echo - Ve al navegador para usar el sistema
echo.
pause

echo.
echo ¿Quieres mantener esta ventana abierta?
echo Presiona S para sí, cualquier tecla para cerrar
set /p mantener=
if /i "!mantener!"=="S" (
    echo.
    echo Ventana manteniéndose abierta...
    echo Presiona Ctrl+C para cerrar todo
    pause
) else (
    echo.
    echo Cerrando...
    echo NOTA: Los servidores seguirán ejecutándose
    timeout /t 2 >nul
)
