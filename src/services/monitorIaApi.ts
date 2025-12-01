/**
 * Servicio para comunicarse con la API de monitor-ia
 * 
 * Este servicio permite a tecnohome-ai hacer peticiones al backend
 * de monitor-ia para gestionar configuraciones de la IA.
 */

// URL de la API de monitor-ia
// Puedes cambiar esto según tu configuración:
// - Desarrollo local: 'http://localhost:3001'
// - Cloudflare Tunnel: 'https://tu-tunnel.trycloudflare.com'
// - Producción: la URL que corresponda
const MONITOR_IA_API_URL = 'https://lodging-sir-exhibitions-refine.trycloudflare.com';

export interface MonitorIaConfig {
  rtsp_url: string | null;
  conf_persona: number;
  conf_casco: number;
  conf_guantes: number;
  whatsapp_phones: string[];
  whatsapp_enabled: boolean;
}

export interface WhatsAppResponse {
  success: boolean;
  message?: string;
  error?: string;
  remainingSeconds?: number;
  timestamp?: string;
  warning?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  level: 'ALERTA' | 'INFO' | 'PELIGRO' | string;
  message: string;
}

// URL específica para los logs (puede ser diferente del API principal)
const LOGS_API_URL = 'https://lancaster-enough-base-raleigh.trycloudflare.com';

/**
 * Obtiene la configuración actual de la IA
 */
export async function getMonitorIaConfig(): Promise<MonitorIaConfig> {
  try {
    const response = await fetch(`${MONITOR_IA_API_URL}/api/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo configuración: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No se puede conectar con Monitor-IA. Verifica que esté ejecutándose y que la URL sea correcta');
    }
    throw error;
  }
}

/**
 * Actualiza la configuración de la IA
 */
export async function updateMonitorIaConfig(
  config: Partial<MonitorIaConfig>
): Promise<void> {
  try {
    const response = await fetch(`${MONITOR_IA_API_URL}/api/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Error actualizando configuración: ${response.statusText}`);
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No se puede conectar con Monitor-IA. Verifica que esté ejecutándose y que la URL sea correcta');
    }
    throw error;
  }
}

/**
 * Envía una notificación de WhatsApp
 */
export async function sendWhatsAppNotification(
  message: string,
  options?: {
    force?: boolean;
    numbers?: string[];
  }
): Promise<WhatsAppResponse> {
  try {
    const response = await fetch(`${MONITOR_IA_API_URL}/api/send-whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        force: options?.force || false,
        numbers: options?.numbers,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error enviando WhatsApp: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No se puede conectar con Monitor-IA. Verifica que esté ejecutándose y que la URL sea correcta');
    }
    throw error;
  }
}

/**
 * Obtiene los logs/alertas de la IA desde el endpoint de logs
 */
export async function getMonitorIaLogs(): Promise<LogEntry[]> {
  try {
    const response = await fetch(`${LOGS_API_URL}/api/logs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo logs: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No se puede conectar con el servidor de logs. Verifica la conexión.');
    }
    throw error;
  }
}

/**
 * Verifica si la API de monitor-ia está disponible
 */
export async function checkMonitorIaApiHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout

    const response = await fetch(`${MONITOR_IA_API_URL}/api/config`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    // Error esperado cuando el servidor no está disponible
    console.warn('⚠️ Monitor-IA API no está disponible. Asegúrate de que esté ejecutándose y que la URL sea correcta');
    if (error instanceof Error) {
      console.warn('Detalles:', error.message);
    }
    return false;
  }
}

/**
 * Obtiene la URL del stream de video
 */
export function getStreamUrl(): string {
  return `${MONITOR_IA_API_URL}/api/stream`;
}

/**
 * Verifica el estado del stream de video
 */
export async function checkStreamStatus(): Promise<{
  available: boolean;
  message: string;
}> {
  try {
    const response = await fetch(`${MONITOR_IA_API_URL}/api/stream/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error verificando stream: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No se puede conectar con Monitor-IA. Verifica que esté ejecutándose y que la URL sea correcta');
    }
    throw error;
  }
}

