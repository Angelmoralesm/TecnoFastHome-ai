import React from 'react';
import {
  Card,
  Group,
  Stack,
  Text,
  Badge,
  Button,
  ThemeIcon,
  Box
} from '@mantine/core';
import {
  IconEye,
  IconMaximize
} from '@tabler/icons-react';
import type { Camera } from '../types/dashboard';

interface CameraCardProps {
  camera: Camera;
  onViewCamera: (cameraId: number) => void;
}

export const CameraCard: React.FC<CameraCardProps> = ({ camera, onViewCamera }) => {
  const getDetectionIcon = (type: string) => {
    return type === 'fire' ? '🔥' : '🛡️';
  };

  const getDetectionColor = (type: string) => {
    return type === 'fire' ? 'red' : 'blue';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'gray';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'inactive': return 'Inactiva';
      case 'error': return 'Error';
      default: return 'Desconocido';
    }
  };

  return (
    <Card 
      shadow="sm" 
      radius="md" 
      p="md"
      style={{ 
        border: `2px solid ${camera.status === 'active' ? '#22c55e' : '#ef4444'}`,
        backgroundColor: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Card.Section p="md" style={{ backgroundColor: '#f8fafc' }}>
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <ThemeIcon 
              size="lg" 
              radius="md"
              color={getDetectionColor(camera.detectionType)}
            >
              <Text size="lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {getDetectionIcon(camera.detectionType)}
              </Text>
            </ThemeIcon>
            <div>
              <Text fw={600} size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {camera.name}
              </Text>
              <Text size="xs" c="dimmed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {camera.location}
              </Text>
            </div>
          </Group>
          <Badge 
            color={getStatusColor(camera.status)}
            variant="light"
            size="sm"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {getStatusText(camera.status)}
          </Badge>
        </Group>
      </Card.Section>

      <Stack gap="md" mt="md" style={{ flex: 1 }}>
        <Text size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {camera.description}
        </Text>

        <Group gap="md">
          <div>
            <Text size="xs" c="dimmed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Última Detección
            </Text>
            <Text size="sm" fw={500} style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {camera.lastDetection}
            </Text>
          </div>
          <div>
            <Text size="xs" c="dimmed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Precisión
            </Text>
            <Text size="sm" fw={500} style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {camera.confidence}%
            </Text>
          </div>
        </Group>

        <Box style={{ marginTop: 'auto' }}>
          <Group gap="sm">
            <Button
              variant="filled"
              size="sm"
              radius="sm"
              leftSection={<IconEye size={16} />}
              style={{
                backgroundColor: '#dc2626',
                fontFamily: 'Montserrat, sans-serif',
                flex: 1
              }}
              onClick={() => onViewCamera(camera.id)}
            >
              Ver Cámara
            </Button>
            <Button
              variant="outline"
              size="sm"
              radius="sm"
              leftSection={<IconMaximize size={16} />}
              style={{
                borderColor: '#dc2626',
                color: '#dc2626',
                fontFamily: 'Montserrat, sans-serif'
              }}
            >
              Pantalla Completa
            </Button>
          </Group>
        </Box>
      </Stack>
    </Card>
  );
}; 