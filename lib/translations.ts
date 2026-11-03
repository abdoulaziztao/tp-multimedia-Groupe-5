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
export const TRANSLATIONS: Record<string, Partial<Record<Exclude<LangCode, 'fr'>, Translation>>> = {
  'le-genie-de-la-mare-sacree': {
    mos: {
      chapters: [
        `Mog-miuugã noorẽ, kʋdʋmbã ra maana kaool a ye: zĩmã ra yaa sẽn pa segd n sɩɩse, la b leb n kõo koom sẽn pa na n sa n be tẽngã pʋgẽ. Yibeoog fãa, kambã ra wat n lobda kãenkãm bʋmb sẽn yaa bilf kõ zĩm-kãsemsã, ne waoogre.`,
        `Yʋʋm a ye, koodã ra yaa sẽn pa waoog ye. Pʋg-sɩɩd a ye sẽn yaa sekre, Sékou, kom sẽn da maand-a yĩngr sẽn pa tar sũ-mar ye, a wẽename tɩ zĩm-bilf sẽn pa na n paam ned baa a ye ye. Yʋng ning sẽn dengã, a yãa vẽenem sẽn yaa sõma zĩ-kãngã zugu, la a yãka t'a pa na n togs ned baa a ye ye.`,
        `Yibeoog pĩnd sẽn vẽegẽ, a loba a yĩngrã. Koomã zĩnda ne bãane, bãan sẽn yaa wʋsgo. Rẽ poorẽ, koɛɛg sẽn yaa kãsenga, sẽn yaa wa sẽn yit bõkã pʋgẽ, sẽn gomda ne bãane: « Ned ning sẽn lebsd n deegd bũmb ning a sẽn pʋlem t'a na n gu, a bʋʋmda bũmb ning a sẽn da rat n tallã.»`,
        `Sékou basa yĩngrã t'a lʋɩɩ la a zoe n tɩ togs kʋdʋmbã. B fãa lagma taaba, b lebs n maana kaoolã, la mogã pida ne koom sa-kãseng sẽn ni-a. Hal rũndã-rũndã, b yetame tɩ mogã sɩɩgã gũuda neb nins sẽn sɩd ne b gomdã.`,
      ],
    },
  },
}

export function getTranslation(slug: string, lang: LangCode): Translation | undefined {
  if (lang === 'fr') return undefined
  return TRANSLATIONS[slug]?.[lang]
}
