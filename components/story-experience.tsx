'use client'

import { useState } from 'react'
import { Tabs } from '@base-ui/react/tabs'
import { BookOpenCheck, Check, Headphones, Lightbulb, Gamepad2, HelpCircle } from 'lucide-react'
import { AudioPlayer } from '@/components/audio-player'
import { AmbientToggle } from '@/components/ambient-toggle'
import { BranchingStory } from '@/components/branching-story'
import { Quiz } from '@/components/quiz'
import { markHeard, useProgress } from '@/lib/progress'
import { useNarration } from '@/lib/use-narration'
import { getTranslation } from '@/lib/translations'
import { LANG_BY_CODE } from '@/lib/languages'
import type { LangCode, Story } from '@/lib/types'

export function StoryExperience({ story }: { story: Story }) {
  const [lang, setLang] = useState<LangCode>(story.preferredLang)
  const narration = useNarration(story, lang, () => markHeard(story.slug))
  const heard = useProgress().heard.includes(story.slug)
  const translation = getTranslation(story.slug, lang)
  const chapters = translation?.chapters.length === story.chapters.length ? translation.chapters : story.chapters
  const shownTranslation = translation && chapters === translation.chapters ? translation : undefined

  const lengths = story.chapters.map((c) => c.length)
  const total = lengths.reduce((a, b) => a + b, 0)
  const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0) / total)

  return (
    <Tabs.Root defaultValue="ecouter" className="tabs">
      <Tabs.List className="tabs__list" aria-label="Façons de vivre le conte">
        <Tabs.Tab value="ecouter" className="tabs__tab"><Headphones aria-hidden="true" /> Écouter &amp; lire</Tabs.Tab>
        <Tabs.Tab value="jouer" className="tabs__tab"><Gamepad2 aria-hidden="true" /> Vivre l’histoire</Tabs.Tab>
        <Tabs.Tab value="quiz" className="tabs__tab"><HelpCircle aria-hidden="true" /> Quiz</Tabs.Tab>
        <Tabs.Tab value="savoir" className="tabs__tab"><Lightbulb aria-hidden="true" /> À savoir</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="ecouter" className="tabs__panel">
        <div className="reader-layout">
          <div className="reader-aside">
            <AudioPlayer narration={narration} lang={lang} onLangChange={setLang} />
            <div className="reader-tools">
              <AmbientToggle variant={story.variant} />
              <button
                type="button"
                className={`pill ${heard ? 'is-active' : ''}`}
                onClick={() => markHeard(story.slug)}
                aria-pressed={heard}
              >
                {heard ? <Check aria-hidden="true" /> : <BookOpenCheck aria-hidden="true" />}
                {heard ? 'Conte terminé' : 'Marquer comme lu'}
              </button>
            </div>
          </div>

          <article className="reader" aria-label={`Texte du conte ${story.title}`}>
            {shownTranslation && (
              <p className="reader__lang" lang={lang === 'mos' ? 'mos' : lang === 'dyu' ? 'dyu' : 'ff'}>
                Texte en {LANG_BY_CODE[lang].name} · à relire par un locuteur natif
              </p>
            )}
            {chapters.map((text, i) => {
              const active = narration.status !== 'idle' && narration.chapter === i
              return (
                <p
                  key={i}
                  className={`reader__p ${active ? 'is-active' : ''}`}
                  aria-current={active ? 'true' : undefined}
                  onClick={() => narration.seek(starts[i])}
                >
                  {text}
                </p>
              )
            })}
            <p className="reader__moral"><strong>Morale.</strong> {shownTranslation?.moral ?? story.moral}</p>
          </article>
        </div>
      </Tabs.Panel>

      <Tabs.Panel value="jouer" className="tabs__panel">
        <BranchingStory story={story} />
      </Tabs.Panel>

      <Tabs.Panel value="quiz" className="tabs__panel">
        <Quiz story={story} />
      </Tabs.Panel>

      <Tabs.Panel value="savoir" className="tabs__panel">
        <div className="know">
          <div>
            <p className="eyebrow"><span /> CONTEXTE CULTUREL</p>
            <p>{story.context}</p>
          </div>
          <dl className="know__facts">
            <div><dt>Région</dt><dd>{story.region}</dd></div>
            <div><dt>Ville repère</dt><dd>{story.city}</dd></div>
            <div><dt>Culture évoquée</dt><dd>{story.culture}</dd></div>
            <div><dt>Langue de tradition</dt><dd>{story.tradLanguage}</dd></div>
          </dl>
          <p className="know__note">
            Les textes de ce site sont des adaptations originales écrites pour le projet. Ils ne remplacent pas la parole
            des conteurs : la page « Contribuer » permet d’enregistrer de vraies versions.
          </p>
        </div>
      </Tabs.Panel>
    </Tabs.Root>
  )
}
