import React from 'react';
import {
  Alert,
  Group,
  Text,
  ThemeIcon
} from '@mantine/core';
import {
  IconFlame,
  IconShield
} from '@tabler/icons-react';
import type { Alert as AlertType } from '../types/dashboard';

interface AlertItemProps {
  alert: AlertType;
}

export const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'yellow';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  const getDetectionIcon = (type: string) => {
    return type === 'fire' ? <IconFlame size={14} /> : <IconShield size={14} />;
  };

  const getTypeText = (type: string) => {
    return type === 'fire' ? 'Incendio' : 'Seguridad';
  };

  return (
    <Alert
      variant="light"
      color={getSeverityColor(alert.severity)}
      title={
        <Group gap="sm">
          <ThemeIcon 
            size="sm" 
            radius="sm"
            color={getSeverityColor(alert.severity)}
          >
            {getDetectionIcon(alert.type)}
          </ThemeIcon>
          <Text size="sm" fw={500} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {getTypeText(alert.type)}
          </Text>
        </Group>
      }
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <Text size="sm" mb="xs" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {alert.message}
      </Text>
      <Group gap="xs" justify="space-between">
        <Text size="xs" c="dimmed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {alert.time}
        </Text>
        <Text size="xs" c="dimmed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {alert.camera}
        </Text>
      </Group>
    </Alert>
  );
}; 