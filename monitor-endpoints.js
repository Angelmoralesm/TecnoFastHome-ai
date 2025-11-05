#!/usr/bin/env node

/**
 * Monitor de Endpoints de IA - TecnoHome AI (Node.js)
 * ====================================================
 *
 * Este script monitorea continuamente el estado de los endpoints de los modelos de IA
 * y avisa por consola cuando hay cambios en su disponibilidad.
 *
 * Compatible con Vercel y entornos Node.js
 *
 * Endpoints monitoreados:
 * - Puerto 5000: Detección de Incendios (main.py)
 * - Puerto 5001: Detección de EPP/Seguridad (EPP.py)
 *
 * Uso:
 *     node monitor-endpoints.js [--interval SEGUNDOS] [--timeout SEGUNDOS]
 *
 * Ejemplos:
 *     node monitor-endpoints.js                    # Intervalo por defecto (5 segundos)
 *     node monitor-endpoints.js --interval 10     # Cada 10 segundos
 *     node monitor-endpoints.js --timeout 3       # Timeout de 3 segundos
 */

const https = require('https');
const http = require('http');

class EndpointMonitor {
  constructor(interval = 5, timeout = 2) {
    this.interval = interval;
    this.timeout = timeout * 1000; // Convertir a milisegundos

    // Configuración de endpoints
    this.endpoints = {
      'epp-logs': {
        name: 'Logs de Detección EPP',
        url: 'https://lodging-sir-exhibitions-refine.trycloudflare.com/api/logs',
        type: 'json',
        description: 'Backend IA - Sistema de alertas EPP'
      }
    };

    // Estado anterior de cada endpoint
    this.previousStatus = { 'epp-logs': null };
    this.previousLogCount = { 'epp-logs': 0 };
    this.lastLogs = { 'epp-logs': [] };
  }

  async checkEndpoint(endpointId) {
    const endpoint = this.endpoints[endpointId];
    const startTime = Date.now();

    return new Promise((resolve) => {
      try {
        const url = new URL(endpoint.url);
        const protocol = url.protocol === 'https:' ? https : http;

        const options = {
          hostname: url.hostname,
          port: url.port || (url.protocol === 'https:' ? 443 : 80),
          path: url.pathname,
          method: 'GET',
          timeout: this.timeout,
          headers: {
            'User-Agent': 'TecnoHome-Monitor/1.0'
          }
        };

        const req = protocol.request(options, (res) => {
          const responseTime = Date.now() - startTime;
          const isAvailable = res.statusCode < 400;
          let rawData = '';

          res.on('data', (chunk) => {
            rawData += chunk;
          });

          res.on('end', () => {
            let logs = [];
            let logCount = 0;

            if (isAvailable && endpoint.type === 'json') {
              try {
                logs = JSON.parse(rawData);
                logCount = Array.isArray(logs) ? logs.length : 0;
              } catch (e) {
                // Error parsing JSON
              }
            }

            resolve({
              endpointId,
              isAvailable,
              responseTime,
              endpoint,
              logs,
              logCount
            });
          });
        });

        req.on('error', () => {
          const responseTime = Date.now() - startTime;
          resolve({
            endpointId,
            isAvailable: false,
            responseTime,
            endpoint,
            logs: [],
            logCount: 0
          });
        });

        req.on('timeout', () => {
          req.destroy();
          const responseTime = Date.now() - startTime;
          resolve({
            endpointId,
            isAvailable: false,
            responseTime,
            endpoint,
            logs: [],
            logCount: 0
          });
        });

        req.end();
      } catch (error) {
        resolve({
          endpointId,
          isAvailable: false,
          responseTime: Date.now() - startTime,
          endpoint,
          logs: [],
          logCount: 0
        });
      }
    });
  }

  formatTimestamp() {
    return new Date().toLocaleTimeString();
  }

  logStatusChange(result, previousAvailable) {
    const { endpointId, isAvailable, responseTime, endpoint, logs, logCount } = result;
    const timestamp = this.formatTimestamp();
    const previousLogCount = this.previousLogCount[endpointId] || 0;

    if (previousAvailable === null) {
      // Primera verificación
      const statusIcon = isAvailable ? '🟢' : '🔴';
      const statusText = isAvailable ? 'DISPONIBLE' : 'NO DISPONIBLE';
      const color = isAvailable ? '\x1b[32m' : '\x1b[31m';
      const resetColor = '\x1b[0m';

      console.log(`${color}${statusIcon} PRIMERA VERIFICACIÓN - ${endpoint.name}${resetColor}`);
      console.log(`${color}   Estado: ${statusText}${resetColor}`);
      console.log(`\x1b[36m   Descripción: ${endpoint.description}\x1b[0m`);
      console.log(`\x1b[36m   URL: ${endpoint.url}\x1b[0m`);
      if (isAvailable) {
        console.log(`\x1b[36m   Tiempo de respuesta: ${responseTime}ms\x1b[0m`);
        console.log(`\x1b[36m   Total de logs: ${logCount}\x1b[0m`);
        
        // Mostrar últimos 3 logs
        if (logs.length > 0) {
          console.log(`\x1b[33m   📋 Últimos logs:\x1b[0m`);
          const recentLogs = logs.slice(-3);
          recentLogs.forEach(log => {
            const logTime = new Date(log.timestamp).toLocaleTimeString();
            console.log(`\x1b[90m      [${logTime}] ${log.message}\x1b[0m`);
          });
        }
      }
      console.log();
    } else if (previousAvailable !== isAvailable) {
      // Cambio de estado detectado
      const statusIcon = isAvailable ? '🟢' : '🔴';
      const statusText = isAvailable ? 'VOLVIÓ A ESTAR DISPONIBLE' : 'SE DESCONECTÓ';
      const color = isAvailable ? '\x1b[32m' : '\x1b[31m';
      const resetColor = '\x1b[0m';
      const bgColor = isAvailable ? '\x1b[42m\x1b[30m' : '\x1b[41m\x1b[30m';
      const bgReset = '\x1b[0m';

      console.log(`${bgColor}${' '.repeat(60)}${bgReset}`);
      console.log(`${bgColor} ⚠️  ¡CAMBIO DE ESTADO DETECTADO! ⚠️ ${' '.repeat(25)}${bgReset}`);
      console.log(`${bgColor}${' '.repeat(60)}${bgReset}`);
      console.log();
      console.log(`${color}${statusIcon} [${timestamp}] ${statusText}${resetColor}`);
      console.log(`${color}   Servicio: ${endpoint.name}${resetColor}`);
      console.log(`${color}   URL: ${endpoint.url}${resetColor}`);
      if (isAvailable) {
        console.log(`${color}   Tiempo de respuesta: ${responseTime}ms${resetColor}`);
        console.log(`${color}   Total de logs: ${logCount}${resetColor}`);
      }
      console.log();
    } else if (isAvailable && logCount > previousLogCount) {
      // Nuevos logs detectados
      const newLogsCount = logCount - previousLogCount;
      console.log(`\x1b[43m\x1b[30m${' '.repeat(60)}\x1b[0m`);
      console.log(`\x1b[43m\x1b[30m 📢 ¡NUEVOS LOGS DETECTADOS! ${' '.repeat(29)}\x1b[0m`);
      console.log(`\x1b[43m\x1b[30m${' '.repeat(60)}\x1b[0m`);
      console.log();
      console.log(`\x1b[33m📊 [${timestamp}] ${newLogsCount} nuevo(s) log(s)\x1b[0m`);
      console.log(`\x1b[33m   Total de logs: ${previousLogCount} → ${logCount}\x1b[0m`);
      console.log(`\x1b[33m   Servicio: ${endpoint.name}\x1b[0m`);
      
      // Mostrar nuevos logs
      const newLogs = logs.slice(previousLogCount);
      console.log(`\x1b[36m   🆕 Nuevos logs:\x1b[0m`);
      newLogs.forEach((log, index) => {
        if (index < 5) { // Mostrar máximo 5 logs nuevos
          const logTime = new Date(log.timestamp).toLocaleTimeString();
          console.log(`\x1b[93m      [${logTime}] ${log.message}\x1b[0m`);
        }
      });
      
      if (newLogs.length > 5) {
        console.log(`\x1b[90m      ... y ${newLogs.length - 5} log(s) más\x1b[0m`);
      }
      console.log();
    }
  }

  async monitorOnce() {
    const timestamp = this.formatTimestamp();
    console.log(`\x1b[36m🔍 [${timestamp}] Verificando endpoint...\x1b[0m`);

    for (const endpointId of Object.keys(this.endpoints)) {
      const result = await this.checkEndpoint(endpointId);
      const previousAvailable = this.previousStatus[endpointId];
      const previousLogCount = this.previousLogCount[endpointId] || 0;

      // Log cambio si es necesario (estado o nuevos logs)
      if (previousAvailable !== result.isAvailable || 
          (result.isAvailable && result.logCount > previousLogCount)) {
        this.logStatusChange(result, previousAvailable);
      }

      // Actualizar estados anteriores
      this.previousStatus[endpointId] = result.isAvailable;
      this.previousLogCount[endpointId] = result.logCount;
      this.lastLogs[endpointId] = result.logs;
    }
  }

  async run() {
    console.log('\x1b[36m' + '='.repeat(60) + '\x1b[0m');
    console.log('\x1b[32m🖥️  MONITOR DE ENDPOINTS DE IA - TECNOHOME AI\x1b[0m');
    console.log('\x1b[36m' + '='.repeat(60) + '\x1b[0m');
    console.log(`\x1b[33m⏱️  Intervalo de verificación: ${this.interval} segundos\x1b[0m`);
    console.log(`\x1b[33m⏳ Timeout por request: ${this.timeout / 1000} segundos\x1b[0m`);
    console.log('\x1b[36m' + '='.repeat(60) + '\x1b[0m');
    console.log();

    console.log('\x1b[32m🚀 Iniciando monitoring continuo...\x1b[0m');
    console.log('\x1b[33mPresiona Ctrl+C para detener\x1b[0m');
    console.log();

    // Manejar interrupción
    process.on('SIGINT', () => {
      console.log();
      console.log('\x1b[33m🛑 Monitoring detenido por el usuario\x1b[0m');
      console.log('\x1b[36m¡Hasta luego!\x1b[0m');
      process.exit(0);
    });

    try {
      while (true) {
        await this.monitorOnce();
        await new Promise(resolve => setTimeout(resolve, this.interval * 1000));
      }
    } catch (error) {
      console.error();
      console.error('\x1b[31m❌ Error inesperado:\x1b[0m', error.message);
      process.exit(1);
    }
  }
}

// Función principal
function main() {
  const args = process.argv.slice(2);
  let interval = 5;
  let timeout = 2;

  // Parsear argumentos
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--interval':
      case '-i':
        interval = parseInt(args[++i]);
        break;
      case '--timeout':
      case '-t':
        timeout = parseInt(args[++i]);
        break;
      case '--help':
      case '-h':
        console.log(`
Monitor de Endpoints de IA para TecnoHome AI

Uso:
  node monitor-endpoints.js [opciones]

Opciones:
  -i, --interval <segundos>    Intervalo entre verificaciones (default: 5)
  -t, --timeout <segundos>     Timeout por request (default: 2)
  -h, --help                   Mostrar esta ayuda

Ejemplos:
  node monitor-endpoints.js                    # Intervalo por defecto (5s)
  node monitor-endpoints.js --interval 10     # Cada 10 segundos
  node monitor-endpoints.js --timeout 3       # Timeout de 3 segundos
  node monitor-endpoints.js -i 2 -t 1         # Cada 2s, timeout 1s
        `);
        process.exit(0);
        break;
    }
  }

  // Validar argumentos
  if (isNaN(interval) || interval < 1) {
    console.error('\x1b[31m❌ Error: El intervalo debe ser un número mayor a 0\x1b[0m');
    process.exit(1);
  }

  if (isNaN(timeout) || timeout < 1) {
    console.error('\x1b[31m❌ Error: El timeout debe ser un número mayor a 0\x1b[0m');
    process.exit(1);
  }

  // Crear e iniciar monitor
  const monitor = new EndpointMonitor(interval, timeout);
  monitor.run();
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { EndpointMonitor };
