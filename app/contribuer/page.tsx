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
          Enregistre un conteur dans sa langue et publie-le : le site remplace alors la voix de synthèse par cet
          enregistrement. Rien n’est envoyé avant que tu cliques sur « Publier », et l’accord de la personne est obligatoire.
        </p>
      </header>
      <ol className="how">
        <li>Choisis le conte et la langue, puis demande l’accord de la personne enregistrée.</li>
        <li>Enregistre dans un endroit calme, micro à 20 cm de la bouche.</li>
        <li>Clique sur « Publier sur le site » : ta voix apparaît dans le lecteur du conte (après validation de l’équipe). Tu peux aussi télécharger le fichier.</li>
      </ol>
      <Recorder />
    </section>
  )
}
