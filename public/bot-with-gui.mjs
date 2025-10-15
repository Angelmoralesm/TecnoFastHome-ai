/**
 * Bot de WhatsApp para envío de alertas de emergencia
 *
 * Versión con interfaz gráfica para primera autenticación
 *
 * Usa esta versión solo para la primera autenticación:
 * 1. Ejecuta este archivo para ver el código QR
 * 2. Escanea el código QR con tu teléfono
 * 3. Una vez autenticado, usa bot.mjs (headless) para ejecuciones posteriores
 */

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

console.log('🚀 Iniciando bot con interfaz gráfica para primera autenticación...');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('📱 Escanea este código QR con tu teléfono:');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('✅ WhatsApp conectado exitosamente!');
    console.log('🎉 Primera autenticación completada.');
    console.log('💡 Ahora puedes usar bot.mjs (modo headless) para ejecuciones posteriores.');
    enviarMensaje();
});

client.on('auth_failure', (msg) => {
    console.error('❌ Error de autenticación:', msg);
});

client.on('disconnected', (reason) => {
    console.log('🔌 WhatsApp desconectado:', reason);
});

async function enviarMensaje() {
    const numero = '56950679940';
    const numero2 = '56981574316';
    let mensaje = '✅ Primera autenticación completada exitosamente. El bot está listo para usar en modo headless.';

    try {
        await client.sendMessage(`${numero}@c.us`, mensaje);
        console.log('✅ Mensaje de confirmación enviado correctamente a el numero ' + numero);
        await client.sendMessage(`${numero2}@c.us`, mensaje);
        console.log('✅ Mensaje de confirmación enviado correctamente a el numero ' + numero2);
        console.log('🎯 Bot configurado correctamente. Cierra esta ventana y usa bot.mjs en el futuro.');
    } catch (error) {
        console.error('❌ Error al enviar mensaje:', error);
    }
}

client.initialize();
