import type { Metadata } from 'next'
import { Recorder } from '@/components/recorder'

export const metadata: Metadata = {
  title: 'Contribuer',
  description: 'Enregistre un conte dans ta langue directement depuis le navigateur et enrichis la carte des récits.',
}

export default function ContributePage() {
  return (
    <section className="page">
      <header className="page__head">
        <p className="eyebrow"><span /> ATELIER D’ENREGISTREMENT</p>
        <h1>
          Donne une voix <em>au conte</em>
        </h1>
        <p>
          Enregistre un conteur dans sa langue, télécharge le fichier et ajoute-le au dépôt : le site remplace alors la voix
          de synthèse par cet enregistrement. Rien n’est envoyé sur un serveur : tout reste sur ton appareil.
        </p>
      </header>
      <ol className="how">
        <li>Choisis le conte et la langue, puis demande l’accord de la personne enregistrée.</li>
        <li>Enregistre dans un endroit calme, micro à 20 cm de la bouche.</li>
        <li>Télécharge l’audio et la fiche, puis place-les dans <code>public/audio/</code>.</li>
      </ol>
      <Recorder />
    </section>
  )
}
