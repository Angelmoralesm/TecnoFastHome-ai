import { useState } from 'react';
import Head from 'next/head';
import {
  Container,
  Grid,
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
  IconLogout
} from '@tabler/icons-react';
import Image from 'next/image';
import { mockCameras, mockAlerts, mockDashboardStats } from '../data/mockData';
import { CameraCard } from '../components/CameraCard';
import { AlertItem } from '../components/AlertItem';

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

  return (
    <>
      <Head>
        <title>TecnoFast IA - Dashboard de Monitoreo</title>
        <meta name="description" content="Dashboard principal de monitoreo de seguridad con IA" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <AppShell
        navbar={{
          width: sidebarCollapsed ? 80 : 280,
          breakpoint: 'sm',
          collapsed: { mobile: true }
        }}
        style={{
          backgroundColor: '#f8fafc',
          fontFamily: 'Montserrat, sans-serif'
        }}
      >
        {/* Sidebar */}
        <AppShell.Navbar
          style={{
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Logo Section */}
          <Box
            p="md"
            style={{
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {!sidebarCollapsed && (
              <Image 
                src="/tfhome.png" 
                alt="TecnoFast Logo" 
                width={120} 
                height={40}
                style={{ objectFit: 'contain' }}
              />
            )}
            <ActionIcon
              variant="subtle"
              size="md"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                color: '#64748b',
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              {sidebarCollapsed ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />}
            </ActionIcon>
          </Box>

          {/* Navigation Links */}
          <Box p="md">
            <Stack gap="xs">
              <Button
                variant="light"
                fullWidth
                justify="flex-start"
                leftSection={<IconHome size={20} />}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#1e293b',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '600',
                  height: '48px',
                  borderRadius: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
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
                  color: '#64748b',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '500',
                  height: '48px',
                  borderRadius: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#475569';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#64748b';
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
                  color: '#64748b',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '500',
                  height: '48px',
                  borderRadius: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#475569';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                {!sidebarCollapsed && 'Administración'}
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
              borderTop: '1px solid #e2e8f0',
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
                        backgroundColor: '#475569',
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
                    color: '#64748b',
                    border: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: '500',
                    height: '48px',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.color = '#475569';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#64748b';
                  }}
                >
                  {!sidebarCollapsed && 'Usuario TecnoFast'}
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
                    Usuario TecnoFast
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
            <Box mb="xl">
              <Title 
                order={2} 
                size="h1" 
                style={{ 
                  color: '#1e293b', 
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '600',
                  letterSpacing: '-0.02em',
                  marginBottom: '8px'
                }}
              >
                Bienvenido al Dashboard
              </Title>
              <Text 
                size="lg" 
                style={{ 
                  color: '#64748b', 
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '400',
                  maxWidth: '600px'
                }}
              >
                Monitorea en tiempo real la seguridad de tus instalaciones con inteligencia artificial avanzada
              </Text>
            </Box>

            {/* Stats Overview */}
            <Grid mb="xl">
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Paper 
                  p="xl" 
                  radius="md" 
                  shadow="0 2px 8px rgba(0, 0, 0, 0.1)" 
                  style={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <Group gap="lg">
                    <Box
                      style={{
                        width: 56,
                        height: 56,
                        backgroundColor: '#f1f5f9',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #cbd5e1'
                      }}
                    >
                      <IconCamera size={28} color="#475569" />
                    </Box>
                    <div>
                      <Text 
                        size="xs" 
                        style={{ 
                          fontFamily: 'Montserrat, sans-serif',
                          color: '#64748b',
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
                          color: '#1e293b', 
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
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 3 }}>
                <Paper 
                  p="xl" 
                  radius="md" 
                  shadow="0 2px 8px rgba(0, 0, 0, 0.1)" 
                  style={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <Group gap="lg">
                    <Box
                      style={{
                        width: 56,
                        height: 56,
                        backgroundColor: '#f1f5f9',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #cbd5e1'
                      }}
                    >
                      <IconAlertTriangle size={28} color="#475569" />
                    </Box>
                    <div>
                      <Text 
                        size="xs" 
                        style={{ 
                          fontFamily: 'Montserrat, sans-serif',
                          color: '#64748b',
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
                          color: '#1e293b', 
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
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 3 }}>
                <Paper 
                  p="xl" 
                  radius="md" 
                  shadow="0 2px 8px rgba(0, 0, 0, 0.1)" 
                  style={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <Group gap="lg">
                    <Box
                      style={{
                        width: 56,
                        height: 56,
                        backgroundColor: '#f1f5f9',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #cbd5e1'
                      }}
                    >
                      <IconCheck size={28} color="#475569" />
                    </Box>
                    <div>
                      <Text 
                        size="xs" 
                        style={{ 
                          fontFamily: 'Montserrat, sans-serif',
                          color: '#64748b',
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
                          color: '#1e293b', 
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
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 3 }}>
                <Paper 
                  p="xl" 
                  radius="md" 
                  shadow="0 2px 8px rgba(0, 0, 0, 0.1)" 
                  style={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <Group gap="lg">
                    <Box
                      style={{
                        width: 56,
                        height: 56,
                        backgroundColor: '#f1f5f9',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #cbd5e1'
                      }}
                    >
                      <IconChartBar size={28} color="#475569" />
                    </Box>
                    <div>
                      <Text 
                        size="xs" 
                        style={{ 
                          fontFamily: 'Montserrat, sans-serif',
                          color: '#64748b',
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
                          color: '#1e293b', 
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
              </Grid.Col>
            </Grid>

            {/* Main Content Grid */}
            <Grid>
              {/* Cameras Section */}
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <Paper 
                  p="xl" 
                  radius="md" 
                  shadow="0 2px 8px rgba(0, 0, 0, 0.1)" 
                  style={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <Group justify="space-between" align="center" mb="xl">
                    <div>
                      <Title 
                        order={2} 
                        style={{ 
                          color: '#1e293b', 
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
                          color: '#64748b', 
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
                      radius="md"
                      leftSection={<IconRefresh size={18} />}
                      style={{
                        borderColor: '#cbd5e1',
                        borderWidth: '1px',
                        color: '#475569',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '600',
                        backgroundColor: '#f8fafc',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e2e8f0';
                        e.currentTarget.style.borderColor = '#94a3b8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.borderColor = '#cbd5e1';
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
                  shadow="0 2px 8px rgba(0, 0, 0, 0.1)" 
                  style={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <Group justify="space-between" align="center" mb="xl">
                    <div>
                      <Title 
                        order={2} 
                        style={{ 
                          color: '#1e293b', 
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
                          color: '#64748b', 
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
                      radius="md"
                      style={{
                        borderColor: '#cbd5e1',
                        borderWidth: '1px',
                        color: '#475569',
                        backgroundColor: '#f8fafc',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e2e8f0';
                        e.currentTarget.style.borderColor = '#94a3b8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.borderColor = '#cbd5e1';
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

                  <Divider my="xl" style={{ borderColor: '#e2e8f0' }} />

                  <Button
                    variant="outline"
                    size="md"
                    radius="md"
                    fullWidth
                    style={{
                      borderColor: '#cbd5e1',
                      borderWidth: '1px',
                      color: '#475569',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: '600',
                      backgroundColor: '#f8fafc',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e2e8f0';
                      e.currentTarget.style.borderColor = '#94a3b8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e1';
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
              </Box>
              <div style={{ textAlign: 'center' }}>
                <Text size="xl" fw={600} style={{ fontFamily: 'Montserrat, sans-serif', color: '#1e293b', marginBottom: '8px' }}>
                  Vista previa de la cámara
                </Text>
                <Text size="md" style={{ fontFamily: 'Montserrat, sans-serif', color: '#64748b', maxWidth: '400px', lineHeight: '1.5' }}>
                  El video en vivo se mostrará aquí cuando se implemente la funcionalidad de streaming
                </Text>
              </div>
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
                <Grid.Col span={6}>
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
                </Grid.Col>
                <Grid.Col span={6}>
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
                </Grid.Col>
              </Grid>
            </Paper>
          )}
        </Box>
      </Modal>
    </>
  );
}
