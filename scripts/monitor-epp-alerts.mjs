#!/usr/bin/env node

/**
 * Monitor de Alertas EPP con Notificaciones WhatsApp - TecnoHome AI
 * ================================================================
 *
 * Este script:
 * 1. Consulta el endpoint de logs cada 5 segundos
 * 2. Analiza los últimos 5 logs
 * 3. Verifica si una persona estuvo sin EPP por 5 segundos consecutivos
 * 4. Envía notificación por WhatsApp cuando se detecta la condición
 *
 * Uso:
 *     node monitor-epp-alerts.js
 */

const https = require('https');
const http = require('http');
const { exec } = require('child_process');
const path = require('path');

class EPPAlertMonitor {
  constructor() {
    this.endpointUrl = 'https://lodging-sir-exhibitions-refine.trycloudflare.com/api/logs';
    this.checkInterval = 5000; // 5 segundos
    this.alertThreshold = 5; // 5 segundos
    this.requestTimeout = 10000; // 10 segundos timeout
    
    // Control de alertas para evitar spam
    this.lastAlertTime = null;
    this.alertCooldown = 30000; // 30 segundos entre alertas
    this.alertedTimestamps = new Set(); // Para no alertar dos veces por los mismos logs
    
    // Estadísticas
    this.stats = {
      totalChecks: 0,
      alertsSent: 0,
      errors: 0,
      lastCheckTime: null
    };
  }

  /**
   * Parsea un timestamp del formato "2025-11-02 19:31:04" a Date
   */
  parseTimestamp(timestamp) {
    // Formato: "2025-11-02 19:31:04"
    const [datePart, timePart] = timestamp.split(' ');
    return new Date(`${datePart}T${timePart}`);
  }

  /**
   * Calcula la diferencia en segundos entre dos timestamps
   */
  getDifferenceInSeconds(timestamp1, timestamp2) {
    const date1 = this.parseTimestamp(timestamp1);
    const date2 = this.parseTimestamp(timestamp2);
    return Math.abs((date2 - date1) / 1000);
  }

  /**
   * Obtiene los logs del endpoint
   */
  async fetchLogs() {
    return new Promise((resolve, reject) => {
      try {
        const url = new URL(this.endpointUrl);
        const protocol = url.protocol === 'https:' ? https : http;

        const options = {
          hostname: url.hostname,
          port: url.port || (url.protocol === 'https:' ? 443 : 80),
          path: url.pathname,
          method: 'GET',
          timeout: this.requestTimeout,
          headers: {
            'User-Agent': 'TecnoHome-EPP-Monitor/1.0'
          }
        };

        const req = protocol.request(options, (res) => {
          let rawData = '';

          res.on('data', (chunk) => {
            rawData += chunk;
          });

          res.on('end', () => {
            try {
              if (res.statusCode >= 400) {
                reject(new Error(`HTTP ${res.statusCode}`));
                return;
              }

              const logs = JSON.parse(rawData);
              resolve(logs);
            } catch (e) {
              reject(new Error(`Error parsing JSON: ${e.message}`));
            }
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });

        req.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Analiza los últimos 5 logs para detectar si hay una secuencia de 5 segundos sin EPP
   */
  analyzeLastFiveLogs(logs) {
    if (!Array.isArray(logs) || logs.length < 5) {
      return null;
    }

    // Tomar los últimos 5 logs
    const lastFive = logs.slice(-5);

    // Verificar que todos tengan timestamp y message
    const allValid = lastFive.every(log => log.timestamp && log.message);
    if (!allValid) {
      return null;
    }

    // Obtener el primer y último timestamp de los últimos 5 logs
    const firstTimestamp = lastFive[0].timestamp;
    const lastTimestamp = lastFive[4].timestamp;

    // Calcular diferencia en segundos
    const diffSeconds = this.getDifferenceInSeconds(firstTimestamp, lastTimestamp);

    // Verificar si están dentro del rango de 5 segundos
    if (diffSeconds <= this.alertThreshold) {
      // Crear un identificador único para este grupo de logs
      const logSignature = `${firstTimestamp}_${lastTimestamp}`;

      // Verificar si ya alertamos sobre estos logs
      if (this.alertedTimestamps.has(logSignature)) {
        return null; // Ya alertamos sobre estos logs
      }

      // Verificar cooldown (no alertar muy seguido)
      if (this.lastAlertTime) {
        const timeSinceLastAlert = Date.now() - this.lastAlertTime;
        if (timeSinceLastAlert < this.alertCooldown) {
          console.log(`⏳ Cooldown activo (${Math.round((this.alertCooldown - timeSinceLastAlert) / 1000)}s restantes)`);
          return null;
        }
      }

      return {
        detected: true,
        firstTimestamp,
        lastTimestamp,
        diffSeconds,
        logs: lastFive,
        signature: logSignature
      };
    }

    return null;
  }

  /**
   * Envía una notificación por WhatsApp
   */
  async sendWhatsAppNotification(alertData) {
    return new Promise((resolve, reject) => {
      const { firstTimestamp, lastTimestamp, diffSeconds, logs } = alertData;

      console.log('\x1b[43m\x1b[30m' + '='.repeat(70) + '\x1b[0m');
      console.log('\x1b[43m\x1b[30m 🚨 ¡ALERTA EPP DETECTADA! 🚨' + ' '.repeat(41) + '\x1b[0m');
      console.log('\x1b[43m\x1b[30m' + '='.repeat(70) + '\x1b[0m');
      console.log();
      console.log(`\x1b[31m⚠️  Persona sin EPP por ${diffSeconds.toFixed(1)} segundos consecutivos\x1b[0m`);
      console.log(`\x1b[33m📅 Desde: ${firstTimestamp}\x1b[0m`);
      console.log(`\x1b[33m📅 Hasta: ${lastTimestamp}\x1b[0m`);
      console.log();
      console.log(`\x1b[36m📋 Logs detectados:\x1b[0m`);
      logs.forEach((log, index) => {
        console.log(`\x1b[90m   ${index + 1}. [${log.timestamp}] ${log.message}\x1b[0m`);
      });
      console.log();
      console.log(`\x1b[32m📱 Enviando notificación por WhatsApp...\x1b[0m`);

      // Ejecutar el bot de WhatsApp
      const botPath = path.join(__dirname, 'public', 'bot.mjs');
      
      exec(`node "${botPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`\x1b[31m❌ Error al enviar WhatsApp: ${error.message}\x1b[0m`);
          this.stats.errors++;
          reject(error);
          return;
        }

        console.log(`\x1b[32m✅ Notificación WhatsApp enviada exitosamente\x1b[0m`);
        console.log(stdout);
        
        if (stderr) {
          console.log(`\x1b[33mWarnings: ${stderr}\x1b[0m`);
        }

        this.stats.alertsSent++;
        this.lastAlertTime = Date.now();
        this.alertedTimestamps.add(alertData.signature);

        // Limpiar alertas antiguas del Set (más de 5 minutos)
        setTimeout(() => {
          this.alertedTimestamps.delete(alertData.signature);
        }, 300000);

        resolve();
      });
    });
  }

  /**
   * Realiza una verificación completa
   */
  async performCheck() {
    const timestamp = new Date().toLocaleTimeString();
    this.stats.totalChecks++;
    this.stats.lastCheckTime = new Date().toISOString();

    try {
      console.log(`\x1b[36m🔍 [${timestamp}] Verificando logs... (Check #${this.stats.totalChecks})\x1b[0m`);

      // Obtener logs del endpoint
      const logs = await this.fetchLogs();
      
      if (!logs || logs.length === 0) {
        console.log(`\x1b[33m⚠️  No hay logs disponibles\x1b[0m`);
        return;
      }

      console.log(`\x1b[36m   📊 Total de logs: ${logs.length}\x1b[0m`);

      // Analizar últimos 5 logs
      const alertData = this.analyzeLastFiveLogs(logs);

      if (alertData) {
        // ¡Alerta detectada!
        await this.sendWhatsAppNotification(alertData);
      } else {
        console.log(`\x1b[32m   ✓ Sin alertas (últimos 5 logs OK)\x1b[0m`);
      }

    } catch (error) {
      this.stats.errors++;
      console.error(`\x1b[31m❌ [${timestamp}] Error: ${error.message}\x1b[0m`);
    }

    console.log();
  }

  /**
   * Muestra las estadísticas del monitor
   */
  showStats() {
    console.log('\x1b[36m' + '='.repeat(60) + '\x1b[0m');
    console.log('\x1b[32m📊 ESTADÍSTICAS DEL MONITOR\x1b[0m');
    console.log('\x1b[36m' + '='.repeat(60) + '\x1b[0m');
    console.log(`Total de verificaciones: ${this.stats.totalChecks}`);
    console.log(`Alertas enviadas: ${this.stats.alertsSent}`);
    console.log(`Errores: ${this.stats.errors}`);
    console.log(`Última verificación: ${this.stats.lastCheckTime || 'N/A'}`);
    console.log('\x1b[36m' + '='.repeat(60) + '\x1b[0m');
    console.log();
  }

  /**
   * Inicia el monitoring continuo
   */
  async start() {
    console.log('\x1b[36m' + '='.repeat(70) + '\x1b[0m');
    console.log('\x1b[32m🖥️  MONITOR DE ALERTAS EPP - TECNOHOME AI\x1b[0m');
    console.log('\x1b[36m' + '='.repeat(70) + '\x1b[0m');
    console.log(`\x1b[33m📡 Endpoint: ${this.endpointUrl}\x1b[0m`);
    console.log(`\x1b[33m⏱️  Intervalo de verificación: ${this.checkInterval / 1000} segundos\x1b[0m`);
    console.log(`\x1b[33m⚠️  Umbral de alerta: ${this.alertThreshold} segundos consecutivos sin EPP\x1b[0m`);
    console.log(`\x1b[33m🔕 Cooldown entre alertas: ${this.alertCooldown / 1000} segundos\x1b[0m`);
    console.log('\x1b[36m' + '='.repeat(70) + '\x1b[0m');
    console.log();
    console.log('\x1b[32m🚀 Iniciando monitoring continuo...\x1b[0m');
    console.log('\x1b[33mPresiona Ctrl+C para detener\x1b[0m');
    console.log();

    // Manejar interrupción
    process.on('SIGINT', () => {
      console.log();
      console.log('\x1b[33m🛑 Deteniendo monitor...\x1b[0m');
      console.log();
      this.showStats();
      console.log('\x1b[36m¡Hasta luego!\x1b[0m');
      process.exit(0);
    });

    // Primera verificación inmediata
    await this.performCheck();

    // Verificaciones periódicas
    setInterval(async () => {
      await this.performCheck();
    }, this.checkInterval);
  }
}

// Iniciar monitor
const monitor = new EPPAlertMonitor();
monitor.start().catch((error) => {
  console.error('\x1b[31m❌ Error fatal al iniciar monitor:\x1b[0m', error);
  process.exit(1);
});

