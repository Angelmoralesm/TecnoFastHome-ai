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
  List,
  Switch,
  Select,
  Card,
  Accordion,
  ThemeIcon,
  Checkbox,
  Modal,
  Tabs,
  Table,
  ScrollArea
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
  IconPlus,
  IconBell,
  IconCamera,
  IconHelmet,
  IconUser,
  IconFaceId,
  IconCar,
  IconFlame,
  IconEdit,
  IconCircleFilled,
  IconDatabase
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import {
  getMonitorIaConfig,
  updateMonitorIaConfig,
  sendWhatsAppNotification,
  checkMonitorIaApiHealth,
  type MonitorIaConfig
} from '~/services/monitorIaApi';
import mockData from '~/data/mockCamerasConfig.json';

// Tipos
interface Camera {
  id: string;
  name: string;
  rtsp_url: string;
  location: string;
  status: 'online' | 'offline';
  model: string;
  config: Record<string, unknown>;
}

interface RegisteredUser {
  id: string;
  name: string;
  rut: string;
  department: string;
  photoUrl: string;
  registeredAt: string;
}

interface RegisteredPlate {
  id: string;
  plate: string;
  owner: string;
  vehicleType: string;
  brand: string;
  color: string;
  registeredAt: string;
}

interface IAModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export default function ConfigIaPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  // Estados para cámaras y configuración
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [iaModels, setIaModels] = useState<IAModel[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [registeredPlates, setRegisteredPlates] = useState<RegisteredPlate[]>([]);

  // Modal states
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addPlateModalOpen, setAddPlateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', rut: '', department: '' });
  const [newPlate, setNewPlate] = useState({ plate: '', owner: '', vehicleType: '', brand: '', color: '' });

  // Estados para WhatsApp (configuración global)
  const [whatsappConfig, setWhatsappConfig] = useState({
    whatsapp_phones: [] as string[],
    whatsapp_enabled: false
  });
  const [newPhone, setNewPhone] = useState('');

  // Verificar disponibilidad de la API y cargar configuración
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadMockData = () => {
    setCameras(mockData.cameras as Camera[]);
    setIaModels(mockData.iaModels);
    setRegisteredUsers(mockData.registeredUsers);
    setRegisteredPlates(mockData.registeredPlates);
    const firstCamera = mockData.cameras[0];
    if (firstCamera) {
      setSelectedCameraId(firstCamera.id);
    }
    setUsingMockData(true);
  };

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      const isAvailable = await checkMonitorIaApiHealth();
      setApiAvailable(isAvailable);

      if (isAvailable) {
        // Cargar configuración real desde API
        const currentConfig = await getMonitorIaConfig();
        setWhatsappConfig({
          whatsapp_phones: currentConfig.whatsapp_phones || [],
          whatsapp_enabled: currentConfig.whatsapp_enabled ?? false
        });
        // También cargar datos mock para cámaras (hasta que la API los soporte)
        loadMockData();
        setUsingMockData(false);
      } else {
        // Usar datos mock completos
        loadMockData();
        notifications.show({
          title: '📋 Modo Demostración',
          message: 'Mostrando datos de ejemplo. Conecta el backend para datos reales.',
          color: 'blue',
          autoClose: 4000
        });
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  // Obtener cámara seleccionada
  const selectedCamera = cameras.find(c => c.id === selectedCameraId);

  // Actualizar configuración de cámara
  const updateCameraConfig = (cameraId: string, updates: Partial<Camera>) => {
    setCameras(prev => prev.map(cam => 
      cam.id === cameraId ? { ...cam, ...updates } : cam
    ));
  };

  // Cambiar modelo de IA de una cámara
  const handleModelChange = (cameraId: string, modelId: string) => {
    const defaultConfigs: Record<string, Record<string, unknown>> = {
      epp: { conf_persona: 0.7, conf_casco: 0.8, conf_guantes: 0.75 },
      persona: { conf_persona: 0.65 },
      facial: { usuarios_autorizados: [] },
      patentes: { patentes_registradas: [] },
      incendio: { conf_incendio: 0.85 }
    };
    updateCameraConfig(cameraId, { 
      model: modelId, 
      config: defaultConfigs[modelId] || {} 
    });
  };

  // Guardar configuración
  const handleSaveConfiguration = async () => {
    try {
      notifications.show({
        id: 'save-config',
        title: '💾 Guardando configuración...',
        message: 'Actualizando configuración',
        loading: true,
        autoClose: false
      });

      // Si la API está disponible, guardar la configuración de WhatsApp
      if (apiAvailable) {
        await updateMonitorIaConfig(whatsappConfig);
      }

      notifications.update({
        id: 'save-config',
        title: '✅ Configuración guardada',
        message: 'La configuración se ha actualizado correctamente',
        color: 'green',
        icon: <IconCheck size={18} />,
        loading: false,
        autoClose: 3000
      });
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

  // Funciones para WhatsApp
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

    if (!cleanPhone) return;
    if (!phoneRegex.test(cleanPhone)) {
      notifications.show({
        title: '❌ Formato inválido',
        message: 'El número debe estar en formato: +56912345678',
        color: 'red',
        autoClose: 4000
      });
      return;
    }
    if (whatsappConfig.whatsapp_phones.includes(cleanPhone)) return;

    setWhatsappConfig({
      ...whatsappConfig,
      whatsapp_phones: [...whatsappConfig.whatsapp_phones, cleanPhone]
    });
    setNewPhone('');
  };

  const handleRemovePhone = (phone: string) => {
    setWhatsappConfig({
      ...whatsappConfig,
      whatsapp_phones: whatsappConfig.whatsapp_phones.filter(p => p !== phone)
    });
  };

  // Funciones para usuarios (detección facial)
  const handleAddUser = () => {
    if (!newUser.name || !newUser.rut) {
      notifications.show({ title: '⚠️ Campos requeridos', message: 'Nombre y RUT son obligatorios', color: 'yellow' });
      return;
    }
    const user: RegisteredUser = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      rut: newUser.rut,
      department: newUser.department || 'Sin asignar',
      photoUrl: '/avatars/default.jpg',
      registeredAt: new Date().toISOString()
    };
    setRegisteredUsers([...registeredUsers, user]);
    setNewUser({ name: '', rut: '', department: '' });
    setAddUserModalOpen(false);
    notifications.show({ title: '✅ Usuario agregado', message: `${user.name} ha sido registrado`, color: 'green' });
  };

  const handleRemoveUser = (userId: string) => {
    setRegisteredUsers(registeredUsers.filter(u => u.id !== userId));
  };

  // Funciones para patentes
  const handleAddPlate = () => {
    if (!newPlate.plate || !newPlate.owner) {
      notifications.show({ title: '⚠️ Campos requeridos', message: 'Patente y propietario son obligatorios', color: 'yellow' });
      return;
    }
    const plate: RegisteredPlate = {
      id: `plate-${Date.now()}`,
      ...newPlate,
      registeredAt: new Date().toISOString()
    };
    setRegisteredPlates([...registeredPlates, plate]);
    setNewPlate({ plate: '', owner: '', vehicleType: '', brand: '', color: '' });
    setAddPlateModalOpen(false);
    notifications.show({ title: '✅ Patente agregada', message: `${plate.plate} ha sido registrada`, color: 'green' });
  };

  const handleRemovePlate = (plateId: string) => {
    setRegisteredPlates(registeredPlates.filter(p => p.id !== plateId));
  };

  // Obtener icono del modelo
  const getModelIcon = (modelId: string) => {
    const icons: Record<string, React.ReactNode> = {
      epp: <IconHelmet size={20} />,
      persona: <IconUser size={20} />,
      facial: <IconFaceId size={20} />,
      patentes: <IconCar size={20} />,
      incendio: <IconFlame size={20} />
    };
    return icons[modelId] || <IconRobot size={20} />;
  };

  // Renderizar configuración según modelo seleccionado
  const renderModelConfig = (camera: Camera) => {
    const config = camera.config;

    switch (camera.model) {
      case 'epp':
        return (
          <Stack gap="md">
            <NumberInput
              label="Umbral de Confianza - Persona"
              description="Nivel de confianza mínimo para detectar una persona"
              value={(config.conf_persona as number) || 0.7}
              onChange={(val) => updateCameraConfig(camera.id, { 
                config: { ...config, conf_persona: Number(val) }
              })}
              min={0.1} max={1.0} step={0.05} decimalScale={2}
              styles={{
                label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' },
                description: { fontFamily: 'Montserrat, sans-serif', color: '#64748b' }
              }}
            />
            <NumberInput
              label="Umbral de Confianza - Casco"
              description="Nivel de confianza mínimo para detectar un casco"
              value={(config.conf_casco as number) || 0.8}
              onChange={(val) => updateCameraConfig(camera.id, { 
                config: { ...config, conf_casco: Number(val) }
              })}
              min={0.1} max={1.0} step={0.05} decimalScale={2}
              styles={{
                label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' },
                description: { fontFamily: 'Montserrat, sans-serif', color: '#64748b' }
              }}
            />
            <NumberInput
              label="Umbral de Confianza - Guantes"
              description="Nivel de confianza mínimo para detectar guantes"
              value={(config.conf_guantes as number) || 0.75}
              onChange={(val) => updateCameraConfig(camera.id, { 
                config: { ...config, conf_guantes: Number(val) }
              })}
              min={0.1} max={1.0} step={0.05} decimalScale={2}
              styles={{
                label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' },
                description: { fontFamily: 'Montserrat, sans-serif', color: '#64748b' }
              }}
            />
          </Stack>
        );

      case 'persona':
        return (
          <NumberInput
            label="Umbral de Confianza - Persona"
            description="Nivel de confianza mínimo para detectar una persona"
            value={(config.conf_persona as number) || 0.65}
            onChange={(val) => updateCameraConfig(camera.id, { 
              config: { ...config, conf_persona: Number(val) }
            })}
            min={0.1} max={1.0} step={0.05} decimalScale={2}
            styles={{
              label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' },
              description: { fontFamily: 'Montserrat, sans-serif', color: '#64748b' }
            }}
          />
        );

      case 'facial':
        const selectedUserIds = (config.usuarios_autorizados as string[]) || [];
        return (
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Text fw={600} style={{ fontFamily: 'Montserrat, sans-serif' }}>Usuarios Autorizados</Text>
              <Button 
                leftSection={<IconPlus size={16} />} 
                size="xs" 
                onClick={() => setAddUserModalOpen(true)}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Agregar Usuario
              </Button>
            </Group>
            {registeredUsers.length === 0 ? (
              <Alert icon={<IconAlertCircle size={18} />} color="yellow">
                <Text size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  No hay usuarios registrados. Agrega usuarios para el reconocimiento facial.
                </Text>
              </Alert>
            ) : (
              <Stack gap="xs">
                {registeredUsers.map(user => (
                  <Paper key={user.id} p="sm" withBorder style={{ borderRadius: '8px' }}>
                    <Group justify="space-between">
                      <Group gap="sm">
                        <Checkbox
                          checked={selectedUserIds.includes(user.id)}
                          onChange={(e) => {
                            const newIds = e.currentTarget.checked
                              ? [...selectedUserIds, user.id]
                              : selectedUserIds.filter(id => id !== user.id);
                            updateCameraConfig(camera.id, { 
                              config: { ...config, usuarios_autorizados: newIds }
                            });
                          }}
                        />
                        <Avatar size="sm" color="violet">{user.name.charAt(0)}</Avatar>
                        <div>
                          <Text size="sm" fw={500} style={{ fontFamily: 'Montserrat, sans-serif' }}>{user.name}</Text>
                          <Text size="xs" c="dimmed" style={{ fontFamily: 'Montserrat, sans-serif' }}>{user.rut} • {user.department}</Text>
                        </div>
                      </Group>
                      <ActionIcon color="red" variant="light" onClick={() => handleRemoveUser(user.id)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </Stack>
        );

      case 'patentes':
        const selectedPlateIds = (config.patentes_registradas as string[]) || [];
        return (
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Text fw={600} style={{ fontFamily: 'Montserrat, sans-serif' }}>Patentes Registradas</Text>
              <Button 
                leftSection={<IconPlus size={16} />} 
                size="xs" 
                color="teal"
                onClick={() => setAddPlateModalOpen(true)}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Agregar Patente
              </Button>
            </Group>
            {registeredPlates.length === 0 ? (
              <Alert icon={<IconAlertCircle size={18} />} color="yellow">
                <Text size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  No hay patentes registradas. Agrega patentes para la detección vehicular.
                </Text>
              </Alert>
            ) : (
              <ScrollArea h={250}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ fontFamily: 'Montserrat, sans-serif' }}>Sel.</Table.Th>
                      <Table.Th style={{ fontFamily: 'Montserrat, sans-serif' }}>Patente</Table.Th>
                      <Table.Th style={{ fontFamily: 'Montserrat, sans-serif' }}>Propietario</Table.Th>
                      <Table.Th style={{ fontFamily: 'Montserrat, sans-serif' }}>Vehículo</Table.Th>
                      <Table.Th style={{ fontFamily: 'Montserrat, sans-serif' }}></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {registeredPlates.map(plate => (
                      <Table.Tr key={plate.id}>
                        <Table.Td>
                          <Checkbox
                            checked={selectedPlateIds.includes(plate.plate)}
                            onChange={(e) => {
                              const newPlates = e.currentTarget.checked
                                ? [...selectedPlateIds, plate.plate]
                                : selectedPlateIds.filter(p => p !== plate.plate);
                              updateCameraConfig(camera.id, { 
                                config: { ...config, patentes_registradas: newPlates }
                              });
                            }}
                          />
                        </Table.Td>
                        <Table.Td>
                          <Badge color="teal" variant="light" style={{ fontFamily: 'monospace', fontWeight: '700' }}>
                            {plate.plate}
                          </Badge>
                        </Table.Td>
                        <Table.Td style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem' }}>{plate.owner}</Table.Td>
                        <Table.Td style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem' }}>{plate.brand}</Table.Td>
                        <Table.Td>
                          <ActionIcon color="red" variant="light" size="sm" onClick={() => handleRemovePlate(plate.id)}>
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            )}
          </Stack>
        );

      case 'incendio':
        return (
          <NumberInput
            label="Umbral de Confianza - Detección de Incendio"
            description="Nivel de confianza mínimo para activar alertas de incendio"
            value={(config.conf_incendio as number) || 0.85}
            onChange={(val) => updateCameraConfig(camera.id, { 
              config: { ...config, conf_incendio: Number(val) }
            })}
            min={0.1} max={1.0} step={0.05} decimalScale={2}
            styles={{
              label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' },
              description: { fontFamily: 'Montserrat, sans-serif', color: '#64748b' }
            }}
          />
        );

      default:
        return (
          <Alert icon={<IconAlertCircle size={18} />} color="gray">
            <Text size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Selecciona un modelo de IA para configurar los parámetros.
            </Text>
          </Alert>
        );
    }
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

      {/* Modal Agregar Usuario */}
      <Modal 
        opened={addUserModalOpen} 
        onClose={() => setAddUserModalOpen(false)} 
        title="Agregar Usuario para Reconocimiento Facial"
        styles={{ title: { fontFamily: 'Montserrat, sans-serif', fontWeight: '700' } }}
      >
        <Stack gap="md">
          <TextInput
            label="Nombre Completo"
            placeholder="Juan Pérez"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
            styles={{ label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' } }}
          />
          <TextInput
            label="RUT"
            placeholder="12.345.678-9"
            value={newUser.rut}
            onChange={(e) => setNewUser({ ...newUser, rut: e.target.value })}
            required
            styles={{ label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' } }}
          />
          <TextInput
            label="Departamento"
            placeholder="Operaciones"
            value={newUser.department}
            onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
            styles={{ label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' } }}
          />
          <Button fullWidth onClick={handleAddUser} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Agregar Usuario
          </Button>
        </Stack>
      </Modal>

      {/* Modal Agregar Patente */}
      <Modal 
        opened={addPlateModalOpen} 
        onClose={() => setAddPlateModalOpen(false)} 
        title="Agregar Patente"
        styles={{ title: { fontFamily: 'Montserrat, sans-serif', fontWeight: '700' } }}
      >
        <Stack gap="md">
          <TextInput
            label="Patente"
            placeholder="ABCD12"
            value={newPlate.plate}
            onChange={(e) => setNewPlate({ ...newPlate, plate: e.target.value.toUpperCase() })}
            required
            styles={{ label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' } }}
          />
          <TextInput
            label="Propietario"
            placeholder="Juan Pérez"
            value={newPlate.owner}
            onChange={(e) => setNewPlate({ ...newPlate, owner: e.target.value })}
            required
            styles={{ label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' } }}
          />
          <Select
            label="Tipo de Vehículo"
            placeholder="Seleccionar"
            data={['Automóvil', 'Camioneta', 'SUV', 'Motocicleta', 'Camión', 'Furgón']}
            value={newPlate.vehicleType}
            onChange={(val) => setNewPlate({ ...newPlate, vehicleType: val || '' })}
            styles={{ label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' } }}
          />
          <TextInput
            label="Marca/Modelo"
            placeholder="Toyota Corolla"
            value={newPlate.brand}
            onChange={(e) => setNewPlate({ ...newPlate, brand: e.target.value })}
            styles={{ label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' } }}
          />
          <TextInput
            label="Color"
            placeholder="Blanco"
            value={newPlate.color}
            onChange={(e) => setNewPlate({ ...newPlate, color: e.target.value })}
            styles={{ label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' } }}
          />
          <Button fullWidth color="teal" onClick={handleAddPlate} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Agregar Patente
          </Button>
        </Stack>
      </Modal>

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
                  <Text size="lg" fw={700} style={{ color: '#374151', fontFamily: 'Montserrat, sans-serif', letterSpacing: '-0.02em' }}>
                    TecnoHome
                  </Text>
                  <Text size="xs" style={{ color: '#6b7280', fontFamily: 'Montserrat, sans-serif', fontWeight: '500' }}>
                    Sistema de Vigilancia IA
                  </Text>
                </div>
              </Group>
            )}
            
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ color: '#6b7280', backgroundColor: 'transparent', transition: 'all 0.2s ease' }}
            >
              {sidebarCollapsed ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />}
            </ActionIcon>
          </Box>

          {/* Navigation Links */}
          <Box p="md">
            <Stack gap="xs">
              {[
                { icon: <IconHome size={20} />, label: 'Dashboard', path: '/dashboard', active: false },
                { icon: <IconChartPie size={20} />, label: 'Estadísticas', path: '#', active: false },
                { icon: <IconSettingsNav size={20} />, label: 'Administración', path: '/admin', active: false },
                { icon: <IconRobot size={20} />, label: 'Configuración IA', path: '/config-ia', active: true, color: '#dc2626' },
                { icon: <IconBell size={20} />, label: 'Historial', path: '/historial-notificaciones', active: false }
              ].map((item, index) => (
                <Button
                  key={index}
                  variant={item.active ? "filled" : "subtle"}
                  fullWidth
                  justify="flex-start"
                  leftSection={item.icon}
                  style={{
                    backgroundColor: item.active ? (item.color || '#dc2626') : 'transparent',
                    color: item.active ? '#ffffff' : '#6b7280',
                    border: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: item.active ? '600' : '500',
                    height: '48px',
                    borderRadius: '8px',
                    boxShadow: item.active ? '0 4px 12px rgba(220, 38, 38, 0.3)' : 'none'
                  }}
                  onClick={() => router.push(item.path)}
                >
                  {!sidebarCollapsed && item.label}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* User Avatar */}
          <Box style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', borderTop: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
            <Menu shadow="0 8px 25px rgba(0, 0, 0, 0.15)" width={220} position="top">
              <Menu.Target>
                <Button
                  variant="subtle"
                  fullWidth
                  justify="flex-start"
                  leftSection={<Avatar size="sm" radius="xl" style={{ backgroundColor: '#dc2626', color: '#ffffff' }}>TF</Avatar>}
                  style={{ backgroundColor: 'transparent', color: '#6b7280', fontFamily: 'Montserrat, sans-serif', height: '48px' }}
                >
                  {!sidebarCollapsed && 'Usuario'}
                </Button>
              </Menu.Target>
              <Menu.Dropdown style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <Menu.Label style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '4px', margin: '4px' }}>
                  <Text size="sm" fw={700}>Usuario</Text>
                  <Text size="xs" c="dimmed">Administrador del Sistema</Text>
                </Menu.Label>
                <Menu.Divider />
                <Menu.Item leftSection={<IconLogout size={18} />} color="red" onClick={() => router.push('/')}>
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
            <Paper p="xl" mb="xl" radius="md" style={{ backgroundColor: '#ffffff', border: '2px solid #dc2626', boxShadow: '0 4px 16px rgba(220, 38, 38, 0.15)' }}>
              <Group justify="space-between" align="center">
                <div>
                  <Title order={1} style={{ color: '#374151', fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '2rem', marginBottom: '8px' }}>
                    Configuración de la IA
                  </Title>
                  <Group gap="md" mt="sm">
                    <Badge size="lg" leftSection={apiAvailable ? <IconPlugConnected size={16} /> : <IconPlugConnectedX size={16} />}
                      style={{ backgroundColor: apiAvailable ? '#10b981' : '#ef4444', color: '#ffffff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}>
                      {apiAvailable ? 'API Conectada' : 'API Desconectada'}
                    </Badge>
                    {usingMockData && (
                      <Badge size="lg" leftSection={<IconDatabase size={16} />}
                        style={{ backgroundColor: '#3b82f6', color: '#ffffff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}>
                        Datos Demo
                      </Badge>
                    )}
                    <Badge size="lg" style={{ backgroundColor: '#f3f4f6', color: '#374151', fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}>
                      {cameras.length} cámaras
                    </Badge>
                  </Group>
                  <Text size="md" mt="md" style={{ color: '#6b7280', fontFamily: 'Montserrat, sans-serif' }}>
                    Gestiona las cámaras y configura los modelos de IA para cada una
                  </Text>
                </div>
                <Box style={{ width: 60, height: 60, backgroundColor: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(220, 38, 38, 0.3)' }}>
                  <IconRobot size={32} color="#ffffff" stroke={2} />
                </Box>
              </Group>
            </Paper>

            {loading ? (
              <Paper p="xl" style={{ textAlign: 'center' }}>
                <Loader size="xl" />
                <Text mt="md" style={{ fontFamily: 'Montserrat, sans-serif', color: '#6b7280' }}>Cargando configuración...</Text>
              </Paper>
            ) : (
              <Grid gutter="xl">
                {/* Lista de Cámaras */}
                <Grid.Col span={{ base: 12, lg: 4 }}>
                  <Paper p="lg" radius="md" shadow="0 2px 8px rgba(0, 0, 0, 0.05)" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
                    <Group justify="space-between" align="center" mb="lg">
                      <Title order={3} style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700', color: '#374151' }}>
                        Cámaras
                      </Title>
                      <Button leftSection={<IconRefresh size={16} />} variant="light" size="xs" onClick={loadConfiguration}>
                        Recargar
                      </Button>
                    </Group>

                    <Stack gap="sm">
                      {cameras.map(camera => {
                        const model = iaModels.find(m => m.id === camera.model);
                        return (
                          <Card
                            key={camera.id}
                            p="md"
                            radius="md"
                            withBorder
                            style={{
                              cursor: 'pointer',
                              borderColor: selectedCameraId === camera.id ? '#dc2626' : '#e5e7eb',
                              backgroundColor: selectedCameraId === camera.id ? '#fef2f2' : '#ffffff',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => setSelectedCameraId(camera.id)}
                          >
                            <Group justify="space-between" align="flex-start">
                              <Group gap="sm">
                                <ThemeIcon size="lg" radius="md" style={{ backgroundColor: model?.color || '#6b7280' }}>
                                  {getModelIcon(camera.model)}
                                </ThemeIcon>
                                <div>
                                  <Text fw={600} size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{camera.name}</Text>
                                  <Text size="xs" c="dimmed" style={{ fontFamily: 'Montserrat, sans-serif' }}>{camera.location}</Text>
                                </div>
                              </Group>
                              <Badge 
                                size="xs" 
                                color={camera.status === 'online' ? 'green' : 'red'}
                                leftSection={<IconCircleFilled size={8} />}
                              >
                                {camera.status === 'online' ? 'Online' : 'Offline'}
                              </Badge>
                            </Group>
                            <Text size="xs" mt="xs" c="dimmed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              Modelo: {model?.name || 'Sin asignar'}
                            </Text>
                          </Card>
                        );
                      })}
                    </Stack>
                  </Paper>
                </Grid.Col>

                {/* Configuración de la Cámara Seleccionada */}
                <Grid.Col span={{ base: 12, lg: 8 }}>
                  {selectedCamera ? (
                    <Paper p="xl" radius="md" shadow="0 2px 8px rgba(0, 0, 0, 0.05)" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
                      <Group justify="space-between" align="center" mb="xl">
                        <div>
                          <Group gap="sm" mb="xs">
                            <IconCamera size={24} color="#dc2626" />
                            <Title order={2} style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700', color: '#374151', fontSize: '1.5rem' }}>
                              {selectedCamera.name}
                            </Title>
                          </Group>
                          <Text size="sm" c="dimmed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {selectedCamera.location} • {selectedCamera.rtsp_url}
                          </Text>
                        </div>
                        <Badge 
                          size="lg" 
                          color={selectedCamera.status === 'online' ? 'green' : 'red'}
                          leftSection={<IconCircleFilled size={10} />}
                        >
                          {selectedCamera.status === 'online' ? 'Conectada' : 'Desconectada'}
                        </Badge>
                      </Group>

                      <Tabs defaultValue="model" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        <Tabs.List mb="lg">
                          <Tabs.Tab value="model" leftSection={<IconRobot size={16} />}>Modelo IA</Tabs.Tab>
                          <Tabs.Tab value="config" leftSection={<IconSettingsNav size={16} />}>Configuración</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="model">
                          <Stack gap="lg">
                            <Select
                              label="Modelo de IA"
                              description="Selecciona el tipo de detección para esta cámara"
                              placeholder="Seleccionar modelo"
                              data={iaModels.map(m => ({ value: m.id, label: m.name }))}
                              value={selectedCamera.model}
                              onChange={(val) => val && handleModelChange(selectedCamera.id, val)}
                              styles={{
                                label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' },
                                description: { fontFamily: 'Montserrat, sans-serif', color: '#64748b' }
                              }}
                            />

                            {selectedCamera.model && (
                              <Alert 
                                icon={getModelIcon(selectedCamera.model)} 
                                color={iaModels.find(m => m.id === selectedCamera.model)?.color || 'gray'}
                                title={iaModels.find(m => m.id === selectedCamera.model)?.name}
                              >
                                <Text size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  {iaModels.find(m => m.id === selectedCamera.model)?.description}
                                </Text>
                              </Alert>
                            )}
                          </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="config">
                          {renderModelConfig(selectedCamera)}
                        </Tabs.Panel>
                      </Tabs>
                    </Paper>
                  ) : (
                    <Paper p="xl" radius="md" style={{ backgroundColor: '#f9fafb', border: '2px dashed #e5e7eb', textAlign: 'center' }}>
                      <IconCamera size={48} color="#9ca3af" stroke={1.5} />
                      <Text mt="md" c="dimmed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Selecciona una cámara para configurar
                      </Text>
                    </Paper>
                  )}

                  
                </Grid.Col>
              </Grid>
            )}

            {/* Botones de Acción */}
            {!loading && (
              <Paper p="xl" mt="xl" radius="md" shadow="0 2px 8px rgba(0, 0, 0, 0.05)" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
                <Group justify="flex-end" gap="md">
                  <Button variant="light" color="gray" onClick={loadConfiguration} style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}>
                    Descartar Cambios
                  </Button>
                  <Button
                    leftSection={<IconDeviceFloppy size={18} />}
                    onClick={handleSaveConfiguration}
                    style={{ backgroundColor: '#dc2626', fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}
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
