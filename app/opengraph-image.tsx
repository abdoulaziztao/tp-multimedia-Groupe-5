import { ImageResponse } from 'next/og'

export const alt = 'Faso — Récits vivants : la carte des contes et légendes du Burkina Faso'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(135deg, #26231f 0%, #5a2a50 60%, #c95432 100%)',
          color: '#f4efe6',
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: 10, color: '#d9a13b', display: 'flex' }}>FASO · BURKINA</div>
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.02, marginTop: 24, display: 'flex' }}>Récits vivants</div>
        <div style={{ fontSize: 38, marginTop: 28, maxWidth: 900, opacity: 0.9, display: 'flex' }}>
          La carte interactive des contes et légendes du Burkina Faso
        </div>
      </div>
    ),
    size,
  )
}
