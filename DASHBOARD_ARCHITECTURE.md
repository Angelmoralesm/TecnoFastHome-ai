# Arquitectura del Dashboard TecnoFast IA

## 🏗️ Visión General

El dashboard de TecnoFast IA está diseñado con una arquitectura modular y escalable que permite a los desarrolladores entender fácilmente la estructura del código y realizar modificaciones de manera eficiente.

## 📁 Estructura de Archivos

```
src/
├── pages/
│   ├── index.tsx          # Página de login
│   └── dashboard.tsx      # Dashboard principal
├── components/
│   ├── CameraCard.tsx     # Componente de tarjeta de cámara
│   └── AlertItem.tsx      # Componente de elemento de alerta
├── types/
│   └── dashboard.ts       # Definiciones de tipos TypeScript
├── data/
│   └── mockData.ts        # Datos simulados para desarrollo
└── theme/
    └── mantine-theme.ts   # Configuración del tema de Mantine
```

## 🔧 Componentes Principales

### 1. Dashboard Principal (`dashboard.tsx`)

**Responsabilidades:**
- Renderizar la interfaz principal del dashboard
- Gestionar el estado de las cámaras y alertas
- Coordinar la comunicación entre componentes
- Manejar la navegación y modales

**Características:**
- Layout responsive con Grid de Mantine
- Estadísticas en tiempo real
- Sección de monitoreo de cámaras
- Panel de alertas recientes
- Modal para vista de cámara

### 2. CameraCard (`CameraCard.tsx`)

**Responsabilidades:**
- Mostrar información de una cámara individual
- Gestionar interacciones del usuario (ver cámara, pantalla completa)
- Renderizar el estado y métricas de la cámara

**Props:**
```typescript
interface CameraCardProps {
  camera: Camera;                                    // Datos de la cámara
  onViewCamera: (cameraId: number) => void;         // Callback para ver cámara
}
```

**Características:**
- Diseño consistente con el tema de TecnoFast
- Indicadores visuales de estado
- Botones de acción con hover effects
- Información detallada de la cámara

### 3. AlertItem (`AlertItem.tsx`)

**Responsabilidades:**
- Renderizar una alerta individual
- Mostrar información de severidad y tipo
- Aplicar estilos según la categoría de la alerta

**Props:**
```typescript
interface AlertItemProps {
  alert: Alert;                                      // Datos de la alerta
}
```

**Características:**
- Colores dinámicos según severidad
- Iconos específicos por tipo de detección
- Información contextual de la alerta

## 🎯 Tipos de Datos

### Camera
```typescript
interface Camera {
  id: number;                    // Identificador único
  name: string;                  // Nombre descriptivo
  location: string;              // Ubicación física
  status: 'active' | 'inactive' | 'error';  // Estado operativo
  detectionType: 'fire' | 'safety' | 'general';  // Tipo de detección
  lastDetection: string;         // Última detección
  confidence: number;            // Precisión de la IA (%)
  alerts: number;                // Número de alertas
  description: string;           // Descripción detallada
  ipAddress?: string;            // IP de la cámara
  port?: number;                 // Puerto de streaming
  streamUrl?: string;            // URL del stream
}
```

### Alert
```typescript
interface Alert {
  id: number;                    // Identificador único
  type: 'fire' | 'safety' | 'general';  // Tipo de alerta
  message: string;               // Mensaje descriptivo
  time: string;                  // Tiempo de la alerta
  severity: 'low' | 'medium' | 'high' | 'critical';  // Nivel de severidad
  camera: string;                // Nombre de la cámara
  cameraId: number;              // ID de la cámara
  status: 'active' | 'resolved' | 'acknowledged';  // Estado de la alerta
  confidence?: number;           // Precisión de la detección
  coordinates?: { x: number; y: number; };  // Coordenadas en el video
  imageUrl?: string;             // URL de la imagen de la alerta
}
```

## 🚀 Flujo de Datos

```
Mock Data → Dashboard → Components → UI
    ↓           ↓         ↓        ↓
mockData.ts → dashboard.tsx → CameraCard → Renderizado
    ↓           ↓         ↓        ↓
mockAlerts → dashboard.tsx → AlertItem → Renderizado
```

1. **Datos Simulados:** `mockData.ts` proporciona datos estáticos para desarrollo
2. **Dashboard:** `dashboard.tsx` importa y procesa los datos
3. **Componentes:** Los datos se pasan a los componentes especializados
4. **Renderizado:** Cada componente renderiza su parte de la interfaz

## 🎨 Sistema de Diseño

### Colores Principales
- **Primario:** #dc2626 (Rojo TecnoFast)
- **Secundario:** #374151 (Gris oscuro)
- **Acento:** #6b7280 (Gris medio)
- **Éxito:** #22c55e (Verde)
- **Advertencia:** #f59e0b (Naranja)
- **Error:** #ef4444 (Rojo)

### Tipografía
- **Familia:** Montserrat (Google Fonts)
- **Pesos:** 300, 400, 500, 600, 700
- **Jerarquía:** Títulos, subtítulos, cuerpo, etiquetas

### Espaciado
- **Base:** 8px (0.5rem)
- **Escala:** xs(0.5rem), sm(0.75rem), md(1rem), lg(1.5rem), xl(2rem)

## 🔄 Funcionalidades Implementadas

### ✅ Completadas
- [x] Interfaz del dashboard principal
- [x] Visualización de estadísticas
- [x] Tarjetas de cámara con información
- [x] Panel de alertas recientes
- [x] Modal para vista de cámara
- [x] Componentes reutilizables
- [x] Sistema de tipos TypeScript
- [x] Datos simulados para desarrollo

### 🚧 Pendientes
- [ ] Integración con cámaras reales
- [ ] Streaming de video en tiempo real
- [ ] Lógica de autenticación
- [ ] Base de datos real
- [ ] API de detección de IA
- [ ] Notificaciones push
- [ ] Grabación de video
- [ ] Reportes y analytics

## 🛠️ Guías de Desarrollo

### Agregar Nueva Cámara
1. Agregar entrada en `mockData.ts`
2. La interfaz se actualiza automáticamente
3. El componente `CameraCard` maneja la renderización

### Agregar Nuevo Tipo de Alerta
1. Extender el tipo `Alert` en `dashboard.ts`
2. Agregar lógica de renderizado en `AlertItem`
3. Actualizar `mockData.ts` con ejemplos

### Modificar el Tema
1. Editar `src/theme/mantine-theme.ts`
2. Los cambios se aplican globalmente
3. Los componentes heredan automáticamente

### Agregar Nueva Funcionalidad
1. Crear componente en `src/components/`
2. Definir tipos en `src/types/`
3. Integrar en `dashboard.tsx`
4. Agregar datos simulados si es necesario

## 🔍 Patrones de Diseño

### Componente Presentacional
- Los componentes solo manejan la presentación
- La lógica de negocio está en el dashboard principal
- Props bien definidas para comunicación

### Separación de Responsabilidades
- **Types:** Definiciones de datos
- **Data:** Datos simulados y funciones
- **Components:** Lógica de presentación
- **Pages:** Coordinación y estado

### Reutilización
- Componentes modulares y reutilizables
- Props tipadas para mejor mantenibilidad
- Estilos consistentes con el sistema de diseño

## 📱 Responsive Design

### Breakpoints
- **Base:** < 36em (móviles)
- **SM:** 48em (tablets pequeñas)
- **MD:** 62em (tablets)
- **LG:** 75em (desktops)
- **XL:** 88em (desktops grandes)

### Adaptaciones
- Grid responsivo con `span={{ base: 12, md: 6 }}`
- Componentes que se adaptan al espacio disponible
- Navegación optimizada para móviles

## 🧪 Testing y Debugging

### Datos Simulados
- Usar `mockData.ts` para desarrollo
- Modificar valores para probar diferentes escenarios
- Agregar nuevas entradas para testing

### Console Logs
- Agregar logs en funciones clave
- Verificar el flujo de datos
- Debuggear el estado de los componentes

### Herramientas de Desarrollo
- React DevTools para inspeccionar componentes
- TypeScript para detección de errores
- ESLint para mantener estándares de código

## 🚀 Próximos Pasos

1. **Implementar autenticación real**
2. **Integrar con API de cámaras**
3. **Conectar con servicios de IA**
4. **Agregar base de datos real**
5. **Implementar notificaciones en tiempo real**
6. **Agregar sistema de permisos**
7. **Crear dashboard de administración**
8. **Implementar logging y analytics**

---

**Nota:** Esta documentación se actualiza conforme evoluciona el proyecto. Mantén este archivo actualizado con cualquier cambio significativo en la arquitectura. 