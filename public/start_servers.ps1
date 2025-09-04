# Script de PowerShell para iniciar los servidores de detección de IA
Write-Host "Iniciando servidores de detección de IA..." -ForegroundColor Green
Write-Host "Ambos servidores usarán la misma cámara (índice 0)" -ForegroundColor Yellow
Write-Host ""

# Verificar si Python está instalado
try {
    $pythonVersion = python --version 2>$null
    Write-Host "Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Python no está instalado o no está en el PATH" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar que el archivo main.py existe
if (!(Test-Path "main.py")) {
    Write-Host "ERROR: No se encuentra main.py en el directorio actual" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "Iniciando servidor de detección de incendios (puerto 5000)..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "main.py --port 5000" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "Iniciando servidor de detección de EPP/Seguridad (puerto 5001)..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "EPP.py --port 5001" -WindowStyle Normal

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Servidores iniciados correctamente:" -ForegroundColor Green
Write-Host "- Detección de Incendios: http://localhost:5000/video_feed" -ForegroundColor White
Write-Host "- Detección de EPP/Seguridad: http://localhost:5001/video_feed" -ForegroundColor White
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ambos servidores usan la misma cámara física (índice 0)." -ForegroundColor Yellow
Write-Host "En el dashboard:" -ForegroundColor Cyan
Write-Host "- Cámara 1 se conectará al puerto 5000 (detección de fuego)" -ForegroundColor White
Write-Host "- Cámara 2 se conectará al puerto 5001 (detección de EPP)" -ForegroundColor White
Write-Host ""

Read-Host "Presiona Enter para continuar"
