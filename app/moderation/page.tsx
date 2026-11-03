import type { Metadata } from 'next'
import { Moderation } from '@/components/moderation'

export const metadata: Metadata = {
  title: 'Modération',
  robots: { index: false, follow: false },
}

export default function ModerationPage() {
  return (
    <section className="page">
      <header className="page__head">
        <p className="eyebrow"><span /> ÉQUIPE</p>
        <h1>
          Valider les <em>voix</em>
        </h1>
        <p>Écoute chaque enregistrement envoyé, vérifie l’accord de la personne, puis publie-le ou refuse-le.</p>
      </header>
      <Moderation />
    </section>
  )
}
