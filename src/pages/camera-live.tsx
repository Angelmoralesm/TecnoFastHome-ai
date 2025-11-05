import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Box,
  AppShell,
  Avatar,
  Menu,
  Badge,
  Button,
  ActionIcon,
  Stack,
  Grid,
  Alert
} from '@mantine/core';
import {
  IconHome,
  IconChartPie,
  IconSettings as IconSettingsNav,
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
  IconShieldCheck,
  IconRobot,
  IconVideo,
  IconAlertCircle,
  IconPlugConnected,
  IconPlugConnectedX
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import LiveCameraFeed from '~/components/LiveCameraFeed';
import { checkMonitorIaApiHealth, getMonitorIaLogs } from '~/services/monitorIaApi';

export default function CameraLivePage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState<Array<{ timestamp: string; message: string }>>([]);

  useEffect(() => {
    checkApi();
    loadRecentAlerts();
    
    // Actualizar alertas cada 5 segundos
    const interval = setInterval(() => {
      loadRecentAlerts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkApi = async () => {
    const isAvailable = await checkMonitorIaApiHealth();
    setApiAvailable(isAvailable);
  };

  const loadRecentAlerts = async () => {
    try {
      const logs = await getMonitorIaLogs();
      setRecentAlerts(logs.slice(-5).reverse()); // Últimas 5 alertas
    } catch (error) {
      console.error('Error cargando alertas:', error);
    }
  };

  return (
    <>
      <Head>
        <title>TecnoHome - Cámara en Vivo</title>
        <meta name="description" content="Visualización de cámara en tiempo real" />
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
                variant="filled"
                fullWidth
                justify="flex-start"
                leftSection={<IconVideo size={20} />}
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '600',
                  height: '48px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                }}
              >
                {!sidebarCollapsed && 'Cámara en Vivo'}
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
                border: '2px solid #dc2626',
                boxShadow: '0 4px 16px rgba(220, 38, 38, 0.15)'
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
                    Cámara en Vivo
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
                    Monitoreo en tiempo real con detección de EPP por inteligencia artificial
                  </Text>
                </div>
                <Box
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: '#dc2626',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  <IconVideo size={32} color="#ffffff" stroke={2} />
                </Box>
              </Group>
            </Paper>

            {/* Alert de estado */}
            {!apiAvailable && (
              <Alert
                icon={<IconAlertCircle size={18} />}
                title="No se puede conectar con monitor-ia"
                color="yellow"
                mb="xl"
              >
                <Text size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Verifica que el backend de monitor-ia esté ejecutándose y que la cámara RTSP esté configurada.
                </Text>
              </Alert>
            )}

            <Grid gutter="xl">
              {/* Cámara Principal */}
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <LiveCameraFeed 
                  showControls={true} 
                  height="600px"
                  title="Monitor-IA • Detección de EPP"
                />
              </Grid.Col>

              {/* Panel de Alertas Recientes */}
              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Paper
                  p="xl"
                  radius="md"
                  shadow="0 2px 8px rgba(0, 0, 0, 0.05)"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    height: '100%'
                  }}
                >
                  <Title
                    order={3}
                    mb="md"
                    style={{
                      color: '#374151',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: '700',
                      fontSize: '1.2rem'
                    }}
                  >
                    Alertas Recientes
                  </Title>
                  
                  <Stack gap="sm">
                    {recentAlerts.length > 0 ? (
                      recentAlerts.map((alert, index) => (
                        <Paper
                          key={index}
                          p="md"
                          radius="md"
                          style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca'
                          }}
                        >
                          <Text
                            size="xs"
                            style={{
                              color: '#6b7280',
                              fontFamily: 'Montserrat, sans-serif',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}
                          >
                            {alert.timestamp}
                          </Text>
                          <Text
                            size="sm"
                            style={{
                              color: '#dc2626',
                              fontFamily: 'Montserrat, sans-serif',
                              fontWeight: '600'
                            }}
                          >
                            {alert.message}
                          </Text>
                        </Paper>
                      ))
                    ) : (
                      <Alert icon={<IconAlertCircle size={18} />} color="blue">
                        <Text size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          No hay alertas recientes. El sistema está monitoreando...
                        </Text>
                      </Alert>
                    )}
                  </Stack>

                  <Text
                    size="xs"
                    mt="md"
                    style={{
                      color: '#6b7280',
                      fontFamily: 'Montserrat, sans-serif',
                      textAlign: 'center'
                    }}
                  >
                    Actualización automática cada 5 segundos
                  </Text>
                </Paper>
              </Grid.Col>
            </Grid>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}



