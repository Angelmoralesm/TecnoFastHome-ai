# 🚀 Guía de Inicio del Sistema de Monitoreo con IA

## 📋 Scripts Disponibles

### 🔧 `iniciar_sistema.bat` - Configuración Completa (Primera vez)
**¿Cuándo usarlo?**
- Primera vez que ejecutas el sistema
- Cuando instalas el sistema en una nueva computadora
- Cuando hay problemas con las dependencias

**¿Qué hace?**
1. ✅ Verifica que Python esté instalado
2. ✅ Verifica que Node.js esté instalado
3. ✅ Instala dependencias de Python (Flask, OpenCV, ONNX Runtime)
4. ✅ Instala dependencias de Node.js (npm install)
5. ✅ Verifica que todos los archivos necesarios existan
6. ✅ Inicia servidores de IA (fuego y EPP)
7. ✅ Inicia dashboard de Next.js
8. ✅ Abre navegador automáticamente

**Tiempo aproximado:** 5-10 minutos (depende de la conexión a internet)

---

### ⚡ `iniciar_rapido.bat` - Inicio Rápido (Después de la primera vez)
**¿Cuándo usarlo?**
- Después de la primera instalación exitosa
- Para uso diario del sistema
- Cuando ya están instaladas todas las dependencias

**¿Qué hace?**
1. ✅ Verifica archivos básicos
2. ✅ Inicia servidores de IA
3. ✅ Inicia dashboard
4. ✅ Abre navegador

**Tiempo aproximado:** 30-45 segundos

---

## 🎯 Recomendaciones de Uso

### Primera Vez - Sigue estos pasos:
1. **Ejecuta:** `iniciar_sistema.bat`
2. **Espera** a que termine la instalación completa
3. **Guarda** el script `iniciar_rapido.bat` para usos futuros

### Usos Posteriores:
1. **Ejecuta:** `iniciar_rapido.bat`
2. **Listo** en menos de 1 minuto

---

## 🔍 Verificación de Instalación

### ¿El sistema está correctamente instalado?
Ejecuta este comando en una terminal:
```cmd
python --version && node --version && pip list | findstr flask
```

Si ves versiones de Python, Node.js y Flask listadas, ¡está todo bien!

---

## 🛑 Solución de Problemas

### "Python no se reconoce"
```cmd
# Verifica instalación
python --version

# Si no funciona, reinstala Python con "Add to PATH"
# https://www.python.org/downloads/
```

### "Node.js no se reconoce"
```cmd
# Verifica instalación
node --version

# Si no funciona, instala Node.js
# https://nodejs.org/
```

### "Error al instalar dependencias"
```cmd
# Ejecuta como administrador
# Verifica conexión a internet
# O instala manualmente:
pip install flask opencv-python onnxruntime
npm install
```

### "Los servidores no inician"
- Verifica que no haya otros procesos usando los puertos 5000/5001
- Cierra aplicaciones que usen la cámara (Zoom, Teams, etc.)
- Reinicia la computadora

---

## 📞 Contacto

Si tienes problemas persistentes:
1. Lee esta guía completa
2. Verifica los requisitos del sistema
3. Intenta con `iniciar_sistema.bat` (reinicio completo)
4. Contacta al administrador técnico si persiste

---

¡Tu sistema de seguridad inteligente está listo! 🛡️🔥
