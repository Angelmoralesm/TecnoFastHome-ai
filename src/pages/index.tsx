import Head from "next/head";
import Image from "next/image";
import { 
  Button, 
  Text, 
  Group, 
  Stack, 
  Title, 
  Container,
  Grid,
  TextInput,
  ActionIcon,
  Box,
  Avatar,
  Badge,
  Paper
} from '@mantine/core';
import { IconEyeOff, IconMail, IconLock, IconArrowRight, IconArrowLeft, IconShield, IconVideo, IconAlertTriangle, IconEye, IconEyeOff as IconEyeOffTabler } from '@tabler/icons-react';
import { useState } from 'react';

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <Head>
        <title>TecnoFast - Monitoreo de Seguridad IA</title>
        <meta name="description" content="Plataforma de monitoreo de seguridad con IA para TecnoFast - Casas Prefabricadas" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <main style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Montserrat, sans-serif' }}>
        {/* Sección izquierda - Formulario de Login */}
        <Box 
          style={{ 
            flex: 1, 
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <Container size="sm">
            <Stack gap="lg">
              {/* Logo y branding */}
              <Stack gap="sm" align="center">
                <Image 
                  src="/tfhome.png" 
                  alt="TecnoFast Logo" 
                  width={120} 
                  height={60}
                />
                <Title order={2} size="h2" style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: '#374151',
                  fontFamily: 'Montserrat, sans-serif'
                }}>
                  Bienvenido a TecnoFast IA
                </Title>
                <Text size="md" c="dimmed" ta="center" style={{ 
                  maxWidth: '350px',
                  color: '#6b7280',
                  fontWeight: '400',
                  fontSize: '1.1rem',
                  fontFamily: 'Montserrat, sans-serif'
                }}>
                  Plataforma de monitoreo inteligente para garantizar seguridad y eficiencia.
                </Text>
              </Stack>

              {/* Formulario */}
              <Stack gap="md">
                <TextInput
                  label="Email"
                  placeholder="Ingresa tu email corporativo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftSection={<IconMail size={16} />}
                  size="lg"
                  radius="md"
                  styles={{
                    label: { 
                      color: '#374151', 
                      fontWeight: '600', 
                      fontSize: '1rem',
                      fontFamily: 'Montserrat, sans-serif'
                    },
                    input: { 
                      borderColor: '#d1d5db',
                      fontSize: '1rem',
                      fontFamily: 'Montserrat, sans-serif',
                      transition: 'all 0.2s ease',
                      '&:focus': { borderColor: '#dc2626' },
                      '&:hover': { 
                        borderColor: '#9ca3af',
                        boxShadow: '0 0 0 1px #9ca3af'
                      }
                    }
                  }}
                />
                
                <TextInput
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftSection={<IconLock size={16} />}
                  rightSection={
                    <ActionIcon 
                      variant="subtle" 
                      size="sm" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ 
                        color: '#6b7280',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#dc2626';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </ActionIcon>
                  }
                  size="lg"
                  radius="md"
                  styles={{
                    label: { 
                      color: '#374151', 
                      fontWeight: '600', 
                      fontSize: '1rem',
                      fontFamily: 'Montserrat, sans-serif'
                    },
                    input: { 
                      borderColor: '#d1d5db',
                      fontSize: '1rem',
                      fontFamily: 'Montserrat, sans-serif',
                      transition: 'all 0.2s ease',
                      '&:focus': { borderColor: '#dc2626' },
                      '&:hover': { 
                        borderColor: '#9ca3af',
                        boxShadow: '0 0 0 1px #9ca3af'
                      }
                    }
                  }}
                />

                <Button 
                  size="lg" 
                  radius="sm"
                  variant="outline"
                  style={{ 
                    borderColor: '#dc2626',
                    borderWidth: '2px',
                    height: '3rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#dc2626',
                    backgroundColor: 'white',
                    fontFamily: 'Montserrat, sans-serif',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': { 
                      backgroundColor: '#dc2626',
                      borderColor: '#dc2626',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                    e.currentTarget.style.borderColor = '#dc2626';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#dc2626';
                    e.currentTarget.style.color = '#dc2626';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Acceder al Sistema
                </Button>

                <Text ta="center" size="sm" style={{ 
                  color: '#9ca3af', 
                  fontSize: '0.95rem',
                  fontFamily: 'Montserrat, sans-serif'
                }}>
                  ¿No tienes una cuenta?{' '}
                  <Text 
                    component="span" 
                    style={{ 
                      color: '#dc2626', 
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontFamily: 'Montserrat, sans-serif',
                      transition: 'all 0.2s ease',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#b91c1c';
                      e.currentTarget.style.textDecorationThickness = '2px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#dc2626';
                      e.currentTarget.style.textDecorationThickness = '1px';
                    }}
                  >
                    Contacta al administrador
                  </Text>
                </Text>
              </Stack>
            </Stack>
          </Container>
        </Box>

        {/* Sección derecha - Promocional con imagen de fondo */}
        <Box 
          style={{ 
            flex: 1, 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1.5rem',
            overflow: 'hidden'
          }}
        >
          {/* Imagen de fondo */}
          <Image
            src="/bgLogin.jpg"
            alt="Fondo TecnoFast"
            fill
            style={{
              objectFit: 'cover',
              zIndex: 0
            }}
          />
          
          {/* Overlay oscuro para mejor legibilidad */}
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1
            }}
          />

          {/* Contenido sobre la imagen */}
          <Container size="lg" style={{ position: 'relative', zIndex: 2 }}>
            <Stack gap="lg" align="center">
              {/* Título principal */}
              <Title 
                order={1} 
                size="h1" 
                ta="center"
                style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '700',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  maxWidth: '400px',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                Monitoreo Inteligente de Seguridad en Tiempo Real
              </Title>

              {/* Iconos de características */}
              <Group gap="xl">
                <Stack align="center" gap="sm">
                  <Box
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#dc2626',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 16px rgba(220, 38, 38, 0.3)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.4)';
                      e.currentTarget.style.backgroundColor = '#b91c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(220, 38, 38, 0.3)';
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    }}
                  >
                    <IconVideo size={32} color="white" />
                  </Box>
                  <Text size="sm" c="white" ta="center" style={{ 
                    fontWeight: '600',
                    fontFamily: 'Montserrat, sans-serif',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.fontWeight = '700';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.fontWeight = '600';
                  }}>
                    Cámaras en Vivo
                    </Text>
                  </Stack>

                <Stack align="center" gap="sm">
                  <Box
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#dc2626',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 16px rgba(220, 38, 38, 0.3)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.4)';
                      e.currentTarget.style.backgroundColor = '#b91c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(220, 38, 38, 0.3)';
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    }}
                  >
                    <IconShield size={32} color="white" />
                  </Box>
                  <Text size="sm" c="white" ta="center" style={{ 
                    fontWeight: '600',
                    fontFamily: 'Montserrat, sans-serif',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.fontWeight = '700';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.fontWeight = '600';
                  }}>
                    Seguridad IA
                    </Text>
                  </Stack>

                <Stack align="center" gap="sm">
                  <Box
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#dc2626',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 16px rgba(220, 38, 38, 0.3)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.4)';
                      e.currentTarget.style.backgroundColor = '#b91c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(220, 38, 38, 0.3)';
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    }}
                  >
                    <IconAlertTriangle size={32} color="white" />
                  </Box>
                  <Text size="sm" c="white" ta="center" style={{ 
                    fontWeight: '600',
                    fontFamily: 'Montserrat, sans-serif',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.fontWeight = '700';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.fontWeight = '600';
                  }}>
                    Detección de Riesgos
                    </Text>
                  </Stack>
              </Group>

              {/* Caja de características */}
              <Paper 
                p="md" 
                radius="md" 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid #dc2626',
                  maxWidth: '400px',
                  width: '100%',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
                  e.currentTarget.style.borderColor = '#b91c1c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
                  e.currentTarget.style.borderColor = '#dc2626';
                }}
              >
              <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Badge 
                      size="md" 
                      radius="xl"
                      style={{ 
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '6px 12px',
                        fontWeight: '600',
                        fontFamily: 'Montserrat, sans-serif',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#b91c1c';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Group gap="xs">
                        <Box style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
                        <Box style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%', opacity: 0.7 }} />
                        Monitoreando
                      </Group>
                    </Badge>
                    
                    <Group gap="xs">
                      <IconEye size={18} color="#dc2626" />
                    </Group>
                  </Group>
                  
                  <Text size="md" ta="center" style={{ 
                    fontWeight: '500',
                    color: '#374151',
                    lineHeight: '1.5',
                    fontFamily: 'Montserrat, sans-serif'
                  }}>
                    Sistema de IA que analiza en tiempo real el cumplimiento de estándares de seguridad.
                </Text>
              </Stack>
              </Paper>
          </Stack>
        </Container>
        </Box>
      </main>
    </>
  );
}
