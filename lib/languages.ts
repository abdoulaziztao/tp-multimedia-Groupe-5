import type { LangCode } from './types'

export interface Language {
  code: LangCode
  name: string
  family: string
  area: string
  note: string
}

export const LANGUAGES: Language[] = [
  {
    code: 'fr',
    name: 'Français',
    family: 'Langue officielle',
    area: 'Tout le pays',
    note: 'Texte de référence et voix de synthèse. Sert de passerelle vers les langues nationales.',
  },
  {
    code: 'mos',
    name: 'Mooré',
    family: 'Gur (Mossi)',
    area: 'Centre, Plateau Central, Nord, Centre-Nord',
    note: 'Langue la plus parlée du Burkina Faso.',
  },
  {
    code: 'dyu',
    name: 'Dioula (Jula)',
    family: 'Mandé',
    area: 'Hauts-Bassins, Cascades, Sud-Ouest',
    note: 'Langue véhiculaire du commerce dans l\'ouest du pays.',
  },
  {
    code: 'ful',
    name: 'Fulfulde',
    family: 'Atlantique (Peul)',
    area: 'Sahel, Nord, Est',
    note: 'Langue des éleveurs peuls, très présente dans le Sahel.',
  },
]

export const LANG_BY_CODE = Object.fromEntries(LANGUAGES.map((l) => [l.code, l])) as Record<LangCode, Language>

export interface Phrase {
  fr: string
  local: string
}

/**
 * Mini-lexique pédagogique.
 * ⚠ À faire valider par des locuteurs natifs avant publication officielle
 * (orthographe et tons peuvent varier selon les régions).
 */
export const PHRASES: Record<Exclude<LangCode, 'fr'>, Phrase[]> = {
  mos: [
    { fr: 'Bonjour (le matin)', local: 'Ne y yibeoogo' },
    { fr: 'Merci', local: 'Barka' },
    { fr: 'Un', local: 'Yembre' },
    { fr: 'Deux', local: 'Yiibu' },
    { fr: 'Trois', local: 'Tãabo' },
    { fr: 'Quatre', local: 'Naase' },
    { fr: 'Cinq', local: 'Nu' },
  ],
  dyu: [
    { fr: 'Bonjour (le matin)', local: 'I ni sogoma' },
    { fr: 'Bonsoir', local: 'I ni wula' },
    { fr: 'Merci', local: 'Barika' },
    { fr: 'Un', local: 'Kelen' },
    { fr: 'Deux', local: 'Fila' },
    { fr: 'Trois', local: 'Saba' },
    { fr: 'Quatre', local: 'Naani' },
    { fr: 'Cinq', local: 'Duuru' },
  ],
  ful: [
    { fr: 'Comment vas-tu ?', local: 'No mbaddaa ?' },
    { fr: 'Je vais bien (la paix seulement)', local: 'Jam tan' },
    { fr: 'Merci', local: 'Jaaraama' },
    { fr: 'Un', local: "Go'o" },
    { fr: 'Deux', local: 'Ɗiɗi' },
    { fr: 'Trois', local: 'Tati' },
    { fr: 'Quatre', local: 'Nay' },
    { fr: 'Cinq', local: 'Jowi' },
  ],
}
