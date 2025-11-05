'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Box, Text, Badge, Loader, Alert, Group, Button, Stack } from '@mantine/core';
import { IconAlertCircle, IconVideo, IconVideoOff, IconRefresh } from '@tabler/icons-react';
import { getStreamUrl, checkStreamStatus } from '~/services/monitorIaApi';

interface LiveCameraFeedProps {
  showControls?: boolean;
  height?: string | number;
  title?: string;
}

export default function LiveCameraFeed({ 
  showControls = true, 
  height = '480px',
  title = 'Cámara en Vivo'
}: LiveCameraFeedProps) {
  const [streamAvailable, setStreamAvailable] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [streamKey, setStreamKey] = useState(Date.now());
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    checkStream();
  }, []);

  const checkStream = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = await checkStreamStatus();
      setStreamAvailable(status.available);
      
      if (!status.available) {
        setError(status.message || 'Stream no disponible');
      }
    } catch (err) {
      console.error('Error verificando stream:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setStreamAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setImageError(false);
    setStreamKey(Date.now());
    checkStream();
  };

  const handleImageError = () => {
    setImageError(true);
    setError('No se pudo cargar el stream. Verifica que la URL RTSP esté configurada y sea accesible.');
  };

  const handleImageLoad = () => {
    setImageError(false);
    setError(null);
  };

  if (loading) {
    return (
      <Paper
        p="xl"
        radius="md"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          textAlign: 'center',
          minHeight: height
        }}
      >
        <Stack align="center" justify="center" style={{ height: '100%' }}>
          <Loader size="xl" />
          <Text 
            mt="md" 
            style={{ 
              fontFamily: 'Montserrat, sans-serif', 
              color: '#6b7280',
              fontWeight: '500'
            }}
          >
            Verificando disponibilidad del stream...
          </Text>
        </Stack>
      </Paper>
    );
  }

  if (error || !streamAvailable) {
    return (
      <Paper
        p="xl"
        radius="md"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          minHeight: height
        }}
      >
        <Stack gap="md">
          <Alert 
            icon={<IconAlertCircle size={20} />} 
            title="Stream no disponible" 
            color="yellow"
          >
            <Text size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {error || 'No se ha configurado una URL RTSP o el stream no está accesible.'}
            </Text>
            <Text size="xs" mt="sm" style={{ fontFamily: 'Montserrat, sans-serif', color: '#6b7280' }}>
              Para configurar la cámara, ve a la sección de configuración y establece una URL RTSP válida.
            </Text>
          </Alert>
          
          {showControls && (
            <Button
              leftSection={<IconRefresh size={18} />}
              onClick={handleRefresh}
              variant="light"
              color="blue"
              fullWidth
              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}
            >
              Reintentar
            </Button>
          )}
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      p="md"
      radius="md"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb'
      }}
    >
      <Group justify="space-between" mb="md">
        <Group gap="sm">
          <IconVideo size={24} color="#dc2626" />
          <div>
            <Text
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: '700',
                fontSize: '1.1rem',
                color: '#374151'
              }}
            >
              {title}
            </Text>
            <Badge
              size="sm"
              variant="light"
              style={{
                backgroundColor: imageError ? '#ef4444' : '#10b981',
                color: '#ffffff',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: '600'
              }}
              leftSection={imageError ? <IconVideoOff size={14} /> : <IconVideo size={14} />}
            >
              {imageError ? 'Desconectado' : 'En vivo'}
            </Badge>
          </div>
        </Group>
        
        {showControls && (
          <Button
            size="xs"
            leftSection={<IconRefresh size={16} />}
            onClick={handleRefresh}
            variant="light"
            color="gray"
            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}
          >
            Actualizar
          </Button>
        )}
      </Group>

      <Box
        style={{
          backgroundColor: '#000000',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          height: height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {imageError ? (
          <Stack align="center" gap="md" p="xl">
            <IconVideoOff size={64} color="#6b7280" />
            <Text 
              style={{ 
                color: '#ffffff', 
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: '500'
              }}
            >
              Error de conexión
            </Text>
            <Button
              leftSection={<IconRefresh size={16} />}
              onClick={handleRefresh}
              variant="light"
              color="red"
              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}
            >
              Reconectar
            </Button>
          </Stack>
        ) : (
          <img
            key={streamKey}
            ref={imgRef}
            src={getStreamUrl()}
            alt="Live Camera Feed"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        )}
      </Box>

      <Text 
        size="xs" 
        mt="sm" 
        style={{ 
          fontFamily: 'Montserrat, sans-serif', 
          color: '#6b7280',
          textAlign: 'center'
        }}
      >
        Stream MJPEG desde Monitor-IA • Actualización automática
      </Text>
    </Paper>
  );
}



