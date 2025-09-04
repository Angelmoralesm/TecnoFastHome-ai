'use client'; // Usa esta directiva para habilitar el uso de Hooks de React y el renderizado del lado del cliente.

import React from 'react';

interface VideoFeedProps {
  port?: number;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ port = 5000 }) => {
  const serverUrl = `http://localhost:${port}/video_feed`;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <div style={{
        border: '2px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <img
          src={serverUrl}
          alt="Video Feed"
          style={{
            width: '100%',
            maxWidth: '800px',
            height: 'auto',
            display: 'block'
          }}
        />
      </div>
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
        Asegúrate de que el servidor de Python esté corriendo para ver el video.
      </p>
    </div>
  );
};

export default VideoFeed;