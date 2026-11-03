'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { StoryCard } from '@/components/story-card'
import type { Story } from '@/lib/types'

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function StoryCatalog({ stories }: { stories: Story[] }) {
  const [query, setQuery] = useState('')
  const [lang, setLang] = useState('tous')

  const languages = useMemo(() => ['tous', ...Array.from(new Set(stories.map((s) => s.tradLanguage)))], [stories])

  const results = useMemo(() => {
    const q = normalize(query.trim())
    return stories.filter((s) => {
      if (lang !== 'tous' && s.tradLanguage !== lang) return false
      if (!q) return true
      return normalize([s.title, s.region, s.city, s.culture, s.summary, s.tag].join(' ')).includes(q)
    })
  }, [stories, query, lang])

  return (
    <div>
      <div className="filters">
        <label className="search">
          <Search aria-hidden="true" />
          <span className="sr-only">Rechercher un conte, une région, une culture</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un conte, une région, une culture…" />
        </label>
        <div className="chips" role="group" aria-label="Filtrer par langue de tradition">
          {languages.map((l) => (
            <button key={l} type="button" className={`chip ${lang === l ? 'is-selected' : ''}`} aria-pressed={lang === l} onClick={() => setLang(l)}>
              {l === 'tous' ? 'Toutes les langues' : l}
            </button>
          ))}
        </div>
      </div>

      <p className="results" role="status">{results.length} conte{results.length > 1 ? 's' : ''}</p>
      {results.length ? (
        <div className="grid">
          {results.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </div>
      ) : (
        <p className="empty">Aucun conte ne correspond. Essaie un autre mot-clé.</p>
      )}
    </div>
  )
}
