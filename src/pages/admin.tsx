import { useState } from 'react';
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
  Table,
  ActionIcon,
  Badge,
  Modal,
  Divider,
  Grid,
  AppShell,
  Avatar,
  Menu
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCamera,
  IconPlus,
  IconEdit,
  IconTrash,
  IconDeviceFloppy,
  IconX,
  IconUsers,
  IconVideo,
  IconHome,
  IconChartPie,
  IconSettings as IconSettingsNav,
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
  IconShieldCheck,
  IconPhone,
  IconBrandWhatsapp,
  IconAlertCircle
} from '@tabler/icons-react';
import { useRouter } from 'next/router';

interface Camera {
  id: number;
  name: string;
  rtspUrl: string;
  location: string;
  status: 'active' | 'inactive';
}

interface Contact {
  id: number;
  name: string;
  phone: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cameraModalOpened, { open: openCameraModal, close: closeCameraModal }] = useDisclosure(false);
  const [contactModalOpened, { open: openContactModal, close: closeContactModal }] = useDisclosure(false);
  
  // Estado para cámaras
  const [cameras, setCameras] = useState<Camera[]>([
    { id: 1, name: 'Cámara Entrada Principal', rtspUrl: 'rtsp://example.com/stream1', location: 'Entrada', status: 'active' },
    { id: 2, name: 'Cámara Parking', rtspUrl: 'rtsp://example.com/stream2', location: 'Estacionamiento', status: 'active' },
  ]);
  
  // Estado para contactos
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: 'Juan Pérez', phone: '56950679940' },
    { id: 2, name: 'María González', phone: '56981574316' },
  ]);

  // Estados para formularios
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [newCamera, setNewCamera] = useState({ name: '', rtspUrl: '', location: '' });
  
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

  // Funciones para cámaras
  const handleAddCamera = () => {
    if (newCamera.name && newCamera.rtspUrl) {
      const newCam: Camera = {
        id: Date.now(),
        name: newCamera.name,
        rtspUrl: newCamera.rtspUrl,
        location: newCamera.location,
        status: 'active'
      };
      setCameras([...cameras, newCam]);
      setNewCamera({ name: '', rtspUrl: '', location: '' });
      closeCameraModal();
    }
  };

  const handleEditCamera = (camera: Camera) => {
    setEditingCamera(camera);
    setNewCamera({ name: camera.name, rtspUrl: camera.rtspUrl, location: camera.location });
    openCameraModal();
  };

  const handleUpdateCamera = () => {
    if (editingCamera && newCamera.name && newCamera.rtspUrl) {
      setCameras(cameras.map(cam => 
        cam.id === editingCamera.id 
          ? { ...cam, name: newCamera.name, rtspUrl: newCamera.rtspUrl, location: newCamera.location }
          : cam
      ));
      setEditingCamera(null);
      setNewCamera({ name: '', rtspUrl: '', location: '' });
      closeCameraModal();
    }
  };

  const handleDeleteCamera = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta cámara?')) {
      setCameras(cameras.filter(cam => cam.id !== id));
    }
  };

  // Funciones para contactos
  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const newCont: Contact = {
        id: Date.now(),
        name: newContact.name,
        phone: newContact.phone
      };
      setContacts([...contacts, newCont]);
      setNewContact({ name: '', phone: '' });
      closeContactModal();
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setNewContact({ name: contact.name, phone: contact.phone });
    openContactModal();
  };

  const handleUpdateContact = () => {
    if (editingContact && newContact.name && newContact.phone) {
      setContacts(contacts.map(cont => 
        cont.id === editingContact.id 
          ? { ...cont, name: newContact.name, phone: newContact.phone }
          : cont
      ));
      setEditingContact(null);
      setNewContact({ name: '', phone: '' });
      closeContactModal();
    }
  };

  const handleDeleteContact = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este contacto?')) {
      setContacts(contacts.filter(cont => cont.id !== id));
    }
  };

  const openNewCameraModal = () => {
    setEditingCamera(null);
    setNewCamera({ name: '', rtspUrl: '', location: '' });
    openCameraModal();
  };

  const openNewContactModal = () => {
    setEditingContact(null);
    setNewContact({ name: '', phone: '' });
    openContactModal();
  };

  return (
    <>
      <Head>
        <title>TecnoHome - Administración</title>
        <meta name="description" content="Panel de administración del sistema de vigilancia" />
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
                variant="filled"
                fullWidth
                justify="flex-start"
                leftSection={<IconSettingsNav size={20} />}
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
                    Panel de Administración
                  </Title>
                  <Text 
                    size="md" 
                    style={{ 
                      color: '#6b7280', 
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: '400'
                    }}
                  >
                    Gestiona las cámaras y contactos de emergencia del sistema
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
                  <IconSettingsNav size={32} color="#ffffff" stroke={2} />
                </Box>
              </Group>
            </Paper>

            <Grid gutter="xl">
              {/* Sección de Cámaras */}
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
                    <Group gap="md">
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
                        <IconVideo size={24} color="#ffffff" stroke={2} />
                      </Box>
                      <div>
                        <Title 
                          order={2} 
                          style={{ 
                            color: '#374151', 
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: '700',
                            fontSize: '1.5rem'
                          }}
                        >
                          Gestión de Cámaras
                        </Title>
                        <Text 
                          size="sm" 
                          style={{ 
                            color: '#6b7280', 
                            fontFamily: 'Montserrat, sans-serif'
                          }}
                        >
                          {cameras.length} cámara{cameras.length !== 1 ? 's' : ''} configurada{cameras.length !== 1 ? 's' : ''}
                        </Text>
                      </div>
                    </Group>
                    <Button
                      leftSection={<IconPlus size={18} />}
                      style={{
                        backgroundColor: '#dc2626',
                        border: 'none',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '600',
                        color: '#ffffff',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#b91c1c';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                      }}
                      onClick={openNewCameraModal}
                    >
                      Agregar Cámara
                    </Button>
                  </Group>

                  <Box style={{ overflowX: 'auto' }}>
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr style={{ backgroundColor: '#f8fafc' }}>
                          <Table.Th style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700', color: '#1e293b' }}>Nombre</Table.Th>
                          <Table.Th style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700', color: '#1e293b' }}>URL RTSP</Table.Th>
                          <Table.Th style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700', color: '#1e293b' }}>Ubicación</Table.Th>
                          <Table.Th style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700', color: '#1e293b' }}>Estado</Table.Th>
                          <Table.Th style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700', color: '#1e293b' }}>Acciones</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {cameras.map((camera) => (
                          <Table.Tr key={camera.id}>
                            <Table.Td style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}>{camera.name}</Table.Td>
                            <Table.Td style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', color: '#64748b' }}>
                              <code style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
                                {camera.rtspUrl.length > 30 ? camera.rtspUrl.substring(0, 30) + '...' : camera.rtspUrl}
                              </code>
                            </Table.Td>
                            <Table.Td style={{ fontFamily: 'Montserrat, sans-serif' }}>{camera.location}</Table.Td>
                            <Table.Td>
                              <Badge 
                                color={camera.status === 'active' ? 'green' : 'gray'}
                                variant="light"
                                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}
                              >
                                {camera.status === 'active' ? 'Activa' : 'Inactiva'}
                              </Badge>
                            </Table.Td>
                            <Table.Td>
                              <Group gap="xs">
                                <ActionIcon
                                  variant="light"
                                  color="blue"
                                  onClick={() => handleEditCamera(camera)}
                                >
                                  <IconEdit size={18} />
                                </ActionIcon>
                                <ActionIcon
                                  variant="light"
                                  color="red"
                                  onClick={() => handleDeleteCamera(camera.id)}
                                >
                                  <IconTrash size={18} />
                                </ActionIcon>
                              </Group>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Box>

                  {cameras.length === 0 && (
                    <Box p="xl" style={{ textAlign: 'center' }}>
                      <IconAlertCircle size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
                      <Text style={{ color: '#64748b', fontFamily: 'Montserrat, sans-serif' }}>
                        No hay cámaras configuradas. Agrega una para comenzar.
                      </Text>
                    </Box>
                  )}
                </Paper>
              </Grid.Col>

              {/* Sección de Contactos */}
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
                    <Group gap="md">
                      <Box
                        style={{
                          width: 48,
                          height: 48,
                          backgroundColor: '#10b981',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <IconBrandWhatsapp size={24} color="#ffffff" stroke={2} />
                      </Box>
                      <div>
                        <Title 
                          order={2} 
                          style={{ 
                            color: '#374151', 
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: '700',
                            fontSize: '1.5rem'
                          }}
                        >
                          Contactos de Emergencia
                        </Title>
                        <Text 
                          size="sm" 
                          style={{ 
                            color: '#6b7280', 
                            fontFamily: 'Montserrat, sans-serif'
                          }}
                        >
                          {contacts.length} contacto{contacts.length !== 1 ? 's' : ''} configurado{contacts.length !== 1 ? 's' : ''}
                        </Text>
                      </div>
                    </Group>
                    <Button
                      leftSection={<IconPlus size={18} />}
                      style={{
                        backgroundColor: '#10b981',
                        border: 'none',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '600',
                        color: '#ffffff',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#059669';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#10b981';
                      }}
                      onClick={openNewContactModal}
                    >
                      Agregar Contacto
                    </Button>
                  </Group>

                  <Stack gap="md">
                    {contacts.map((contact) => (
                      <Paper
                        key={contact.id}
                        p="md"
                        radius="lg"
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.borderColor = '#cbd5e1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                      >
                        <Group justify="space-between" align="center">
                          <Group gap="md">
                            <Box
                              style={{
                                width: 40,
                                height: 40,
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <IconPhone size={20} color="#ffffff" />
                            </Box>
                            <div>
                              <Text 
                                fw={600} 
                                style={{ 
                                  fontFamily: 'Montserrat, sans-serif',
                                  color: '#1e293b'
                                }}
                              >
                                {contact.name}
                              </Text>
                              <Group gap="xs">
                                <IconBrandWhatsapp size={14} color="#10b981" />
                                <Text 
                                  size="sm" 
                                  style={{ 
                                    fontFamily: 'Montserrat, sans-serif',
                                    color: '#64748b'
                                  }}
                                >
                                  +{contact.phone}
                                </Text>
                              </Group>
                            </div>
                          </Group>
                          <Group gap="xs">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => handleEditContact(contact)}
                            >
                              <IconEdit size={18} />
                            </ActionIcon>
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={() => handleDeleteContact(contact.id)}
                            >
                              <IconTrash size={18} />
                            </ActionIcon>
                          </Group>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>

                  {contacts.length === 0 && (
                    <Box p="xl" style={{ textAlign: 'center' }}>
                      <IconAlertCircle size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
                      <Text style={{ color: '#64748b', fontFamily: 'Montserrat, sans-serif' }}>
                        No hay contactos de emergencia. Agrega uno para recibir alertas.
                      </Text>
                    </Box>
                  )}
                </Paper>
              </Grid.Col>
            </Grid>
          </Container>
        </AppShell.Main>
      </AppShell>

      {/* Modal para Cámara */}
      <Modal
        opened={cameraModalOpened}
        onClose={() => {
          closeCameraModal();
          setEditingCamera(null);
          setNewCamera({ name: '', rtspUrl: '', location: '' });
        }}
        title={
          <Group gap="sm">
            <IconCamera size={24} />
            <Text fw={700} size="lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {editingCamera ? 'Editar Cámara' : 'Agregar Nueva Cámara'}
            </Text>
          </Group>
        }
        size="lg"
        radius="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Nombre de la Cámara"
            placeholder="Ej: Cámara Entrada Principal"
            value={newCamera.name}
            onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
            required
            styles={{
              label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' },
              input: { fontFamily: 'Montserrat, sans-serif' }
            }}
          />
          
          <TextInput
            label="URL RTSP"
            placeholder="rtsp://usuario:contraseña@ip:puerto/stream"
            value={newCamera.rtspUrl}
            onChange={(e) => setNewCamera({ ...newCamera, rtspUrl: e.target.value })}
            required
            styles={{
              label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' },
              input: { fontFamily: 'Montserrat, sans-serif', fontFamily: 'monospace' }
            }}
          />
          
          <TextInput
            label="Ubicación"
            placeholder="Ej: Entrada Principal, Parking, etc."
            value={newCamera.location}
            onChange={(e) => setNewCamera({ ...newCamera, location: e.target.value })}
            styles={{
              label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' },
              input: { fontFamily: 'Montserrat, sans-serif' }
            }}
          />

          <Divider my="sm" />

          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              color="gray"
              onClick={() => {
                closeCameraModal();
                setEditingCamera(null);
                setNewCamera({ name: '', rtspUrl: '', location: '' });
              }}
              leftSection={<IconX size={18} />}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Cancelar
            </Button>
            <Button
              onClick={editingCamera ? handleUpdateCamera : handleAddCamera}
              leftSection={<IconDeviceFloppy size={18} />}
              style={{
                backgroundColor: '#dc2626',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: '600',
                color: '#ffffff',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#b91c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
            >
              {editingCamera ? 'Actualizar' : 'Guardar'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal para Contacto */}
      <Modal
        opened={contactModalOpened}
        onClose={() => {
          closeContactModal();
          setEditingContact(null);
          setNewContact({ name: '', phone: '' });
        }}
        title={
          <Group gap="sm">
            <IconBrandWhatsapp size={24} color="#10b981" />
            <Text fw={700} size="lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {editingContact ? 'Editar Contacto' : 'Agregar Nuevo Contacto'}
            </Text>
          </Group>
        }
        size="md"
        radius="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Nombre del Contacto"
            placeholder="Ej: Juan Pérez"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            required
            styles={{
              label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' },
              input: { fontFamily: 'Montserrat, sans-serif' }
            }}
          />
          
          <TextInput
            label="Número de WhatsApp"
            placeholder="56912345678 (sin + ni espacios)"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value.replace(/[^0-9]/g, '') })}
            required
            description="Ingresa el número con código de país sin el signo +"
            styles={{
              label: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600' },
              input: { fontFamily: 'Montserrat, sans-serif' },
              description: { fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', color: '#64748b' }
            }}
          />

          <Divider my="sm" />

          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              color="gray"
              onClick={() => {
                closeContactModal();
                setEditingContact(null);
                setNewContact({ name: '', phone: '' });
              }}
              leftSection={<IconX size={18} />}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Cancelar
            </Button>
            <Button
              onClick={editingContact ? handleUpdateContact : handleAddContact}
              leftSection={<IconDeviceFloppy size={18} />}
              style={{
                backgroundColor: '#10b981',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: '600',
                color: '#ffffff',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              {editingContact ? 'Actualizar' : 'Guardar'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

