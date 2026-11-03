import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>✦ FASO — RÉCITS VIVANTS</strong>
        <p>Plateforme web multimédia pour préserver et transmettre le patrimoine oral du Burkina Faso.</p>
      </div>
      <nav aria-label="Pied de page">
        <Link href="/contes">Les contes</Link>
        <Link href="/langues">Les langues</Link>
        <Link href="/contribuer">Contribuer</Link>
        <Link href="/a-propos">À propos</Link>
      </nav>
      <p className="site-footer__legal">Projet universitaire · Groupe 5 · Cartes © OpenStreetMap, CARTO, Esri</p>
    </footer>
  )
}
