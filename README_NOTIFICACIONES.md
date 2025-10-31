# 📢 Sistema de Notificaciones - TecnoHome IA

## 🎯 ¿Qué son las Notificaciones?

El sistema de TecnoHome IA tiene **dos tipos de notificaciones** que funcionan juntas para mantenerte informado sobre la seguridad:

### 1. 📱 Notificaciones Visuales (Dashboard)
- Aparecen en la esquina superior derecha del dashboard
- Te informan sobre el estado de las acciones en tiempo real
- Son instantáneas y no requieren configuración adicional

### 2. 💬 Notificaciones por WhatsApp (Alertas de Emergencia)
- Envían mensajes de texto a teléfonos configurados
- Se activan con el botón rojo "Enviar Alerta de Emergencia"
- Requieren configuración inicial del bot de WhatsApp

---

## 🚀 Cómo Ejecutar el Sistema Completo

### Paso 1: Iniciar Todo el Sistema
```cmd
# Opción recomendada (compatible con todos los Windows):
iniciar_sistema_compat.bat

# O para usos posteriores:
iniciar_rapido_compat.bat
```

### Paso 2: Verificar que Todo Funciona
El sistema se abre automáticamente en: **`http://localhost:3000`**

Deberías ver:
- ✅ Dashboard principal
- ✅ Cámaras activas (si tienes cámara conectada)
- ✅ Botón "Enviar Alerta de Emergencia" en rojo

---

## 🔧 Configuración de Notificaciones Visuales

### ¡No requieren configuración!
Las notificaciones visuales funcionan automáticamente desde que inicias el dashboard.

### Cómo Probarlas:
1. Ve al dashboard en `http://localhost:3000`
2. Localiza el botón rojo **"Enviar Alerta de Emergencia"**
3. Haz clic en el botón
4. **Observa la esquina superior derecha** - verás las notificaciones aparecer

### Qué Verás:
1. **🔵 Notificación Azul**: "Enviando alerta de emergencia"
2. **🟢 Notificación Verde**: "¡Alerta enviada exitosamente!" (si funciona)
3. **🔴 Notificación Roja**: "Error al enviar alerta" (si hay problemas)

---

## 📱 Configuración de Notificaciones por WhatsApp

### Paso 1: Primera Configuración (Obligatorio)

**IMPORTANTE**: Necesitas un teléfono con WhatsApp instalado para la autenticación inicial.

```cmd
# Abre una terminal y ejecuta:
node public/setup-bot.mjs
```

### Paso 2: Sigue las Instrucciones
El script te guiará paso a paso:
1. **Lee las instrucciones** que aparecen en pantalla
2. **Abre WhatsApp** en tu teléfono
3. **Escanea el código QR** que se muestra en la terminal
4. **Espera la confirmación** - "¡Autenticación exitosa!"

### Paso 3: Configurar Números de Teléfono

Para cambiar los números que reciben las alertas, edita estos archivos:

**Archivos a editar:**
- `public/bot.mjs`
- `public/bot-with-gui.mjs`
- `public/setup-bot.mjs`

**Busca estas líneas:**
```javascript
const numero = '56950679940';    // Cambia este número
const numero2 = '56981574316';   // Cambia este número
```

**Formato correcto:**
- Incluye código de país: `56950679940` (Chile)
- Sin espacios ni símbolos: `+56950679940` ❌ → `56950679940` ✅
- Solo números: sin `+`, `-`, espacios

---

## 🧪 Cómo Probar las Notificaciones por WhatsApp

### Prueba Completa:
1. **Inicia el sistema** con `iniciar_rapido_compat.bat`
2. **Ve al dashboard** en `http://localhost:3000`
3. **Haz clic** en "Enviar Alerta de Emergencia"
4. **Observa:**
   - Notificación visual azul → verde/roja
   - **Revisa tus teléfonos** configurados

### Mensaje que Deberías Recibir:
```
🚨 ALERTA DE EMERGENCIA 🚨

Se ha activado el sistema de seguridad IA.
Verifica inmediatamente el área de trabajo.

Sistema: TecnoHome IA
Fecha: [fecha actual]
```

---

## 🔍 Verificación del Estado

### Cómo Saber si Todo Funciona:

#### Opción 1: Desde el Dashboard
- Ve a `http://localhost:3000`
- El botón de alerta está disponible = ✅ Sistema funcionando

#### Opción 2: Verificar Servicios
```cmd
# Abre CMD y ejecuta:
netstat -ano | findstr "3000\|5000\|5001"
```

Deberías ver:
```
TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING
TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING
TCP    0.0.0.0:5001    0.0.0.0:0    LISTENING
```

#### Opción 3: Probar WhatsApp
```cmd
# En una terminal separada:
node public/bot.mjs
```
Si no hay errores = ✅ Bot configurado correctamente

---

## 🛠️ Solución de Problemas

### ❌ "Error al enviar alerta" (Notificación Roja)

#### Problema: Bot de WhatsApp no configurado
**Solución:**
```cmd
node public/setup-bot.mjs
```
Sigue las instrucciones para autenticar.

#### Problema: Números incorrectos
**Solución:** Verifica el formato en los archivos del bot:
```javascript
const numero = '56950679940';  // Sin +, sin espacios
```

#### Problema: Sesión expirada
**Solución:** Vuelve a autenticar:
```cmd
node public/setup-bot.mjs
```

### ❌ No llegan mensajes por WhatsApp

#### Verificaciones:
1. **¿El número tiene WhatsApp?** Verifica que sea un número válido con WhatsApp
2. **¿Estás en el mismo WiFi?** WhatsApp Web requiere conexión a internet
3. **¿Sesión activa?** Si pasaron días, reautentica con el setup

#### Probar manualmente:
```cmd
node public/bot-with-gui.mjs
```
Si abre un navegador y muestra QR = ✅ Funcionando

### ❌ Notificaciones visuales no aparecen

#### Verificaciones:
1. **¿Dashboard cargado?** Ve a `http://localhost:3000`
2. **¿Servidor Next.js activo?** Busca puerto 3000 en `netstat`
3. **¿Errores en consola?** Presiona F12 → Console

#### Reiniciar dashboard:
```cmd
# Mata procesos anteriores:
taskkill /f /im node.exe

# Reinicia:
iniciar_rapido_compat.bat
```

---

## 📋 Resumen de Configuración

### ✅ Checklist de Instalación:

- [ ] **Python instalado** (versión 3.8+)
- [ ] **Node.js instalado** (versión 18+)
- [ ] **Sistema iniciado** (`iniciar_sistema_compat.bat`)
- [ ] **Dashboard accesible** (`http://localhost:3000`)
- [ ] **Bot de WhatsApp configurado** (`node public/setup-bot.mjs`)
- [ ] **Números verificados** en archivos del bot
- [ ] **Notificaciones visuales probadas**
- [ ] **Mensajes de WhatsApp probados**

### 🎯 Flujo Completo:
1. **Usuario ve riesgo** en cámara del dashboard
2. **Hace clic** en "Enviar Alerta de Emergencia"
3. **Notificación visual** aparece (azul → verde/roja)
4. **Mensaje WhatsApp** llega a teléfonos configurados
5. **Respuesta inmediata** del personal de seguridad

---

## 📞 Contacto y Soporte

### Si tienes problemas:
1. **Lee esta guía completa** detenidamente
2. **Verifica el checklist** anterior
3. **Revisa la consola** del dashboard (F12)
4. **Contacta al administrador** si persiste

### Archivos de configuración principales:
- `src/pages/dashboard.tsx` - Notificaciones visuales
- `public/bot.mjs` - Bot de WhatsApp
- `public/setup-bot.mjs` - Configuración inicial

---

## 🚀 ¡Sistema Listo!

Con las notificaciones configuradas, tu sistema de seguridad IA está **completamente operativo**. Recibirás alertas tanto visuales en el dashboard como mensajes de WhatsApp en tiempo real.

**¡Tu sistema de monitoreo inteligente está protegido! 🛡️🔥📱**</contents>
</xai:function_call">### Resumen de lo que incluye este README:

- **Explicación clara** de los dos tipos de notificaciones (visuales + WhatsApp)
- **Instrucciones paso a paso** para configurar todo
- **Guías de verificación** para saber si funciona
- **Solución de problemas** comunes
- **Ejemplos prácticos** de uso
- **Checklist** para verificar instalación completa

### Características principales del README:

1. **📖 Lenguaje sencillo** - Evita términos técnicos complicados
2. **📋 Instrucciones claras** - Cada paso está numerado y explicado
3. **🔍 Verificación incluida** - Cómo saber si todo funciona
4. **🛠️ Solución de problemas** - Los errores más comunes y sus soluciones
5. **✅ Checklist final** - Para confirmar que todo está configurado

### El README explica específicamente:

- Cómo funcionan las **notificaciones visuales** (las que implementamos)
- Cómo configurar el **bot de WhatsApp** para alertas reales
- Cómo **probar** que ambas notificaciones funcionan
- **Comandos exactos** para ejecutar y verificar
- **Solución** a problemas comunes

¿Te gustaría que agregue alguna sección específica o modifique algo del README? ¡El sistema de notificaciones ya está completamente documentado! 🎉
