import type { Metadata } from 'next'
import { STORIES } from '@/lib/stories'

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Objectifs, choix techniques, accessibilité, éthique des contenus et crédits du projet Faso — Récits vivants.',
}

const TECH = [
  ['Next.js 16 (App Router)', 'Rendu statique, métadonnées, sitemap, pages dynamiques par conte.'],
  ['React 19 + TypeScript strict', 'Composants typés, aucune erreur de build ignorée.'],
  ['MapLibre GL', 'Carte vectorielle WebGL : relief 3D, vue 2D, satellite, marqueurs accessibles.'],
  ['Web Audio / MediaRecorder / Speech', 'Ambiance synthétisée, enregistrement navigateur, voix de repli.'],
  ['SVG + CSS animés', 'Illustrations légères et sans image : aucune dépendance, respect du mode « réduire les animations ».'],
  ['Base UI', 'Onglets accessibles au clavier et aux lecteurs d’écran.'],
]

export default function AboutPage() {
  return (
    <section className="page page--prose">
      <header className="page__head">
        <p className="eyebrow"><span /> À PROPOS</p>
        <h1>
          Préserver pour <em>transmettre</em>
        </h1>
        <p>
          Faso — Récits vivants numérise le patrimoine oral burkinabè en réunissant cartographie, narration, illustration et
          audio dans une expérience accessible sur ordinateur comme sur mobile.
        </p>
      </header>

      <h2>Ce que fait la plateforme</h2>
      <ul>
        <li>Une carte interactive en relief 3D (et en 2D) où chaque conte est rattaché à une région.</li>
        <li>{STORIES.length} contes illustrés, avec texte synchronisé à la narration audio.</li>
        <li>Des récits à embranchements et des quiz pour s’approprier les histoires.</li>
        <li>Un atelier d’enregistrement pour ajouter des voix en mooré, dioula et fulfulde.</li>
      </ul>

      <h2>Choix techniques</h2>
      <dl className="tech">
        {TECH.map(([name, text]) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>

      <h2>Éthique et sources des contenus</h2>
      <p>
        Les textes sont des <strong>adaptations originales</strong> écrites pour ce projet, inspirées de thèmes classiques de la
        tradition orale ouest-africaine. Ils ne prétendent pas reproduire la version d’un conteur précis. La collecte
        auprès de conteurs, avec leur consentement, est la suite naturelle du projet : c’est le rôle de l’atelier
        d’enregistrement.
      </p>

      <h2>Accessibilité</h2>
      <ul>
        <li>Navigation complète au clavier, lien d’évitement, focus visible.</li>
        <li>Marqueurs de carte natifs (boutons) avec libellés explicites.</li>
        <li>Animations désactivées si l’appareil demande de les réduire.</li>
        <li>Texte intégral de chaque conte, pour ne pas dépendre de l’audio.</li>
      </ul>

      <h2>Vie privée</h2>
      <p>
        La progression (contes terminés, quiz, fins) est stockée uniquement dans ton navigateur. Un enregistrement ne
        quitte ton appareil que si tu cliques sur « Publier sur le site », avec l’accord de la personne enregistrée ; il
        est alors relu par l’équipe avant d’être mis en ligne.
      </p>

      <h2>Contexte académique</h2>
      <p>Projet universitaire de plateforme web multimédia — Groupe 5. Livrable : rapport et lien du site.</p>

      <h2>Crédits</h2>
      <p>
        Fonds de carte © OpenStreetMap contributors et © CARTO, imagerie satellite © Esri, relief Mapzen / AWS Terrain
        Tiles, limites administratives geoBoundaries (CC BY 4.0), moteur cartographique MapLibre GL.
      </p>
    </section>
  )
}
