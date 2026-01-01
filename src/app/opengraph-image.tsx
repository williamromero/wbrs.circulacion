import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'WBRS Circulación 2026 - Consulta de Impuestos';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '20px solid white',
          color: 'white',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '4px solid #ccff00',
            padding: '40px',
            background: '#1a1a1a',
            boxShadow: '20px 20px 0px 0px #ccff00',
          }}
        >
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 900,
              margin: 0,
              lineHeight: 1,
              letterSpacing: '-2px',
              textTransform: 'uppercase',
            }}
          >
            WBRS
          </h1>
          <h2
            style={{
              fontSize: '40px',
              fontWeight: 700,
              margin: '10px 0 0 0',
              color: '#ccff00', // Lime Green
              textTransform: 'uppercase',
            }}
          >
            Circulación 2026
          </h2>
        </div>
        
        <div
            style={{
                marginTop: '60px',
                display: 'flex',
                gap: '20px'
            }}
        >
             <div style={{ background: '#ff00ff', color: 'black', padding: '10px 20px', fontSize: '24px', fontWeight: 'bold' }}>CONSULTA OFICIAL</div>
             <div style={{ background: 'white', color: 'black', padding: '10px 20px', fontSize: '24px', fontWeight: 'bold' }}>WEBRES STUDIO</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
