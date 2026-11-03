/** Codes des langues proposées pour la narration audio. */
export type LangCode = 'fr' | 'mos' | 'dyu' | 'ful'

/** Familles de décors pour les illustrations animées. */
export type SceneVariant = 'savane' | 'mare' | 'dune' | 'cascade' | 'village' | 'foret'

export type EndingTone = 'sage' | 'equilibre' | 'risque'

export interface BranchChoice {
  label: string
  /** Identifiant du nœud suivant. */
  to: string
}

export interface BranchNode {
  id: string
  text: string
  choices?: BranchChoice[]
  ending?: { title: string; lesson: string; tone: EndingTone }
}

export interface QuizQuestion {
  question: string
  options: string[]
  /** Index de la bonne réponse dans `options`. */
  answer: number
  explanation: string
}

export interface Story {
  slug: string
  title: string
  /** Nom de la région tel qu'écrit dans `public/data/regions.geojson`. */
  region: string
  city: string
  coords: { lat: number; lng: number }
  /** Couleur d'identité de la région (pins, tags). */
  color: string
  tag: string
  culture: string
  /** Langue dans laquelle ce type de récit est traditionnellement dit. */
  tradLanguage: string
  /** Langue audio proposée par défaut. */
  preferredLang: LangCode
  variant: SceneVariant
  night: boolean
  rain?: boolean
  summary: string
  /** Texte du conte, découpé en chapitres (synchronisés avec l'audio). */
  chapters: string[]
  moral: string
  /** Contexte culturel et précision sur l'origine du texte. */
  context: string
  branching: { start: string; nodes: BranchNode[] }
  quiz: QuizQuestion[]
}

export interface Progress {
  heard: string[]
  quiz: Record<string, number>
  endings: Record<string, string[]>
}
