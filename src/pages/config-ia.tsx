import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  TextInput,
  Stack,
  Box,
  NumberInput,
  Grid,
  AppShell,
  Avatar,
  Menu,
  Badge,
  Alert,
  Loader,
  ActionIcon,
  List
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
  IconBrandWhatsapp,
  IconAlertCircle,
  IconCheck,
  IconRefresh,
  IconDeviceFloppy,
  IconRobot,
  IconPlugConnected,
  IconPlugConnectedX,
  IconTestPipe,
  IconTrash,
  IconPlus
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import {
  getMonitorIaConfig,
  updateMonitorIaConfig,
  sendWhatsAppNotification,
  checkMonitorIaApiHealth,
  type MonitorIaConfig
} from '~/services/monitorIaApi';

export default function ConfigIaPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [config, setConfig] = useState<MonitorIaConfig>({
    rtsp_url: '',
    conf_persona: 0.5,
    conf_casco: 0.7,
    conf_guantes: 0.7,
    whatsapp_phones: []
  });

  // Estados para el formulario
  const [formData, setFormData] = useState({
    rtsp_url: '',
    conf_persona: 0.5,
    conf_casco: 0.7,
    conf_guantes: 0.7,
    whatsapp_phones: [] as string[]
  });
  const [newPhone, setNewPhone] = useState('');

  // Verificar disponibilidad de la API y cargar configuración
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      // Verificar si la API está disponible
      const isAvailable = await checkMonitorIaApiHealth();
      setApiAvailable(isAvailable);

      if (!isAvailable) {
        notifications.show({
          title: '⚠️ API no disponible',
          message: 'No se puede conectar con la API de monitor-ia. Verifica que esté ejecutándose.',
          color: 'yellow',
          autoClose: 5000
        });
        setLoading(false);
        return;
      }

      // Cargar configuración
      const currentConfig = await getMonitorIaConfig();
      setConfig(currentConfig);
      setFormData({
        rtsp_url: currentConfig.rtsp_url || '',
        conf_persona: currentConfig.conf_persona,
        conf_casco: currentConfig.conf_casco,
        conf_guantes: currentConfig.conf_guantes,
        whatsapp_phones: currentConfig.whatsapp_phones || []
      });

      notifications.show({
        title: '✅ Configuración cargada',
        message: 'Se ha cargado la configuración actual desde monitor-ia',
        color: 'green',
        autoClose: 3000
      });
    } catch (error) {
      console.error('Error cargando configuración:', error);
      notifications.show({
        title: '❌ Error',
        message: 'No se pudo cargar la configuración. Verifica la consola para más detalles.',
        color: 'red',
        autoClose: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    try {
      notifications.show({
        id: 'save-config',
        title: '💾 Guardando configuración...',
        message: 'Actualizando en monitor-ia',
        loading: true,
        autoClose: false
      });

      await updateMonitorIaConfig(formData);

      notifications.update({
        id: 'save-config',
        title: '✅ Configuración guardada',
        message: 'La configuración se ha actualizado correctamente en monitor-ia',
        color: 'green',
        icon: <IconCheck size={18} />,
        loading: false,
        autoClose: 3000
      });

      // Recargar configuración
      await loadConfiguration();
    } catch (error) {
      console.error('Error guardando configuración:', error);
      notifications.update({
        id: 'save-config',
        title: '❌ Error al guardar',
        message: error instanceof Error ? error.message : 'Error desconocido',
        color: 'red',
        loading: false,
        autoClose: 5000
      });
    }
  };

  const handleTestWhatsApp = async () => {
    try {
      notifications.show({
        id: 'test-whatsapp',
        title: '📱 Enviando mensaje de prueba...',
        message: 'Conectando con el servicio de WhatsApp',
        loading: true,
        autoClose: false
      });

      const result = await sendWhatsAppNotification(
        '🚨 PRUEBA - Sistema TecnoHome AI\n\nEste es un mensaje de prueba desde el panel de configuración.\n\nSi recibes este mensaje, las notificaciones están funcionando correctamente.\n\n✅ Sistema: TecnoHome AI + Monitor-IA',
        { force: true }
      );

      notifications.update({
        id: 'test-whatsapp',
        title: '✅ Mensaje enviado',
        message: result.message || 'WhatsApp de prueba enviado exitosamente',
        color: 'green',
        icon: <IconCheck size={18} />,
        loading: false,
        autoClose: 5000
      });
    } catch (error) {
      console.error('Error enviando WhatsApp de prueba:', error);
      notifications.update({
        id: 'test-whatsapp',
        title: '❌ Error al enviar',
        message: error instanceof Error ? error.message : 'Error desconocido',
        color: 'red',
        loading: false,
        autoClose: 5000
      });
    }
  };

  const handleAddPhone = () => {
    const phoneRegex = /^\+\d{10,15}$/;
    const cleanPhone = newPhone.trim();

    if (!cleanPhone) {
      notifications.show({
        title: '⚠️ Campo vacío',
        message: 'Ingresa un número de teléfono',
        color: 'yellow',
        autoClose: 3000
      });
      return;
    }

    if (!phoneRegex.test(cleanPhone)) {
      notifications.show({
        title: '❌ Formato inválido',
        message: 'El número debe estar en formato: +56912345678',
        color: 'red',
        autoClose: 4000
      });
      return;
    }

    if (formData.whatsapp_phones.includes(cleanPhone)) {
      notifications.show({
        title: '⚠️ Número duplicado',
        message: 'Este número ya está en la lista',
        color: 'yellow',
        autoClose: 3000
      });
      return;
    }

    setFormData({
      ...formData,
      whatsapp_phones: [...formData.whatsapp_phones, cleanPhone]
    });
    setNewPhone('');
  };

  const handleRemovePhone = (phone: string) => {
    setFormData({
      ...formData,
      whatsapp_phones: formData.whatsapp_phones.filter(p => p !== phone)
    });
  };

  return (
    <>
      <Head>
        <title>TecnoHome - Configuración IA</title>
        <meta name="description" content="Configuración de la IA de monitor-ia" />
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
                variant="filled"
                fullWidth
                justify="flex-start"
                leftSection={<IconRobot size={20} />}
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
                    Configuración de la IA
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
                    Gestiona los parámetros de detección y notificaciones de monitor-ia
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
                  <IconRobot size={32} color="#ffffff" stroke={2} />
                </Box>
              </Group>
            </Paper>

            {/* Alert de estado */}
            {!apiAvailable && !loading && (
              <Alert
                icon={<IconAlertCircle size={18} />}
                title="No se puede conectar con monitor-ia"
                color="yellow"
                mb="xl"
              >
                <Text size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Verifica que el backend de monitor-ia esté ejecutándose y que la URL esté configurada correctamente.
                </Text>
                <Text size="xs" mt="sm" style={{ fontFamily: 'Montserrat, sans-serif', color: '#6b7280' }}>
                  Revisa el archivo <code style={{ backgroundColor: '#fef2f2', padding: '2px 8px', borderRadius: '4px' }}>CONFIGURACION_MONITOR_IA.md</code> para más información.
                </Text>
              </Alert>
            )}

            {loading ? (
              <Paper p="xl" style={{ textAlign: 'center' }}>
                <Loader size="xl" />
                <Text mt="md" style={{ fontFamily: 'Montserrat, sans-serif', color: '#6b7280' }}>
                  Cargando configuración...
                </Text>
              </Paper>
            ) : (
              <Grid gutter="xl">
                {/* Configuración de Cámara y Umbrales */}
                <Grid.Col span={{ base: 12, lg: 7 }}>
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
                          Parámetros de Detección
                        </Title>
                        <Text
                          size="sm"
                          style={{
                            color: '#6b7280',
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: '500'
                          }}
                        >
                          Configura la cámara y los umbrales de confianza
                        </Text>
                      </div>
                      <Button
                        leftSection={<IconRefresh size={18} />}
                        variant="light"
                        color="blue"
                        onClick={loadConfiguration}
                        disabled={loading}
                        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}
                      >
                        Recargar
                      </Button>
                    </Group>

                    <Stack gap="lg">
                      <TextInput
                        label="URL RTSP de la Cámara"
                        placeholder="rtsp://usuario:contraseña@ip:puerto/stream"
                        value={formData.rtsp_url}
                        onChange={(e) => setFormData({ ...formData, rtsp_url: e.target.value })}
                        styles={{
                          label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600', marginBottom: '8px' },
                          input: { fontFamily: 'monospace', fontSize: '0.9rem' }
                        }}
                      />

                      <NumberInput
                        label="Umbral de Confianza - Persona"
                        description="Nivel de confianza mínimo para detectar una persona (0.1 - 1.0)"
                        value={formData.conf_persona}
                        onChange={(val) => setFormData({ ...formData, conf_persona: Number(val) })}
                        min={0.1}
                        max={1.0}
                        step={0.05}
                        decimalScale={2}
                        styles={{
                          label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600', marginBottom: '4px' },
                          input: { fontFamily: 'Montserrat, sans-serif' },
                          description: { fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', color: '#64748b' }
                        }}
                      />

                      <NumberInput
                        label="Umbral de Confianza - Casco"
                        description="Nivel de confianza mínimo para detectar un casco (0.1 - 1.0)"
                        value={formData.conf_casco}
                        onChange={(val) => setFormData({ ...formData, conf_casco: Number(val) })}
                        min={0.1}
                        max={1.0}
                        step={0.05}
                        decimalScale={2}
                        styles={{
                          label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600', marginBottom: '4px' },
                          input: { fontFamily: 'Montserrat, sans-serif' },
                          description: { fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', color: '#64748b' }
                        }}
                      />

                      <NumberInput
                        label="Umbral de Confianza - Guantes"
                        description="Nivel de confianza mínimo para detectar guantes (0.1 - 1.0)"
                        value={formData.conf_guantes}
                        onChange={(val) => setFormData({ ...formData, conf_guantes: Number(val) })}
                        min={0.1}
                        max={1.0}
                        step={0.05}
                        decimalScale={2}
                        styles={{
                          label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600', marginBottom: '4px' },
                          input: { fontFamily: 'Montserrat, sans-serif' },
                          description: { fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', color: '#64748b' }
                        }}
                      />
                    </Stack>
                  </Paper>
                </Grid.Col>

                {/* Configuración de WhatsApp */}
                <Grid.Col span={{ base: 12, lg: 5 }}>
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
                          Notificaciones WhatsApp
                        </Title>
                        <Text
                          size="sm"
                          style={{
                            color: '#6b7280',
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: '500'
                          }}
                        >
                          {formData.whatsapp_phones.length} número{formData.whatsapp_phones.length !== 1 ? 's' : ''} configurado{formData.whatsapp_phones.length !== 1 ? 's' : ''}
                        </Text>
                      </div>
                      <IconBrandWhatsapp size={32} color="#10b981" />
                    </Group>

                    <Stack gap="md">
                      <Group gap="xs">
                        <TextInput
                          placeholder="+56912345678"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddPhone()}
                          style={{ flex: 1 }}
                          styles={{
                            input: { fontFamily: 'Montserrat, sans-serif' }
                          }}
                        />
                        <Button
                          leftSection={<IconPlus size={18} />}
                          onClick={handleAddPhone}
                          style={{
                            backgroundColor: '#10b981',
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: '600'
                          }}
                        >
                          Agregar
                        </Button>
                      </Group>

                      <Text size="xs" style={{ fontFamily: 'Montserrat, sans-serif', color: '#64748b' }}>
                        Formato: +56912345678 (código país + número)
                      </Text>

                      {formData.whatsapp_phones.length > 0 ? (
                        <List
                          spacing="sm"
                          icon={<IconBrandWhatsapp size={16} color="#10b981" />}
                        >
                          {formData.whatsapp_phones.map((phone, index) => (
                            <List.Item key={index}>
                              <Group justify="space-between">
                                <Text style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '500' }}>
                                  {phone}
                                </Text>
                                <ActionIcon
                                  color="red"
                                  variant="light"
                                  onClick={() => handleRemovePhone(phone)}
                                >
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </Group>
                            </List.Item>
                          ))}
                        </List>
                      ) : (
                        <Alert icon={<IconAlertCircle size={18} />} color="yellow">
                          <Text size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            No hay números configurados. Agrega al menos uno para recibir notificaciones.
                          </Text>
                        </Alert>
                      )}

                      <Button
                        fullWidth
                        leftSection={<IconTestPipe size={18} />}
                        variant="outline"
                        color="green"
                        onClick={handleTestWhatsApp}
                        disabled={!apiAvailable || formData.whatsapp_phones.length === 0}
                        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600', marginTop: '16px' }}
                      >
                        Enviar Mensaje de Prueba
                      </Button>
                    </Stack>
                  </Paper>
                </Grid.Col>
              </Grid>
            )}

            {/* Botones de Acción */}
            {!loading && (
              <Paper
                p="xl"
                mt="xl"
                radius="md"
                shadow="0 2px 8px rgba(0, 0, 0, 0.05)"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Group justify="flex-end" gap="md">
                  <Button
                    variant="light"
                    color="gray"
                    onClick={loadConfiguration}
                    disabled={!apiAvailable}
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}
                  >
                    Descartar Cambios
                  </Button>
                  <Button
                    leftSection={<IconDeviceFloppy size={18} />}
                    onClick={handleSaveConfiguration}
                    disabled={!apiAvailable}
                    style={{
                      backgroundColor: '#dc2626',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: '600'
                    }}
                  >
                    Guardar Configuración
                  </Button>
                </Group>
              </Paper>
            )}
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

