@echo off
REM Script para verificar que el sistema esté correctamente configurado
title Verificación del Sistema de Monitoreo con IA

echo.
echo ================================================
echo      🔍 VERIFICACIÓN DEL SISTEMA 🔍
echo ================================================
echo.
echo Este script verifica que todos los componentes
echo necesarios estén instalados y configurados.
echo.

echo 📋 VERIFICANDO COMPONENTES...
echo.

REM Verificar Python
echo 1. Verificando Python...
python --version >nul 2>nul
if %errorlevel% equ 0 (
    echo   ✅ Python: INSTALADO
    python --version
) else (
    py --version >nul 2>nul
    if %errorlevel% equ 0 (
        echo   ✅ Python: INSTALADO (como 'py')
        py --version
    ) else (
        echo   ❌ Python: NO INSTALADO
        echo     📥 Descarga desde: https://www.python.org/downloads/
    )
)

echo.
echo 2. Verificando Node.js...
node --version >nul 2>nul
if %errorlevel% equ 0 (
    echo   ✅ Node.js: INSTALADO
    node --version
) else (
    echo   ❌ Node.js: NO INSTALADO
    echo     📥 Descarga desde: https://nodejs.org/
)

echo.
echo 3. Verificando npm...
npm --version >nul 2>nul
if %errorlevel% equ 0 (
    echo   ✅ npm: INSTALADO
    npm --version
) else (
    echo   ❌ npm: NO INSTALADO
    echo     📥 Se instala automáticamente con Node.js
)

echo.
echo 4. Verificando pip...
pip --version >nul 2>nul
if %errorlevel% equ 0 (
    echo   ✅ pip: INSTALADO
    pip --version
) else (
    echo   ❌ pip: NO INSTALADO
    echo     📥 Se instala automáticamente con Python
)

echo.
echo ================================================
echo      📁 VERIFICANDO ARCHIVOS 📁
echo ================================================
echo.

echo 5. Verificando archivos del proyecto...
if exist "package.json" (
    echo   ✅ package.json: ENCONTRADO
) else (
    echo   ❌ package.json: NO ENCONTRADO
)

if exist "public\main.py" (
    echo   ✅ main.py: ENCONTRADO
) else (
    echo   ❌ main.py: NO ENCONTRADO
)

if exist "public\EPP.py" (
    echo   ✅ EPP.py: ENCONTRADO
) else (
    echo   ❌ EPP.py: NO ENCONTRADO
)

if exist "public\best2.onnx" (
    echo   ✅ Modelo de fuego (best2.onnx): ENCONTRADO
) else (
    echo   ❌ Modelo de fuego (best2.onnx): NO ENCONTRADO
)

if exist "public\modelo2.onnx" (
    echo   ✅ Modelo EPP (modelo2.onnx): ENCONTRADO
) else (
    echo   ❌ Modelo EPP (modelo2.onnx): NO ENCONTRADO
)

if exist "src\pages\dashboard.tsx" (
    echo   ✅ Dashboard React: ENCONTRADO
) else (
    echo   ❌ Dashboard React: NO ENCONTRADO
)

echo.
echo ================================================
echo      🔧 PRUEBA DE FUNCIONAMIENTO 🔧
echo ================================================
echo.

echo 6. Probando dependencias de Python...
python -c "import flask, cv2, onnxruntime; print('✅ Dependencias de Python: OK')" 2>nul
if %errorlevel% neq 0 (
    echo   ❌ Dependencias de Python: FALTAN
    echo     📦 Ejecuta: pip install flask opencv-python onnxruntime
) else (
    echo   ✅ Dependencias de Python: OK
)

echo.
echo 7. Probando dependencias de Node.js...
if exist "node_modules" (
    echo   ✅ node_modules: EXISTE
) else (
    echo   ❌ node_modules: NO EXISTE
    echo     📦 Ejecuta: npm install
)

echo.
echo ================================================
echo      📊 RESULTADO FINAL 📊
echo ================================================
echo.

REM Contar componentes faltantes
set /a faltantes=0

python --version >nul 2>nul
if %errorlevel% neq 0 (
    if %errorlevel% neq 0 py --version >nul 2>nul
    if %errorlevel% neq 0 set /a faltantes+=1
)

node --version >nul 2>nul
if %errorlevel% neq 0 set /a faltantes+=1

if not exist "public\main.py" set /a faltantes+=1
if not exist "public\EPP.py" set /a faltantes+=1
if not exist "public\best2.onnx" set /a faltantes+=1
if not exist "public\modelo2.onnx" set /a faltantes+=1

if %faltantes% equ 0 (
    echo 🎉 ¡SISTEMA LISTO PARA USAR!
    echo.
    echo ✅ Todos los componentes están instalados
    echo ✅ Todos los archivos están en su lugar
    echo.
    echo 🚀 Puedes ejecutar:
    echo    - iniciar_sistema.bat (primera vez)
    echo    - iniciar_rapido.bat (uso diario)
    echo.
) else (
    echo ⚠️  SISTEMA INCOMPLETO
    echo.
    echo ❌ Faltan %faltantes% componentes importantes
    echo.
    echo 📋 SOLUCIONES:
    echo    - Instala Python desde: https://www.python.org/downloads/
    echo    - Instala Node.js desde: https://nodejs.org/
    echo    - Verifica que todos los archivos estén en sus carpetas
    echo.
    echo 🔄 Después de instalar, ejecuta este script nuevamente
    echo 🔄 O ejecuta 'iniciar_sistema.bat' para instalación automática
)

echo.
echo ================================================
echo Presiona cualquier tecla para continuar...
pause >nul
