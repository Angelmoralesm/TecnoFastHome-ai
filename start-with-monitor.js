#!/usr/bin/env node

/**
 * Launcher que inicia Next.js y el Monitor EPP simultáneamente
 * ==========================================================
 * 
 * Este script inicia:
 * 1. El servidor de desarrollo de Next.js (npm run dev)
 * 2. El monitor de alertas EPP con WhatsApp
 * 
 * Uso:
 *     node start-with-monitor.js
 *     npm run dev:monitor
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[36m' + '='.repeat(70) + '\x1b[0m');
console.log('\x1b[32m🚀 INICIANDO TECNOHOME AI CON MONITOR EPP\x1b[0m');
console.log('\x1b[36m' + '='.repeat(70) + '\x1b[0m');
console.log();

let nextProcess = null;
let monitorProcess = null;

// Función para limpiar procesos al salir
function cleanup() {
  console.log();
  console.log('\x1b[33m🛑 Deteniendo servicios...\x1b[0m');
  
  if (nextProcess) {
    nextProcess.kill();
    console.log('\x1b[90m   ✓ Next.js detenido\x1b[0m');
  }
  
  if (monitorProcess) {
    monitorProcess.kill();
    console.log('\x1b[90m   ✓ Monitor EPP detenido\x1b[0m');
  }
  
  console.log();
  console.log('\x1b[36m¡Hasta luego!\x1b[0m');
  process.exit(0);
}

// Manejar señales de terminación
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Iniciar Next.js
console.log('\x1b[34m[1/2] Iniciando Next.js...\x1b[0m');
console.log();

nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

nextProcess.on('error', (error) => {
  console.error('\x1b[31m❌ Error al iniciar Next.js:\x1b[0m', error);
  cleanup();
});

// Esperar 3 segundos antes de iniciar el monitor
setTimeout(() => {
  console.log();
  console.log('\x1b[34m[2/2] Iniciando Monitor de Alertas EPP...\x1b[0m');
  console.log();
  console.log('\x1b[36m' + '='.repeat(70) + '\x1b[0m');
  console.log();

  const monitorPath = path.join(__dirname, 'monitor-epp-alerts.js');

  monitorProcess = spawn('node', [monitorPath], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env }
  });

  monitorProcess.on('error', (error) => {
    console.error('\x1b[31m❌ Error al iniciar Monitor EPP:\x1b[0m', error);
    cleanup();
  });

  monitorProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`\x1b[31m❌ Monitor EPP terminó con código: ${code}\x1b[0m`);
    }
  });

}, 3000);

nextProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`\x1b[31m❌ Next.js terminó con código: ${code}\x1b[0m`);
  }
  cleanup();
});

console.log();
console.log('\x1b[33m💡 Presiona Ctrl+C para detener todos los servicios\x1b[0m');
console.log();

