import type { Metadata } from 'next'
import Link from 'next/link'
import { LANGUAGES, PHRASES } from '@/lib/languages'

export const metadata: Metadata = {
  title: 'Les langues',
  description: 'Mooré, dioula, fulfulde : découvre les langues nationales du Burkina Faso et un mini-lexique pour saluer, remercier et compter.',
}

export default function LanguagesPage() {
  return (
    <section className="page">
      <header className="page__head">
        <p className="eyebrow"><span /> LANGUES NATIONALES</p>
        <h1>
          Dire merci en <em>trois langues</em>
        </h1>
        <p>
          Le Burkina Faso compte une soixantaine de langues. Ce projet en met trois à l’honneur pour la narration audio :
          le mooré, le dioula et le fulfulde.
        </p>
      </header>

      <p className="callout" role="note">
        <strong>À valider avec des locuteurs.</strong> Ce mini-lexique est pédagogique : l’orthographe et les tons varient
        selon les régions. Il doit être relu par des locuteurs natifs avant toute diffusion officielle.
      </p>

      <div className="lang-grid lang-grid--wide">
        {LANGUAGES.filter((l) => l.code !== 'fr').map((l) => (
          <article key={l.code} className="lang-card">
            <h2>{l.name}</h2>
            <p className="lang-card__area">{l.family} · {l.area}</p>
            <p>{l.note}</p>
            <table className="phrases">
              <caption className="sr-only">Mini-lexique en {l.name}</caption>
              <thead>
                <tr><th scope="col">Français</th><th scope="col">{l.name}</th></tr>
              </thead>
              <tbody>
                {PHRASES[l.code as 'mos' | 'dyu' | 'ful'].map((p) => (
                  <tr key={p.fr}><td>{p.fr}</td><td><strong>{p.local}</strong></td></tr>
                ))}
              </tbody>
            </table>
          </article>
        ))}
      </div>

      <p className="page__cta">
        Tu parles l’une de ces langues ? <Link href="/contribuer">Enregistre un conte →</Link>
      </p>
    </section>
  )
}
