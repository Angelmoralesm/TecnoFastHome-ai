
import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Ruta al archivo bot.mjs en la carpeta public
    const botPath = "public/bot.mjs"

    console.log('🚀 Ejecutando bot de WhatsApp en modo headless...');
    console.log('📁 Ruta del bot:', botPath);

    // Ejecutar el bot como un proceso hijo
    const botProcess = spawn('node', [botPath], {
      stdio: 'pipe',
      detached: false,
      env: {
        ...process.env,
        // Asegurar que estamos en el directorio correcto
        PWD: process.cwd()
      }
    });

    let stdout = '';
    let stderr = '';

    // Capturar la salida estándar
    botProcess.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log('Bot stdout:', data.toString());
    });

    // Capturar errores
    botProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error('Bot stderr:', data.toString());
    });

    // Manejar el cierre del proceso
    botProcess.on('close', (code) => {
      console.log(`Proceso del bot terminado con código: ${code}`);
      if (code === 0) {
        console.log('Bot ejecutado exitosamente');
      } else {
        console.error(`Error en el bot con código: ${code}`);
      }
    });

    botProcess.on('error', (error) => {
      console.error('Error al iniciar el proceso del bot:', error);
    });

    // Responder inmediatamente para no bloquear la interfaz
    res.status(200).json({
      message: '🚨 Bot de WhatsApp iniciado correctamente en modo headless',
      details: 'El bot se ejecutará en segundo plano y enviará alertas de emergencia',
      processId: botProcess.pid,
      headless: true
    });

  } catch (error) {
    console.error('Error al ejecutar el bot:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
