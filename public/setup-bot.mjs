/**
 * Script de configuración inicial para el bot de WhatsApp
 *
 * Ejecuta este script una sola vez para autenticar el bot por primera vez.
 * Después de la autenticación exitosa, usa bot.mjs para ejecuciones en modo headless.
 */

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

console.log('🔧 Configuración inicial del bot de WhatsApp');
console.log('============================================');
console.log('');
console.log('Este proceso te ayudará a autenticar el bot por primera vez.');
console.log('Sigue estos pasos:');
console.log('');
console.log('1. Se mostrará un código QR en la consola');
console.log('2. Abre WhatsApp en tu teléfono');
console.log('3. Ve a Configuración > Dispositivos vinculados');
console.log('4. Escanea el código QR mostrado');
console.log('5. Espera a que se complete la autenticación');
console.log('');
console.log('Una vez autenticado, podrás usar bot.mjs en modo headless.');
console.log('');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('📱 ESCANEA ESTE CÓDIGO QR CON TU TELÉFONO:');
    console.log('');
    qrcode.generate(qr, {small: true});
    console.log('');
    console.log('⏰ Esperando escaneo del código QR...');
});

client.on('ready', () => {
    console.log('');
    console.log('✅ ¡Autenticación completada exitosamente!');
    console.log('');
    console.log('🎉 El bot está listo para usar en modo headless.');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('   - Cierra esta ventana');
    console.log('   - Usa el botón "Enviar Alerta de Emergencia" en el dashboard');
    console.log('   - El bot funcionará en segundo plano sin abrir navegador');
    console.log('');
    console.log('💡 La autenticación se guarda automáticamente y no necesitas repetir este proceso.');

    // Enviar mensaje de prueba
    enviarMensajePrueba();
});

client.on('auth_failure', (msg) => {
    console.error('');
    console.error('❌ Error de autenticación:', msg);
    console.log('');
    console.log('💡 Posibles soluciones:');
    console.log('   - Asegúrate de que WhatsApp esté abierto en tu teléfono');
    console.log('   - Verifica que tienes conexión a internet');
    console.log('   - Intenta nuevamente en unos minutos');
});

client.on('disconnected', (reason) => {
    console.log('');
    console.log('🔌 Sesión cerrada:', reason);
});

async function enviarMensajePrueba() {
    try {
        const numero = '56950679940'; // Tu número para pruebas
        const mensaje = '✅ ¡Bot configurado correctamente! Ahora puedes usar el modo headless desde el dashboard.';

        await client.sendMessage(`${numero}@c.us`, mensaje);
        console.log('');
        console.log('📤 Mensaje de confirmación enviado exitosamente');
        console.log('');
        console.log('🎯 ¡Configuración completada! Puedes cerrar esta ventana ahora.');
    } catch (error) {
        console.error('');
        console.error('❌ Error al enviar mensaje de prueba:', error);
        console.log('');
        console.log('💡 El bot está autenticado pero no pudo enviar el mensaje de prueba.');
        console.log('   Esto podría deberse a restricciones de WhatsApp.');
        console.log('   El bot funcionará correctamente para alertas de emergencia.');
    }
}

console.log('🚀 Iniciando proceso de autenticación...');
client.initialize();
