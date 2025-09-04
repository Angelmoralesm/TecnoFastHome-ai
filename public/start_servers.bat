@echo off
echo Iniciando servidores de detección de IA...
echo Ambos servidores usarán la misma cámara (índice 0)
echo.

echo Iniciando servidor de detección de incendios (puerto 5000)...
start "Fire Detection Server - Port 5000" python main.py --port 5000

timeout /t 3 /nobreak > nul

echo Iniciando servidor de detección de EPP/Seguridad (puerto 5001)...
start "EPP Safety Detection Server - Port 5001" python EPP.py --port 5001

echo.
echo ====================================================
echo Servidores iniciados correctamente:
echo - Detección de Incendios: http://localhost:5000/video_feed
echo - Detección de EPP/Seguridad: http://localhost:5001/video_feed
echo ====================================================
echo.
echo Ambos servidores usan la misma cámara física.
echo En el dashboard:
echo - Cámara 1 se conectará al puerto 5000 (detección de fuego)
echo - Cámara 2 se conectará al puerto 5001 (detección de EPP)
echo.
echo Presiona cualquier tecla para continuar...
pause > nul
