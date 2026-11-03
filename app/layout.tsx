import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { RevealOnScroll } from '@/components/reveal-on-scroll'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from '@/lib/site'
import './globals.css'

const manrope = localFont({
  src: './fonts/manrope-latin-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-ui',
  display: 'swap',
})
const mono = localFont({
  src: [
    { path: './fonts/dm-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/dm-mono-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-mono',
  display: 'swap',
})
const serif = localFont({
  src: [
    { path: './fonts/cormorant-garamond-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/cormorant-garamond-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/cormorant-garamond-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: './fonts/cormorant-garamond-latin-500-italic.woff2', weight: '500', style: 'italic' },
    { path: './fonts/cormorant-garamond-latin-600-italic.woff2', weight: '600', style: 'italic' },
  ],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ['Burkina Faso', 'contes', 'légendes', 'patrimoine oral', 'Mooré', 'Dioula', 'Fulfulde', 'carte interactive', 'multimédia'],
  openGraph: { type: 'website', locale: 'fr_FR', siteName: SITE_NAME, title: SITE_NAME, description: SITE_DESCRIPTION },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: SITE_DESCRIPTION },
  icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }], apple: '/apple-icon.png' },
}

export const viewport: Viewport = {
  themeColor: '#f4efe6',
  colorScheme: 'light',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${manrope.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <a className="skip-link" href="#contenu">Aller au contenu</a>
        <div className="top-pattern" aria-hidden="true" />
        <SiteHeader />
        <main id="contenu">{children}</main>
        <SiteFooter />
        <RevealOnScroll />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
