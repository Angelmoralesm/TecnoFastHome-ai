// Tipos para el sistema de cámaras
export interface Camera {
  id: number;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'error';
  detectionType: 'fire' | 'safety' | 'general';
  lastDetection: string;
  confidence: number;
  alerts: number;
  description: string;
  ipAddress?: string;
  port?: number;
  streamUrl?: string;
}

// Tipos para las alertas del sistema
export interface Alert {
  id: number;
  type: 'fire' | 'safety' | 'general';
  message: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  camera: string;
  cameraId: number;
  status: 'active' | 'resolved' | 'acknowledged';
  confidence?: number;
  coordinates?: {
    x: number;
    y: number;
  };
  imageUrl?: string;
}

// Tipos para las estadísticas del dashboard
export interface DashboardStats {
  totalCameras: number;
  activeCameras: number;
  totalAlerts: number;
  criticalAlerts: number;
  systemStatus: 'stable' | 'warning' | 'critical';
  aiAccuracy: number;
  uptime: string;
  lastUpdate: string;
}

// Tipos para la configuración de detección
export interface DetectionConfig {
  cameraId: number;
  enabled: boolean;
  sensitivity: number;
  detectionTypes: string[];
  alertThreshold: number;
  recordingEnabled: boolean;
  snapshotInterval: number;
}

// Tipos para los eventos de detección
export interface DetectionEvent {
  id: string;
  cameraId: number;
  type: 'fire' | 'safety_violation' | 'unauthorized_access' | 'equipment_failure';
  timestamp: Date;
  confidence: number;
  location: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'investigating' | 'resolved';
  assignedTo?: string;
  notes?: string;
}

// Tipos para el estado del sistema
export interface SystemStatus {
  overall: 'operational' | 'degraded' | 'outage';
  cameras: {
    total: number;
    operational: number;
    degraded: number;
    offline: number;
  };
  ai: {
    status: 'operational' | 'degraded' | 'offline';
    accuracy: number;
    lastTraining: string;
    modelVersion: string;
  };
  storage: {
    used: number;
    total: number;
    retentionDays: number;
  };
  network: {
    status: 'stable' | 'unstable' | 'offline';
    latency: number;
    bandwidth: number;
  };
} 