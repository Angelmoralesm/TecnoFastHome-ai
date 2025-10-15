/**
 * Bot de WhatsApp para envío de alertas de emergencia
 *
 * Funciona en modo HEADLESS (sin interfaz gráfica)
 *
 * Para la primera autenticación:
 * 1. Ejecuta el bot con headless: false para ver el código QR
 * 2. Escanea el código QR con tu teléfono
 * 3. Una vez autenticado, vuelve a headless: true para ejecuciones posteriores
 *
 * La autenticación se mantiene usando LocalAuth entre sesiones.
 */

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// En modo headless, si ya estás autenticado previamente con LocalAuth,
// no se mostrará ningún código QR. La autenticación se mantiene entre sesiones.
client.on('qr', (qr) => {
    console.log('📱 Código QR generado (no se muestra en modo headless):');
    console.log('Si necesitas autenticarte por primera vez, ejecuta el bot con headless: false');
});

client.on('ready', () => {
    console.log('✅ WhatsApp conectado en modo headless!');
    enviarMensaje();
});

client.on('auth_failure', (msg) => {
    console.error('❌ Error de autenticación:', msg);
    console.log('💡 Si es la primera vez que ejecutas el bot, necesitas autenticarte manualmente.');
    console.log('💡 Ejecuta el bot con headless: false para ver el código QR y autenticarte.');
});

client.on('disconnected', (reason) => {
    console.log('🔌 WhatsApp desconectado:', reason);
});

async function enviarMensaje() {
    const numero = '56950679940';
    const numero2 = '56981574316';
    let mensaje = '🚨 EMERGENCIA: Ha ocurrido una emergencia en el sistema de vigilancia. Revisa las cámaras inmediatamente.';

    try {
        await client.sendMessage(`${numero}@c.us`, mensaje);
        console.log('✅ Mensaje de emergencia enviado correctamente a el numero ' + numero);
        await client.sendMessage(`${numero2}@c.us`, mensaje);
        console.log('✅ Mensaje de emergencia enviado correctamente a el numero ' + numero2);
        console.log('🎯 Bot ejecutado exitosamente en modo headless');
    } catch (error) {
        console.error('❌ Error al enviar mensaje:', error);
        console.log('💡 Posibles causas:');
        console.log('   - El número no tiene WhatsApp');
        console.log('   - Problemas de conexión');
        console.log('   - Sesión de WhatsApp expirada');
    }
}

client.initialize();