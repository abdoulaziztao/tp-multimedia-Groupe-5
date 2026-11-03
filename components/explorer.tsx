'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowRight, BookOpen, Box, Compass, Layers, Map as MapIcon, Pause, Play } from 'lucide-react'
import { AudioPlayer } from '@/components/audio-player'
import { useNarration } from '@/lib/use-narration'
import { markHeard } from '@/lib/progress'
import { readingMinutes } from '@/lib/stories'
import type { Basemap, MapView } from '@/components/story-map'
import type { LangCode, Story } from '@/lib/types'

const StoryMap = dynamic(() => import('@/components/story-map'), {
  ssr: false,
  loading: () => (
    <div className="map-loading" role="status">
      <Compass aria-hidden="true" /> Chargement de la carte…
    </div>
  ),
})

function StoryPanel({ story }: { story: Story }) {
  const [lang, setLang] = useState<LangCode>(story.preferredLang)
  const narration = useNarration(story, lang, () => markHeard(story.slug))

  return (
    <aside className="panel" style={{ ['--c' as string]: story.color }} aria-live="polite">
      <div className="panel__top">
        <span className="tag">{story.tag}</span>
        <span className="panel__city"><Compass aria-hidden="true" /> {story.city}</span>
      </div>
      <h3>{story.title}</h3>
      <p className="panel__summary">{story.summary}</p>
      <AudioPlayer narration={narration} lang={lang} onLangChange={setLang} compact />
      <Link className="btn btn--light" href={`/contes/${story.slug}`}>
        Lire le conte · {readingMinutes(story)} min <ArrowRight aria-hidden="true" />
      </Link>
      <p className="panel__foot">
        <BookOpen aria-hidden="true" /> Adaptation originale inspirée de la tradition orale ({story.tradLanguage})
      </p>
    </aside>
  )
}

export function Explorer({ stories }: { stories: Story[] }) {
  const [slug, setSlug] = useState(stories[0].slug)
  const [emptyRegion, setEmptyRegion] = useState<string | null>(null)
  const [view, setView] = useState<MapView>('3d')
  const [basemap, setBasemap] = useState<Basemap>('plan')
  const [tour, setTour] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  const story = useMemo(() => stories.find((s) => s.slug === slug) ?? stories[0], [stories, slug])
  const highlight = emptyRegion ?? story.region

  function choose(next: string) {
    setTour(false)
    setEmptyRegion(null)
    setSlug(next)
  }

  function chooseRegion(region: string) {
    const match = stories.find((s) => s.region === region)
    if (match) choose(match.slug)
    else {
      setTour(false)
      setEmptyRegion(region)
    }
  }

  // Visite guidée : on enchaîne les contes toutes les 9 secondes.
  useEffect(() => {
    if (!tour) return
    const id = window.setInterval(() => {
      setSlug((current) => {
        const i = stories.findIndex((s) => s.slug === current)
        return stories[(i + 1) % stories.length].slug
      })
    }, 9000)
    return () => window.clearInterval(id)
  }, [tour, stories])

  return (
    <div className="explorer">
      <div className="explorer__grid">
        <div className="mapcard">
          {mapError ? (
            <div className="map-loading" role="alert">{mapError}</div>
          ) : (
            <StoryMap
              stories={stories}
              selectedSlug={emptyRegion ? null : slug}
              highlightRegion={highlight}
              view={view}
              basemap={basemap}
              onSelectStory={choose}
              onSelectRegion={chooseRegion}
              onUnavailable={setMapError}
            />
          )}

          <div className="mapcard__controls" role="group" aria-label="Options de la carte">
            <button type="button" className="ctl" aria-pressed={view === '3d'} onClick={() => setView(view === '3d' ? '2d' : '3d')}>
              <Box aria-hidden="true" /> {view === '3d' ? 'Relief 3D' : 'Vue 2D'}
            </button>
            <button type="button" className="ctl" aria-pressed={basemap === 'satellite'} onClick={() => setBasemap(basemap === 'plan' ? 'satellite' : 'plan')}>
              {basemap === 'plan' ? <MapIcon aria-hidden="true" /> : <Layers aria-hidden="true" />} {basemap === 'plan' ? 'Plan' : 'Satellite'}
            </button>
            <button type="button" className="ctl ctl--accent" aria-pressed={tour} onClick={() => setTour(!tour)}>
              {tour ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />} {tour ? 'Arrêter la visite' : 'Visite guidée'}
            </button>
          </div>

          <p className="mapcard__label">
            <span className="live-dot" /> {stories.length} contes · 13 régions <small>Ctrl + molette pour zoomer</small>
          </p>
        </div>

        {emptyRegion ? (
          <aside className="panel panel--empty" aria-live="polite">
            <span className="tag tag--muted">À COLLECTER</span>
            <h3>{emptyRegion}</h3>
            <p className="panel__summary">
              Aucun conte n’est encore publié pour cette région. Si tu connais un conteur ou une légende locale, tu peux
              l’enregistrer directement depuis le site.
            </p>
            <Link className="btn btn--light" href="/contribuer">
              Contribuer un récit <ArrowRight aria-hidden="true" />
            </Link>
          </aside>
        ) : (
          <StoryPanel key={story.slug} story={story} />
        )}
      </div>

      <div className="chips" role="group" aria-label="Choisir un conte par région">
        {stories.map((s) => (
          <button
            key={s.slug}
            type="button"
            className={`chip ${!emptyRegion && s.slug === slug ? 'is-selected' : ''}`}
            aria-pressed={!emptyRegion && s.slug === slug}
            onClick={() => choose(s.slug)}
          >
            <span style={{ backgroundColor: s.color }} />
            {s.region}
            <small>{s.city}</small>
          </button>
        ))}
      </div>
    </div>
  )
}
