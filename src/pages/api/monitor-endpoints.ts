import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import http from 'http';

interface LogEntry {
  timestamp: string;
  message: string;
}

interface EndpointConfig {
  name: string;
  url: string;
  type: string;
  description: string;
}

interface EndpointStatus {
  endpointId: string;
  name: string;
  url: string;
  description: string;
  isAvailable: boolean;
  lastChecked: string;
  responseTime?: number;
  logCount?: number;
  recentLogs?: LogEntry[];
}

class EndpointMonitor {
  private endpoints: Record<string, EndpointConfig> = {
    'epp-logs': {
      name: 'Logs de Detección EPP',
      url: 'https://lodging-sir-exhibitions-refine.trycloudflare.com/api/logs',
      type: 'json',
      description: 'Backend IA - Sistema de alertas EPP'
    }
  };

  private statusHistory: Map<string, boolean> = new Map();
  private logCountHistory: Map<string, number> = new Map();
  private checkTimeout: number = 10000; // 10 segundos por defecto

  constructor() {
    // Inicializar historiales
    Object.keys(this.endpoints).forEach(endpointId => {
      this.statusHistory.set(endpointId, false);
      this.logCountHistory.set(endpointId, 0);
    });
  }

  private async checkEndpoint(endpointId: string, endpoint: EndpointConfig): Promise<EndpointStatus> {
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
          timeout: this.checkTimeout,
          headers: {
            'User-Agent': 'TecnoHome-Monitor/1.0'
          }
        };

        const req = protocol.request(options, (res) => {
          const responseTime = Date.now() - startTime;
          const isAvailable = res.statusCode ? res.statusCode < 400 : false;
          let rawData = '';

          res.on('data', (chunk) => {
            rawData += chunk.toString();
          });

          res.on('end', () => {
            let logs: LogEntry[] = [];
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
              name: endpoint.name,
              url: endpoint.url,
              description: endpoint.description,
              isAvailable,
              lastChecked: new Date().toISOString(),
              responseTime,
              logCount,
              recentLogs: logs.slice(-5) // Últimos 5 logs
            });
          });
        });

        req.on('error', () => {
          const responseTime = Date.now() - startTime;
          resolve({
            endpointId,
            name: endpoint.name,
            url: endpoint.url,
            description: endpoint.description,
            isAvailable: false,
            lastChecked: new Date().toISOString(),
            responseTime
          });
        });

        req.on('timeout', () => {
          req.destroy();
          const responseTime = Date.now() - startTime;
          resolve({
            endpointId,
            name: endpoint.name,
            url: endpoint.url,
            description: endpoint.description,
            isAvailable: false,
            lastChecked: new Date().toISOString(),
            responseTime
          });
        });

        req.end();
      } catch (error) {
        resolve({
          endpointId,
          name: endpoint.name,
          url: endpoint.url,
          description: endpoint.description,
          isAvailable: false,
          lastChecked: new Date().toISOString(),
          responseTime: Date.now() - startTime
        });
      }
    });
  }

  private logStatusChange(endpoint: EndpointStatus, previousStatus: boolean, previousLogCount: number): void {
    const timestamp = new Date().toLocaleTimeString();

    if (!previousStatus && endpoint.isAvailable) {
      // Endpoint se conectó
      console.log(`🟢 [${timestamp}] ENDPOINT CONECTADO`);
      console.log(`   Servicio: ${endpoint.name}`);
      console.log(`   Descripción: ${endpoint.description}`);
      console.log(`   URL: ${endpoint.url}`);
      console.log(`   Tiempo de respuesta: ${endpoint.responseTime}ms`);
      if (endpoint.logCount) {
        console.log(`   Total de logs: ${endpoint.logCount}`);
      }
      console.log();
    } else if (previousStatus && !endpoint.isAvailable) {
      // Endpoint se desconectó
      console.log(`🔴 [${timestamp}] ENDPOINT DESCONECTADO`);
      console.log(`   Servicio: ${endpoint.name}`);
      console.log(`   URL: ${endpoint.url}`);
      console.log();
    } else if (endpoint.isAvailable && endpoint.logCount && endpoint.logCount > previousLogCount) {
      // Nuevos logs detectados
      const newLogsCount = endpoint.logCount - previousLogCount;
      console.log(`📢 [${timestamp}] NUEVOS LOGS DETECTADOS`);
      console.log(`   Servicio: ${endpoint.name}`);
      console.log(`   Nuevos logs: ${newLogsCount}`);
      console.log(`   Total: ${previousLogCount} → ${endpoint.logCount}`);
      console.log();
    }
  }

  async checkAllEndpoints(): Promise<EndpointStatus[]> {
    const results: EndpointStatus[] = [];

    for (const [endpointId, endpoint] of Object.entries(this.endpoints)) {
      const status = await this.checkEndpoint(endpointId, endpoint);
      const previousStatus = this.statusHistory.get(endpointId) || false;
      const previousLogCount = this.logCountHistory.get(endpointId) || 0;

      // Log cambios de estado o nuevos logs
      if (status.isAvailable !== previousStatus || 
          (status.isAvailable && status.logCount && status.logCount > previousLogCount)) {
        this.logStatusChange(status, previousStatus, previousLogCount);
      }

      // Actualizar historiales
      this.statusHistory.set(endpointId, status.isAvailable);
      if (status.logCount) {
        this.logCountHistory.set(endpointId, status.logCount);
      }

      results.push(status);
    }

    return results;
  }

  getStatusSummary(): { total: number; available: number; unavailable: number; totalLogs: number } {
    let available = 0;
    let unavailable = 0;
    let totalLogs = 0;

    this.statusHistory.forEach((isAvailable) => {
      if (isAvailable) available++;
      else unavailable++;
    });

    this.logCountHistory.forEach((count) => {
      totalLogs += count;
    });

    return {
      total: Object.keys(this.endpoints).length,
      available,
      unavailable,
      totalLogs
    };
  }
}

// Instancia global del monitor para mantener el estado entre requests
let globalMonitor: EndpointMonitor | null = null;

function getMonitor(): EndpointMonitor {
  if (!globalMonitor) {
    globalMonitor = new EndpointMonitor();
  }
  return globalMonitor;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Método no permitido',
      message: 'Solo se permiten requests GET'
    });
  }

  try {
    const monitor = getMonitor();

    // Verificar todos los endpoints
    const endpointStatuses = await monitor.checkAllEndpoints();
    const summary = monitor.getStatusSummary();

    // Preparar respuesta
    const response = {
      timestamp: new Date().toISOString(),
      summary,
      endpoints: endpointStatuses,
      message: `Verificación completada. ${summary.available}/${summary.total} endpoint(s) disponible(s). Total de logs: ${summary.totalLogs}`
    };

    // Log de verificación periódica
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🔍 [${timestamp}] Verificación completada - ${summary.available}/${summary.total} disponible(s), ${summary.totalLogs} log(s) total`);

    res.status(200).json(response);

  } catch (error) {
    console.error('Error en el monitoring de endpoints:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al verificar el estado de los endpoints',
      timestamp: new Date().toISOString()
    });
  }
}
