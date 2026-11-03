'use client'

import Link from 'next/link'
import { Pause, Play, RotateCcw, Volume2 } from 'lucide-react'
import { LANGUAGES, LANG_BY_CODE } from '@/lib/languages'
import type { Narration } from '@/lib/use-narration'
import type { LangCode } from '@/lib/types'

function fmt(seconds: number) {
  const s = Math.max(0, Math.round(seconds))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

interface Props {
  narration: Narration
  lang: LangCode
  onLangChange: (lang: LangCode) => void
  compact?: boolean
}

export function AudioPlayer({ narration, lang, onLangChange, compact = false }: Props) {
  const { status, mode, progress, duration, elapsed, fallback, checking, voices, voiceId, setVoiceId, rate, setRate } = narration
  const playing = status === 'playing'
  const unavailable = mode === 'none' && !checking

  const source =
    mode === 'recording'
      ? `Enregistrement en ${LANG_BY_CODE[lang].name}`
      : mode === 'speech'
        ? 'Voix de synthèse en français'
        : 'Audio indisponible sur ce navigateur'

  return (
    <div className={`audio ${compact ? 'audio--compact' : ''}`}>
      <div className="audio__lang" role="radiogroup" aria-label="Langue de narration">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            role="radio"
            aria-checked={lang === l.code}
            className={`audio__chip ${lang === l.code ? 'is-active' : ''}`}
            onClick={() => onLangChange(l.code)}
          >
            {l.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="audio__row">
        <button
          type="button"
          className="audio__play"
          onClick={narration.toggle}
          disabled={checking || unavailable}
          aria-label={playing ? 'Mettre en pause' : status === 'ended' ? 'Réécouter le conte' : 'Écouter le conte'}
        >
          {playing ? <Pause /> : status === 'ended' ? <RotateCcw /> : <Play fill="currentColor" />}
        </button>
        <div className="audio__meta">
          <strong>La voix du griot</strong>
          <span>{checking ? 'Recherche de l’enregistrement…' : source}</span>
        </div>
        <Volume2 className="audio__vol" aria-hidden="true" />
      </div>

      <div className="audio__progress">
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(progress * 1000)}
          onChange={(e) => narration.seek(Number(e.target.value) / 1000)}
          aria-label="Progression du récit"
          disabled={checking || unavailable}
          style={{ ['--p' as string]: `${progress * 100}%` }}
        />
        <div className="audio__times" aria-hidden="true">
          <span>{fmt(elapsed)}</span>
          <span>{mode === 'speech' ? '≈ ' : ''}{fmt(duration)}</span>
        </div>
      </div>

      {mode === 'speech' && !compact && (
        <div className="audio__voice">
          {voices.length > 1 && (
            <label>
              Voix
              <select value={voiceId} onChange={(e) => setVoiceId(e.target.value)}>
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            Vitesse
            <select value={rate} onChange={(e) => setRate(Number(e.target.value))}>
              <option value={0.75}>Lente</option>
              <option value={0.92}>Normale</option>
              <option value={1.1}>Rapide</option>
            </select>
          </label>
        </div>
      )}

      {fallback && (
        <p className="audio__notice" role="status">
          Pas encore d’enregistrement en {LANG_BY_CODE[lang].name}. Lecture de repli en français.{' '}
          <Link href="/contribuer">Enregistrer une version →</Link>
        </p>
      )}
    </div>
  )
}
