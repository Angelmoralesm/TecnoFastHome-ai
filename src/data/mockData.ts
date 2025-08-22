import type { Camera, Alert, DashboardStats, SystemStatus } from '../types/dashboard';

// Datos simulados de las cámaras
export const mockCameras: Camera[] = [
  {
    id: 1,
    name: 'Cámara 1 - Detección de Incendios',
    location: 'Área de Soldadura',
    status: 'active',
    detectionType: 'fire',
    lastDetection: 'Hace 2 minutos',
    confidence: 95,
    alerts: 3,
    description: 'Monitoreo continuo para detección temprana de incendios y chispas en el área de soldadura. Utiliza algoritmos de IA para identificar patrones de fuego y humo.',
    ipAddress: '192.168.1.101',
    port: 554,
    streamUrl: 'rtsp://192.168.1.101:554/stream1'
  },
  {
    id: 2,
    name: 'Cámara 2 - Implementos de Seguridad',
    location: 'Área de Ensamblaje',
    status: 'active',
    detectionType: 'safety',
    lastDetection: 'Hace 5 minutos',
    confidence: 87,
    alerts: 7,
    description: 'Verificación automática del uso correcto de EPP (Equipos de Protección Personal) y equipos de seguridad. Detecta ausencia de cascos, guantes, chalecos y otros elementos de protección.',
    ipAddress: '192.168.1.102',
    port: 554,
    streamUrl: 'rtsp://192.168.1.102:554/stream1'
  }
];

// Datos simulados de alertas recientes
export const mockAlerts: Alert[] = [
  {
    id: 1,
    type: 'fire',
    message: 'Posible detección de chispas en área de soldadura - Nivel de confianza: 95%',
    time: 'Hace 2 minutos',
    severity: 'high',
    camera: 'Cámara 1',
    cameraId: 1,
    status: 'active',
    confidence: 95,
    coordinates: { x: 320, y: 240 },
    imageUrl: '/api/alerts/1/snapshot.jpg'
  },
  {
    id: 2,
    type: 'safety',
    message: 'Trabajador sin casco de seguridad detectado en área de ensamblaje',
    time: 'Hace 5 minutos',
    severity: 'medium',
    camera: 'Cámara 2',
    cameraId: 2,
    status: 'active',
    confidence: 87,
    coordinates: { x: 180, y: 120 },
    imageUrl: '/api/alerts/2/snapshot.jpg'
  },
  {
    id: 3,
    type: 'safety',
    message: 'Ausencia de guantes de protección en operación de corte',
    time: 'Hace 8 minutos',
    severity: 'medium',
    camera: 'Cámara 2',
    cameraId: 2,
    status: 'acknowledged',
    confidence: 92,
    coordinates: { x: 450, y: 300 },
    imageUrl: '/api/alerts/3/snapshot.jpg'
  },
  {
    id: 4,
    type: 'fire',
    message: 'Detección de humo en área de soldadura - Verificar ventilación',
    time: 'Hace 12 minutos',
    severity: 'medium',
    camera: 'Cámara 1',
    cameraId: 1,
    status: 'resolved',
    confidence: 78,
    coordinates: { x: 280, y: 200 },
    imageUrl: '/api/alerts/4/snapshot.jpg'
  },
  {
    id: 5,
    type: 'safety',
    message: 'Trabajador sin chaleco reflectivo en área de alto tráfico',
    time: 'Hace 15 minutos',
    severity: 'low',
    camera: 'Cámara 2',
    cameraId: 2,
    status: 'resolved',
    confidence: 85,
    coordinates: { x: 320, y: 180 },
    imageUrl: '/api/alerts/5/snapshot.jpg'
  }
];

// Estadísticas del dashboard
export const mockDashboardStats: DashboardStats = {
  totalCameras: 2,
  activeCameras: 2,
  totalAlerts: 5,
  criticalAlerts: 1,
  systemStatus: 'stable',
  aiAccuracy: 91,
  uptime: '15 días, 8 horas',
  lastUpdate: 'Hace 30 segundos'
};

// Estado del sistema
export const mockSystemStatus: SystemStatus = {
  overall: 'operational',
  cameras: {
    total: 2,
    operational: 2,
    degraded: 0,
    offline: 0
  },
  ai: {
    status: 'operational',
    accuracy: 91,
    lastTraining: 'Hace 3 días',
    modelVersion: 'v2.1.4'
  },
  storage: {
    used: 45.2,
    total: 100,
    retentionDays: 30
  },
  network: {
    status: 'stable',
    latency: 12,
    bandwidth: 85
  }
};

// Configuraciones de detección por cámara
export const mockDetectionConfigs = [
  {
    cameraId: 1,
    enabled: true,
    sensitivity: 85,
    detectionTypes: ['fire', 'smoke', 'sparks'],
    alertThreshold: 75,
    recordingEnabled: true,
    snapshotInterval: 5
  },
  {
    cameraId: 2,
    enabled: true,
    sensitivity: 90,
    detectionTypes: ['no_helmet', 'no_gloves', 'no_vest', 'no_safety_glasses'],
    alertThreshold: 80,
    recordingEnabled: true,
    snapshotInterval: 3
  }
];

// Función para obtener estadísticas en tiempo real
export const getRealTimeStats = () => {
  const now = new Date();
  const activeAlerts = mockAlerts.filter(alert => alert.status === 'active');
  const criticalAlerts = mockAlerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high');
  
  return {
    ...mockDashboardStats,
    totalAlerts: activeAlerts.length,
    criticalAlerts: criticalAlerts.length,
    lastUpdate: 'Hace 30 segundos'
  };
};

// Función para simular nuevas alertas
export const simulateNewAlert = (): Alert => {
  const types: Array<'fire' | 'safety'> = ['fire', 'safety'];
  const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
  const cameras = ['Cámara 1', 'Cámara 2'];
  
  const newAlert: Alert = {
    id: Math.floor(Math.random() * 10000),
    type: types[Math.floor(Math.random() * types.length)]!,
    message: `Nueva alerta simulada - ${Math.random().toString(36).substring(7)}`,
    time: 'Ahora',
    severity: severities[Math.floor(Math.random() * severities.length)]!,
    camera: cameras[Math.floor(Math.random() * cameras.length)]!,
    cameraId: Math.floor(Math.random() * 2) + 1,
    status: 'active',
    confidence: Math.floor(Math.random() * 30) + 70
  };
  
  return newAlert;
}; 