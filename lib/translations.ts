import type { LangCode } from './types'

export interface Translation {
  /** Un élément par chapitre : même nombre que dans `story.chapters` du conte. */
  chapters: string[]
  title?: string
  moral?: string
}

/**
 * Textes des contes dans les langues nationales.
 *
 * Quand une traduction existe, la page du conte l'affiche à la place du français
 * dès que la langue correspondante est choisie dans le lecteur.
 * Ces textes doivent être écrits ou relus par un locuteur natif.
 *
 * Exemple (à décommenter et compléter) :
 *
 * 'la-hyene-et-le-lievre': {
 *   mos: {
 *     chapters: ['Premier chapitre en mooré…', 'Deuxième chapitre…', 'Troisième…', 'Quatrième…'],
 *     moral: 'La morale en mooré…',
 *   },
 * },
 */
export const TRANSLATIONS: Record<string, Partial<Record<Exclude<LangCode, 'fr'>, Translation>>> = {}

export function getTranslation(slug: string, lang: LangCode): Translation | undefined {
  if (lang === 'fr') return undefined
  return TRANSLATIONS[slug]?.[lang]
}
