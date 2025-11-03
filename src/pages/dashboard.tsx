import { useState } from 'react';
import Head from 'next/head';
import {
  Container,
  Grid,
  SimpleGrid,
  Paper,
  Title,
  Text,
  Group,
  Badge,
  ActionIcon,
  Stack,
  Box,
  Divider,
  Button,
  Modal,
  Menu,
  Avatar,
  AppShell
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconCamera,
  IconAlertTriangle,
  IconCheck,
  IconVideo,
  IconBell,
  IconChartBar,
  IconRefresh,
  IconHome,
  IconChartPie,
  IconSettings as IconSettingsNav,
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
  IconBrandWhatsapp,
  IconShieldCheck,
  IconActivity,
  IconClock,
  IconRobot
} from '@tabler/icons-react';
import Image from 'next/image';
import { mockCameras, mockAlerts, mockDashboardStats } from '../data/mockData';
import { CameraCard } from '../components/CameraCard';
import { AlertItem } from '../components/AlertItem';
import YOLOv8ObjectDetection from '~/components/YOLOv8ObjectDetection';
import ObjectDetector from '~/components/ObjectDetector';
import VideoFeed from '~/components/VideoFeed';

export default function Dashboard() {
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const cameras = mockCameras;
  const recentAlerts = mockAlerts.slice(0, 3);

  const openCameraModal = (cameraId: number) => {
    setSelectedCamera(cameraId);
    open();
  };

  const closeCameraModal = () => {
    setSelectedCamera(null);
    close();
  };

  // Función para ejecutar el bot de WhatsApp
  const executeWhatsAppBot = async () => {
    try {
      notifications.show({
        title: '🚀 Enviando alerta de emergencia',
        message: 'Conectando con el bot de WhatsApp...',
        color: 'blue',
        loading: true,
        autoClose: false,
        id: 'whatsapp-bot'
      });

      const response = await fetch('/api/execute-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Bot de WhatsApp ejecutado correctamente');
        notifications.update({
          id: 'whatsapp-bot',
          title: '✅ ¡Alerta enviada exitosamente!',
          message: 'Los mensajes de emergencia han sido enviados por WhatsApp',
          color: 'green',
          icon: <IconCheck size={18} />,
          loading: false,
          autoClose: 5000
        });
      } else {
        console.error('Error al ejecutar el bot de WhatsApp');
        notifications.update({
          id: 'whatsapp-bot',
          title: '❌ Error al enviar alerta',
          message: 'No se pudo ejecutar el bot de WhatsApp. Verifica la configuración.',
          color: 'red',
          icon: <IconAlertTriangle size={18} />,
          loading: false,
          autoClose: 8000
        });
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      notifications.update({
        id: 'whatsapp-bot',
        title: '❌ Error de conexión',
        message: 'No se pudo conectar con el servidor. Verifica que esté ejecutándose.',
        color: 'red',
        icon: <IconAlertTriangle size={18} />,
        loading: false,
        autoClose: 8000
      });
    }
  };

  // Función para determinar el puerto del servidor Python según la cámara
  const getCameraPort = (cameraId: number): number => {
    const camera = cameras.find(c => c.id === cameraId);
    return camera?.aiServerPort || 5000; // Usar el puerto configurado o 5000 por defecto
  };

  return (
    <>
      <Head>
        <title>TecnoHome - Dashboard de Monitoreo IA</title>
        <meta name="description" content="Dashboard principal de monitoreo de seguridad con IA" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
            }
            50% {
              box-shadow: 0 0 40px rgba(102, 126, 234, 0.6);
            }
          }
          
          * {
            scroll-behavior: smooth;
          }
          
          ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          }
        `}</style>
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
                variant="filled"
                fullWidth
                justify="flex-start"
                leftSection={<IconHome size={20} />}
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
                onClick={() => window.location.href = '/admin'}
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
                  color: '#7c3aed',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '600',
                  height: '48px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#6d28d9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#7c3aed';
                }}
                onClick={() => window.location.href = '/config-ia'}
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
                    Supervisor del Sistema
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
                  onClick={() => window.location.href = '/'}
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
            {/* Welcome Section */}
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
              <Group align="center" justify="space-between">
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
                    Bienvenido al Dashboard
                  </Title>
                  <Group gap="md">
                    <Badge
                      size="lg"
                      variant="light"
                      style={{
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '600'
                      }}
                      leftSection={<IconShieldCheck size={16} />}
                    >
                      Sistema Activo
                    </Badge>
                    <Group gap="xs">
                      <IconClock size={18} color="#6b7280" />
                      <Text 
                        size="sm" 
                        style={{ 
                          color: '#6b7280', 
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: '500'
                        }}
                      >
                        {new Date().toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Text>
                    </Group>
                  </Group>
                  <Text 
                    size="md" 
                    mt="md"
                    style={{ 
                      color: '#6b7280', 
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: '400',
                      maxWidth: '600px',
                      lineHeight: '1.6'
                    }}
                  >
                    Monitorea en tiempo real la seguridad de tus instalaciones con inteligencia artificial avanzada
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
                  <IconActivity size={32} color="#ffffff" stroke={2} />
                </Box>
              </Group>
            </Paper>

            {/* Stats Overview */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl" spacing="lg">
              <Paper
                p="xl"
                radius="md"
                shadow="0 2px 8px rgba(0, 0, 0, 0.05)"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.15)';
                  e.currentTarget.style.borderColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <Group gap="lg" style={{ position: 'relative' }}>
                  <Box
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: '#dc2626',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                    }}
                  >
                    <IconCamera size={24} color="#ffffff" stroke={2} />
                  </Box>
                  <div>
                    <Text
                      size="xs"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        color: '#6b7280',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '4px'
                      }}
                    >
                      Cámaras Activas
                    </Text>
                    <Title
                      order={2}
                      style={{
                        color: '#374151',
                        margin: 0,
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '700',
                        fontSize: '2rem'
                      }}
                    >
                      {mockDashboardStats.activeCameras}
                    </Title>
                  </div>
                </Group>
              </Paper>

              <Paper
                p="xl"
                radius="md"
                shadow="0 2px 8px rgba(0, 0, 0, 0.05)"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.15)';
                  e.currentTarget.style.borderColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <Group gap="lg">
                  <Box
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: '#dc2626',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                    }}
                  >
                    <IconAlertTriangle size={24} color="#ffffff" />
                  </Box>
                  <div>
                    <Text
                      size="xs"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        color: '#6b7280',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '4px'
                      }}
                    >
                      Alertas Hoy
                    </Text>
                    <Title
                      order={2}
                      style={{
                        color: '#374151',
                        margin: 0,
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '700',
                        fontSize: '2rem'
                      }}
                    >
                      {mockDashboardStats.totalAlerts}
                    </Title>
                  </div>
                </Group>
              </Paper>

              <Paper
                p="xl"
                radius="md"
                shadow="0 2px 8px rgba(0, 0, 0, 0.05)"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.15)';
                  e.currentTarget.style.borderColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <Group gap="lg">
                  <Box
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: '#dc2626',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                    }}
                  >
                    <IconCheck size={24} color="#ffffff" />
                  </Box>
                  <div>
                    <Text
                      size="xs"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        color: '#6b7280',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '4px'
                      }}
                    >
                      Estado General
                    </Text>
                    <Title
                      order={2}
                      style={{
                        color: '#374151',
                        margin: 0,
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '700',
                        fontSize: '2rem'
                      }}
                    >
                      {mockDashboardStats.systemStatus === 'stable' ? 'Estable' : 'Advertencia'}
                    </Title>
                  </div>
                </Group>
              </Paper>

              <Paper
                p="xl"
                radius="md"
                shadow="0 2px 8px rgba(0, 0, 0, 0.05)"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.15)';
                  e.currentTarget.style.borderColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <Group gap="lg">
                  <Box
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: '#dc2626',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                    }}
                  >
                    <IconChartBar size={24} color="#ffffff" />
                  </Box>
                  <div>
                    <Text
                      size="xs"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        color: '#6b7280',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '4px'
                      }}
                    >
                      Precisión IA
                    </Text>
                    <Title
                      order={2}
                      style={{
                        color: '#374151',
                        margin: 0,
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '700',
                        fontSize: '2rem'
                      }}
                    >
                      {mockDashboardStats.aiAccuracy}%
                    </Title>
                  </div>
                </Group>
              </Paper>
            </SimpleGrid>

            {/* Emergency WhatsApp Button */}
            <Paper
              p="xl"
              radius="md"
              shadow="0 4px 16px rgba(220, 38, 38, 0.15)"
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #dc2626',
                position: 'relative',
                overflow: 'hidden'
              }}
              mb="xl"
            >
              <Group justify="space-between" align="center" style={{ position: 'relative' }}>
                <Group gap="lg">
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
                    <IconBrandWhatsapp size={32} color="#ffffff" stroke={2} />
                  </Box>
                  <div>
                    <Group gap="sm" mb="xs">
                      <Title
                        order={3}
                        style={{
                          color: '#374151',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: '700',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        Acciones de Emergencia
                      </Title>
                      <Badge
                        size="md"
                        variant="light"
                        style={{
                          backgroundColor: '#dc2626',
                          color: '#ffffff',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: '600'
                        }}
                      >
                        CRÍTICO
                      </Badge>
                    </Group>
                    <Text
                      size="sm"
                      style={{
                        color: '#6b7280',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '500',
                        marginBottom: '4px'
                      }}
                    >
                      Envía alertas de emergencia por WhatsApp a números configurados
                    </Text>
                    <Text
                      size="xs"
                      style={{
                        color: '#9ca3af',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '400'
                      }}
                    >
                      💡 Primera vez: Ejecuta <code style={{ backgroundColor: '#fef2f2', padding: '2px 8px', borderRadius: '6px', fontWeight: '600', color: '#dc2626' }}>node public/setup-bot.mjs</code> para autenticar
                    </Text>
                  </div>
                </Group>
                <Button
                  variant="filled"
                  size="lg"
                  radius="sm"
                  leftSection={<IconAlertTriangle size={20} />}
                  style={{
                    backgroundColor: '#dc2626',
                    border: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: '600',
                    fontSize: '1rem',
                    color: '#ffffff',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#b91c1c';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={executeWhatsAppBot}
                >
                  Enviar Alerta de Emergencia
                </Button>
              </Group>
            </Paper>

            {/* Main Content Grid */}
            <Grid gutter="xl">
              {/* Cameras Section */}
              <Grid.Col span={{ base: 12, lg: 8 }}>
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
                          letterSpacing: '-0.02em',
                          marginBottom: '4px'
                        }}
                      >
                        Monitoreo de Cámaras
                      </Title>
                      <Text
                        size="sm"
                        style={{
                          color: '#6b7280',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: '500'
                        }}
                      >
                        Sistema de vigilancia inteligente en tiempo real
                      </Text>
                    </div>
                    <Button
                      variant="outline"
                      size="md"
                      radius="sm"
                      leftSection={<IconRefresh size={18} />}
                      style={{
                        borderColor: '#d1d5db',
                        borderWidth: '2px',
                        color: '#dc2626',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '600',
                        backgroundColor: '#ffffff',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.color = '#dc2626';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Actualizar
                    </Button>
                  </Group>

                  <Grid gutter="lg">
                    {cameras.map((camera) => (
                      <Grid.Col key={camera.id} span={{ base: 12, md: 6 }}>
                        <CameraCard
                          camera={camera}
                          onViewCamera={openCameraModal}
                        />
                      </Grid.Col>
                    ))}
                  </Grid>
                </Paper>
              </Grid.Col>

              {/* Alerts Section */}
              <Grid.Col span={{ base: 12, lg: 4 }}>
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
                          letterSpacing: '-0.02em',
                          marginBottom: '4px'
                        }}
                      >
                        Alertas Recientes
                      </Title>
                      <Text
                        size="sm"
                        style={{
                          color: '#6b7280',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: '500'
                        }}
                      >
                        Notificaciones del sistema de seguridad
                      </Text>
                    </div>
                    <ActionIcon
                      variant="outline"
                      size="lg"
                      radius="sm"
                      style={{
                        borderColor: '#d1d5db',
                        borderWidth: '2px',
                        color: '#dc2626',
                        backgroundColor: '#ffffff',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.color = '#dc2626';
                      }}
                    >
                      <IconBell size={20} />
                    </ActionIcon>
                  </Group>

                  <Stack gap="lg">
                    {recentAlerts.map((alert) => (
                      <AlertItem key={alert.id} alert={alert} />
                    ))}
                  </Stack>

                  <Divider my="xl" style={{ borderColor: '#e5e7eb' }} />

                  <Button
                    variant="outline"
                    size="md"
                    radius="sm"
                    fullWidth
                    style={{
                      borderColor: '#d1d5db',
                      borderWidth: '2px',
                      color: '#dc2626',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: '600',
                      backgroundColor: '#ffffff',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                      e.currentTarget.style.borderColor = '#dc2626';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.color = '#dc2626';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Ver Todas las Alertas
                  </Button>
                </Paper>
              </Grid.Col>
            </Grid>
          </Container>
        </AppShell.Main>
      </AppShell>

      {/* Camera Modal */}
      <Modal
        opened={opened}
        onClose={closeCameraModal}
        size="xl"
        radius="md"
        styles={{
          title: { 
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1e293b'
          },
          header: {
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '24px 24px 16px 24px'
          },
          body: {
            padding: '24px',
            backgroundColor: '#ffffff'
          }
        }}
        title={
          <Group gap="md">
            <Box
              style={{
                padding: '8px',
                backgroundColor: '#f1f5f9',
                borderRadius: '4px',
                border: '1px solid #cbd5e1'
              }}
            >
              <IconVideo size={24} color="#475569" />
            </Box>
            <div>
              <Text fw={700} size="lg" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1e293b' }}>
                {selectedCamera && cameras.find(c => c.id === selectedCamera)?.name}
              </Text>
              <Text size="sm" style={{ fontFamily: 'Montserrat, sans-serif', color: '#64748b', fontWeight: '500' }}>
                Vista en tiempo real
              </Text>
            </div>
          </Group>
        }
      >
        <Box>
          {/* Placeholder para el video de la cámara */}
          <Box
            style={{
              width: '100%',
              height: '450px',
              backgroundColor: '#f8fafc',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontFamily: 'Montserrat, sans-serif',
              border: '2px dashed #cbd5e1',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Overlay de patrón */}
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(203, 213, 225, 0.1) 0%, transparent 50%)',
                backgroundSize: '20px 20px'
              }}
            />
            
            <Stack align="center" gap="lg" style={{ position: 'relative', zIndex: 1 }}>
              <Box
                style={{
                  padding: '24px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1'
                }}
              >
                <IconVideo size={56} color="#64748b" />
                <VideoFeed port={selectedCamera ? getCameraPort(selectedCamera) : 5000}/>
              </Box>
              
            </Stack>
          </Box>

          {/* Información de la cámara */}
          {selectedCamera && (
            <Paper 
              p="xl" 
              mt="xl" 
              radius="md" 
              style={{ 
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}
            >
              <Grid gutter="lg">
                <Box>
                  <Text
                    size="sm"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px'
                    }}
                  >
                    Estado del Sistema
                  </Text>
                  <Badge
                    color="green"
                    variant="light"
                    size="lg"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: '600',
                      padding: '8px 16px',
                      borderRadius: '4px'
                    }}
                  >
                    Activa
                  </Badge>
                </Box>
                <Box>
                  <Text
                    size="sm"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px'
                    }}
                  >
                    Última Actualización
                  </Text>
                  <Text
                    size="lg"
                    fw={600}
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      color: '#1e293b'
                    }}
                  >
                    Hace 30 segundos
                  </Text>
                </Box>
              </Grid>
            </Paper>
          )}
        </Box>
      </Modal>
    </>
  );
}
