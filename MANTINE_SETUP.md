# Configuración de Mantine en TecnoHome

## 📦 Paquetes Instalados

- `@mantine/core` - Componentes principales de Mantine
- `@mantine/hooks` - Hooks útiles para React
- `@mantine/notifications` - Sistema de notificaciones
- `@mantine/modals` - Gestor de modales
- `@mantine/nprogress` - Barra de progreso de navegación
- `@tabler/icons-react` - Iconos para los componentes

## 🚀 Configuración Implementada

### 1. PostCSS Configuration
- Archivo `postcss.config.cjs` configurado con `postcss-preset-mantine`
- Variables de breakpoints predefinidas
- Soporte para CSS variables de Mantine

### 2. Tema Personalizado
- Archivo `src/theme/mantine-theme.ts` con configuración personalizada
- Colores personalizados (incluyendo paleta `brand`)
- Tipografía usando la fuente Geist
- Espaciado, sombras y breakpoints personalizados

### 3. Providers Configurados
- `MantineProvider` con tema personalizado
- `ModalsProvider` para gestión de modales
- `Notifications` para sistema de notificaciones
- `NavigationProgress` para barra de progreso
- `ColorSchemeScript` para soporte de tema claro/oscuro

### 4. Estilos Importados
- Estilos core de Mantine
- Estilos para notificaciones
- Estilos para modales
- Estilos para nprogress

## 🎨 Uso de Componentes

### Componentes Básicos
```tsx
import { Button, Card, Text, Title } from '@mantine/core';

<Button>Botón Primario</Button>
<Card>Contenido de la tarjeta</Card>
<Title order={1}>Título Principal</Title>
```

### Hooks Útiles
```tsx
import { useDisclosure } from '@mantine/hooks';

const [opened, { open, close }] = useDisclosure(false);
```

### Notificaciones
```tsx
import { notifications } from '@mantine/notifications';

notifications.show({
  title: 'Título',
  message: 'Mensaje',
  color: 'green',
});
```

### Modales
```tsx
import { modals } from '@mantine/modals';

modals.open({
  title: 'Título del Modal',
  children: <div>Contenido del modal</div>,
});
```

## 🔧 Personalización del Tema

### Colores
```tsx
colors: {
  brand: [
    '#f0f9ff', // 0
    '#e0f2fe', // 1
    '#bae6fd', // 2
    '#7dd3fc', // 3
    '#38bdf8', // 4
    '#0ea5e9', // 5
    '#0284c7', // 6
    '#0369a1', // 7
    '#075985', // 8
    '#0c4a6e', // 9
  ],
}
```

### Breakpoints
```tsx
breakpoints: {
  xs: '36em',   // 576px
  sm: '48em',   // 768px
  md: '62em',   // 992px
  lg: '75em',   // 1200px
  xl: '88em',   // 1408px
}
```

## 📱 Responsive Design

Mantine incluye un sistema de breakpoints integrado:

```tsx
<Grid>
  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
    {/* Columna que se adapta según el tamaño de pantalla */}
  </Grid.Col>
</Grid>
```

## 🎯 Próximos Pasos

1. **Explorar más componentes**: Visita [ui.mantine.dev](https://ui.mantine.dev/) para ver ejemplos
2. **Personalizar el tema**: Modifica `src/theme/mantine-theme.ts` según tus necesidades
3. **Agregar más paquetes**: Instala otros paquetes de Mantine según necesites
4. **Implementar dark mode**: Configura el cambio de tema claro/oscuro

## 📚 Recursos Útiles

- [Documentación oficial](https://mantine.dev/getting-started/)
- [Componentes UI](https://ui.mantine.dev/)
- [Guía de Next.js](https://mantine.dev/guides/next/)
- [API de componentes](https://mantine.dev/core/button/)

## 🐛 Solución de Problemas

### Error de PostCSS
Si tienes problemas con PostCSS, asegúrate de que esté instalado:
```bash
npm install --save-dev postcss postcss-preset-mantine postcss-simple-vars
```

### Iconos no se muestran
Verifica que `@tabler/icons-react` esté instalado:
```bash
npm install @tabler/icons-react
```

### Estilos no se aplican
Asegúrate de que los estilos de Mantine estén importados en `_app.tsx` 