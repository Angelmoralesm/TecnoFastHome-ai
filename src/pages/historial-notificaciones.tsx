import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Stack,
  Box,
  AppShell,
  Avatar,
  Menu,
  Badge,
  Alert,
  Loader,
  ActionIcon
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconHome,
  IconChartPie,
  IconSettings as IconSettingsNav,
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
  IconShieldCheck,
  IconRefresh,
  IconRobot,
  IconBell,
  IconClock,
  IconAlertTriangle,
  IconPlugConnected,
  IconPlugConnectedX,
  IconDatabase
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import {
  getMonitorIaLogs,
  checkMonitorIaApiHealth,
  type LogEntry
} from '~/services/monitorIaApi';
import mockNotificationsData from '~/data/mockNotifications.json';

export default function HistorialNotificacionesPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Verificar disponibilidad de la API y cargar historial
  useEffect(() => {
    checkApiAndLoadHistory();
  }, []);

  const loadMockData = () => {
    // Cargar datos mock con la nueva estructura
    setNotificationHistory(mockNotificationsData.notifications as LogEntry[]);
    setUsingMockData(true);
    notifications.show({
      title: '📋 Datos de demostración',
      message: 'Mostrando datos de ejemplo. Conecta el backend para ver datos reales.',
      color: 'blue',
      autoClose: 4000
    });
  };

  const checkApiAndLoadHistory = async () => {
    setLoading(true);
    setUsingMockData(false);
    try {
      const isAvailable = await checkMonitorIaApiHealth();
      setApiAvailable(isAvailable);

      if (isAvailable) {
        await loadNotificationHistory();
      } else {
        // Fallback a datos mockeados
        loadMockData();
      }
    } catch (error) {
      console.error('Error verificando API:', error);
      // Fallback a datos mockeados en caso de error
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationHistory = async () => {
    try {
      const logs = await getMonitorIaLogs();
      setNotificationHistory(logs);
      setUsingMockData(false);
    } catch (error) {
      console.error('Error cargando historial de notificaciones:', error);
      // Fallback a datos mockeados
      loadMockData();
      notifications.show({
        title: '⚠️ Error de conexión',
        message: 'Usando datos de demostración',
        color: 'yellow',
        autoClose: 3000
      });
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Intentar reconectar con la API
    const isAvailable = await checkMonitorIaApiHealth();
    setApiAvailable(isAvailable);
    
    if (isAvailable) {
      await loadNotificationHistory();
      notifications.show({
        title: '✅ Actualizado',
        message: 'Historial de notificaciones actualizado desde el servidor',
        color: 'green',
        autoClose: 2000
      });
    } else {
      loadMockData();
    }
    setLoading(false);
  };

  // Función para obtener el color según el nivel y source del log
  const getNotificationStyle = (log: LogEntry) => {
    // Por nivel
    if (log.level === 'PELIGRO') {
      return { bg: '#fef2f2', border: '#fecaca', icon: '#dc2626', badgeColor: 'red' };
    }
    if (log.level === 'ALERTA') {
      return { bg: '#fffbeb', border: '#fde68a', icon: '#f59e0b', badgeColor: 'orange' };
    }
    // Por source
    if (log.source === 'DETECTOR_FUEGO') {
      return { bg: '#fef2f2', border: '#fecaca', icon: '#dc2626', badgeColor: 'red' };
    }
    if (log.source === 'DETECTOR_EPP') {
      return { bg: '#fffbeb', border: '#fde68a', icon: '#f59e0b', badgeColor: 'orange' };
    }
    if (log.source === 'DEMO_TEST') {
      return { bg: '#f0fdf4', border: '#bbf7d0', icon: '#22c55e', badgeColor: 'green' };
    }
    return { bg: '#eff6ff', border: '#bfdbfe', icon: '#3b82f6', badgeColor: 'blue' };
  };

  // Función para obtener el icono según el source
  const getSourceIcon = (source: string) => {
    if (source === 'DETECTOR_FUEGO') return <IconAlertTriangle size={22} color="#ffffff" stroke={2} />;
    if (source === 'DETECTOR_EPP') return <IconAlertTriangle size={22} color="#ffffff" stroke={2} />;
    if (source === 'DEMO_TEST') return <IconBell size={22} color="#ffffff" stroke={2} />;
    return <IconBell size={22} color="#ffffff" stroke={2} />;
  };

  // Función para obtener el nombre legible del source
  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      'DETECTOR_EPP': 'Detector EPP',
      'DETECTOR_FUEGO': 'Detector Fuego',
      'DEMO_TEST': 'Prueba Sistema',
      'SISTEMA': 'Sistema'
    };
    return labels[source] || source;
  };

  return (
    <>
      <Head>
        <title>TecnoHome - Historial de Notificaciones</title>
        <meta name="description" content="Historial de notificaciones del sistema TecnoHome" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <AppShell
        navbar={{
          width: sidebarCollapsed ? 80 : 280,
          breakpoint: 'sm',
          collapsed: { mobile: true }
        }}
        style={{
          backgroundColor: '#f9fafb',
          fontFamily: 'Montserrat, sans-serif',
          minHeight: '100vh'
        }}
      >
        {/* Sidebar */}
        <AppShell.Navbar
          style={{
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e5e7eb',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Logo Section */}
          <Box
            p="xl"
            style={{
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {!sidebarCollapsed && (
              <Group gap="sm">
                <Box
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#dc2626',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  <IconShieldCheck size={24} color="#ffffff" stroke={2.5} />
                </Box>
                <div>
                  <Text
                    size="lg"
                    fw={700}
                    style={{
                      color: '#374151',
                      fontFamily: 'Montserrat, sans-serif',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    TecnoHome
                  </Text>
                  <Text
                    size="xs"
                    style={{
                      color: '#6b7280',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: '500'
                    }}
                  >
                    Sistema de Vigilancia IA
                  </Text>
                </div>
              </Group>
            )}
            
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                color: '#6b7280',
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              {sidebarCollapsed ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />}
            </ActionIcon>
          </Box>

          {/* Navigation Links */}
          <Box p="md">
            <Stack gap="xs">
              <Button
                variant="subtle"
                fullWidth
                justify="flex-start"
                leftSection={<IconHome size={20} />}
                style={{
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '500',
                  height: '48px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
                onClick={() => router.push('/dashboard')}
              >
                {!sidebarCollapsed && 'Dashboard'}
              </Button>

              <Button
                variant="subtle"
                fullWidth
                justify="flex-start"
                leftSection={<IconChartPie size={20} />}
                style={{
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '500',
                  height: '48px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                {!sidebarCollapsed && 'Estadísticas'}
              </Button>

              <Button
                variant="subtle"
                fullWidth
                justify="flex-start"
                leftSection={<IconSettingsNav size={20} />}
                style={{
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '500',
                  height: '48px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
                onClick={() => router.push('/admin')}
              >
                {!sidebarCollapsed && 'Administración'}
              </Button>

              <Button
                variant="subtle"
                fullWidth
                justify="flex-start"
                leftSection={<IconRobot size={20} />}
                style={{
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '500',
                  height: '48px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
                onClick={() => router.push('/config-ia')}
              >
                {!sidebarCollapsed && 'Configuración IA'}
              </Button>

              <Button
                variant="filled"
                fullWidth
                justify="flex-start"
                leftSection={<IconBell size={20} />}
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '600',
                  height: '48px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d97706';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f59e0b';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                }}
              >
                {!sidebarCollapsed && 'Historial'}
              </Button>
            </Stack>
          </Box>

          {/* User Avatar - Fixed at bottom */}
          <Box
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#ffffff'
            }}
          >
            <Menu shadow="0 8px 25px rgba(0, 0, 0, 0.15)" width={220} position="top">
              <Menu.Target>
                <Button
                  variant="subtle"
                  fullWidth
                  justify="flex-start"
                  leftSection={
                    <Avatar 
                      size="sm" 
                      radius="xl"
                      style={{ 
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '700'
                      }}
                    >
                      TF
                    </Avatar>
                  }
                  style={{
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: '500',
                    height: '48px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  {!sidebarCollapsed && 'Usuario'}
                </Button>
              </Menu.Target>

              <Menu.Dropdown 
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '8px',
                  backgroundColor: '#ffffff'
                }}
              >
                <Menu.Label 
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '4px',
                    margin: '4px'
                  }}
                >
                  <Text size="sm" fw={700} style={{ fontFamily: 'Montserrat, sans-serif', color: '#1e293b' }}>
                    Usuario
                  </Text>
                  <Text size="xs" style={{ fontFamily: 'Montserrat, sans-serif', color: '#64748b', fontWeight: '500' }}>
                    Administrador del Sistema
                  </Text>
                </Menu.Label>
                
                <Menu.Divider style={{ margin: '8px 0', borderColor: '#e2e8f0' }} />
                
                <Menu.Item
                  leftSection={<IconLogout size={18} />}
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    transition: 'all 0.2s ease',
                    borderRadius: '4px',
                    margin: '4px',
                    fontWeight: '500',
                    color: '#dc2626'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => router.push('/')}
                >
                  Cerrar Sesión
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        </AppShell.Navbar>

        {/* Main Content */}
        <AppShell.Main>
          <Container size="xl" py="xl">
            {/* Header */}
            <Paper
              p="xl"
              mb="xl"
              radius="md"
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #f59e0b',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.15)'
              }}
            >
              <Group justify="space-between" align="center">
                <div>
                  <Title 
                    order={1} 
                    style={{ 
                      color: '#374151', 
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: '700',
                      letterSpacing: '-0.02em',
                      marginBottom: '8px',
                      fontSize: '2rem'
                    }}
                  >
                    Historial de Notificaciones
                  </Title>
                  <Group gap="md" mt="sm">
                    <Badge
                      size="lg"
                      variant="light"
                      leftSection={apiAvailable ? <IconPlugConnected size={16} /> : <IconPlugConnectedX size={16} />}
                      style={{
                        backgroundColor: apiAvailable ? '#10b981' : '#ef4444',
                        color: '#ffffff',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '600'
                      }}
                    >
                      {apiAvailable ? 'API Conectada' : 'API Desconectada'}
                    </Badge>
                    {usingMockData && (
                      <Badge
                        size="lg"
                        variant="light"
                        leftSection={<IconDatabase size={16} />}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: '#ffffff',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: '600'
                        }}
                      >
                        Datos de Demo
                      </Badge>
                    )}
                    <Badge
                      size="lg"
                      variant="light"
                      style={{
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '600'
                      }}
                    >
                      {notificationHistory.length} notificaciones
                    </Badge>
                  </Group>
                  <Text 
                    size="md" 
                    mt="md"
                    style={{ 
                      color: '#6b7280', 
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: '400'
                    }}
                  >
                    Registro completo de todas las alertas y notificaciones enviadas por el sistema
                  </Text>
                </div>
                <Box
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: '#f59e0b',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <IconBell size={32} color="#ffffff" stroke={2} />
                </Box>
              </Group>
            </Paper>

            {/* Alert de estado */}
            {!apiAvailable && !loading && usingMockData && (
              <Alert
                icon={<IconDatabase size={18} />}
                title="Modo Demostración Activo"
                color="blue"
                mb="xl"
              >
                <Text size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  No se puede conectar con monitor-ia. Mostrando datos de ejemplo para demostración.
                </Text>
                <Text size="xs" mt="sm" style={{ fontFamily: 'Montserrat, sans-serif', color: '#64748b' }}>
                  Para ver datos reales, verifica que el backend de monitor-ia esté ejecutándose.
                </Text>
              </Alert>
            )}

            {/* Contenido principal */}
            <Paper
              p="xl"
              radius="md"
              shadow="0 2px 8px rgba(0, 0, 0, 0.05)"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb'
              }}
            >
              <Group justify="space-between" align="center" mb="xl">
                <div>
                  <Title
                    order={2}
                    style={{
                      color: '#374151',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: '700',
                      fontSize: '1.5rem',
                      marginBottom: '4px'
                    }}
                  >
                    Alertas del Sistema
                  </Title>
                  <Text
                    size="sm"
                    style={{
                      color: '#6b7280',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: '500'
                    }}
                  >
                    Detecciones de seguridad y notificaciones 
                  </Text>
                </div>
                <Button
                  leftSection={<IconRefresh size={18} />}
                  variant="light"
                  color="orange"
                  onClick={handleRefresh}
                  loading={loading}
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}
                >
                  Actualizar
                </Button>
              </Group>

              {loading ? (
                <Box style={{ textAlign: 'center', padding: '60px' }}>
                  <Loader size="xl" color="orange" />
                  <Text mt="lg" style={{ fontFamily: 'Montserrat, sans-serif', color: '#6b7280' }}>
                    Cargando historial de notificaciones...
                  </Text>
                </Box>
              ) : notificationHistory.length === 0 ? (
                <Alert
                  icon={<IconBell size={24} />}
                  title="Sin notificaciones"
                  color="gray"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  styles={{
                    title: { fontSize: '1.1rem', fontWeight: 600 },
                    message: { fontSize: '0.95rem' }
                  }}
                >
                  <Text size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    No hay notificaciones registradas en el sistema. Las alertas aparecerán aquí cuando se detecten situaciones de riesgo como trabajadores sin casco o sin guantes.
                  </Text>
                </Alert>
              ) : (
                <Box
                  style={{
                    maxHeight: 'calc(100vh - 420px)',
                    minHeight: '400px',
                    overflowY: 'auto',
                    paddingRight: '8px'
                  }}
                >
                  <Stack gap="md">
                    {notificationHistory.map((log) => {
                      const style = getNotificationStyle(log);
                      return (
                        <Paper
                          key={log.id}
                          p="lg"
                          radius="md"
                          style={{
                            backgroundColor: style.bg,
                            border: `1px solid ${style.border}`,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Group align="flex-start" gap="md">
                            <Box
                              style={{
                                width: 48,
                                height: 48,
                                backgroundColor: style.icon,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: `0 4px 12px ${style.icon}40`
                              }}
                            >
                              {getSourceIcon(log.source)}
                            </Box>
                            <Box style={{ flex: 1, minWidth: 0 }}>
                              <Group gap="xs" mb="xs">
                                <Badge 
                                  size="sm" 
                                  color={style.badgeColor}
                                  variant="light"
                                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}
                                >
                                  {log.level}
                                </Badge>
                                <Badge 
                                  size="sm" 
                                  color="gray"
                                  variant="outline"
                                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                                >
                                  {getSourceLabel(log.source)}
                                </Badge>
                              </Group>
                              <Text
                                size="md"
                                style={{
                                  fontFamily: 'Montserrat, sans-serif',
                                  fontWeight: '600',
                                  color: '#374151',
                                  marginBottom: '8px',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                  lineHeight: 1.5
                                }}
                              >
                                {log.message}
                              </Text>
                              <Group gap="xs" align="center">
                                <IconClock size={16} color="#6b7280" />
                                <Text
                                  size="sm"
                                  style={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    fontWeight: '500',
                                    color: '#6b7280'
                                  }}
                                >
                                  {log.timestamp}
                                </Text>
                              </Group>
                            </Box>
                          </Group>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Box>
              )}
            </Paper>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

