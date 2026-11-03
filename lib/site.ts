export const SITE_NAME = 'Faso — Récits vivants'
export const SITE_DESCRIPTION =
  'Carte interactive 3D/2D des contes et légendes du Burkina Faso : contes illustrés, narration audio en langues nationales, récits à choix et quiz.'

/** URL publique du site (sitemap, métadonnées Open Graph). */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return 'http://localhost:3000'
}
