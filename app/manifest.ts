import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Faso — Récits vivants',
    short_name: 'Faso',
    description: 'Carte interactive des contes et légendes du Burkina Faso.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4efe6',
    theme_color: '#c95432',
    lang: 'fr',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
