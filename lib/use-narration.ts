'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { LangCode, Story } from './types'

const EXTENSIONS = ['mp3', 'm4a', 'ogg', 'webm'] as const
const recordingCache = new Map<string, string | null>()

/** Cherche un enregistrement `/audio/<slug>.<langue>.<ext>` déposé dans `public/audio`. */
export async function findRecording(slug: string, lang: LangCode): Promise<string | null> {
  const key = `${slug}.${lang}`
  if (recordingCache.has(key)) return recordingCache.get(key) ?? null
  for (const ext of EXTENSIONS) {
    const url = `/audio/${key}.${ext}`
    try {
      const res = await fetch(url, { method: 'HEAD' })
      const type = res.headers.get('content-type') ?? ''
      if (res.ok && !type.includes('text/html')) {
        recordingCache.set(key, url)
        return url
      }
    } catch {
      /* hors ligne : on essaie l'extension suivante */
    }
  }
  recordingCache.set(key, null)
  return null
}

export type NarrationStatus = 'idle' | 'playing' | 'paused' | 'ended'
export type NarrationMode = 'recording' | 'speech' | 'none'

export interface Narration {
  status: NarrationStatus
  mode: NarrationMode
  /** 0 → 1 */
  progress: number
  chapter: number
  /** Durée estimée (voix de synthèse) ou réelle (enregistrement), en secondes. */
  duration: number
  elapsed: number
  /** La langue demandée n'a pas d'enregistrement : lecture de repli en français. */
  fallback: boolean
  checking: boolean
  toggle: () => void
  stop: () => void
  seek: (fraction: number) => void
}

interface Segment {
  chapter: number
  text: string
  start: number
}

function buildSegments(chapters: string[]): { segments: Segment[]; total: number } {
  const segments: Segment[] = []
  let start = 0
  chapters.forEach((text, chapter) => {
    const parts = text.match(/[^.!?…»]+[.!?…»]*\s*/g) ?? [text]
    parts.forEach((p) => {
      segments.push({ chapter, text: p.trim(), start })
      start += p.length
    })
  })
  return { segments, total: start }
}

export function useNarration(story: Story, lang: LangCode, onEnded?: () => void): Narration {
  const { segments, total } = useMemo(() => buildSegments(story.chapters), [story])
  const weights = useMemo(() => {
    const lens = story.chapters.map((c) => c.length)
    const sum = lens.reduce((a, b) => a + b, 0)
    let acc = 0
    return lens.map((l) => {
      const s = acc / sum
      acc += l
      return s
    })
  }, [story])
  const estimatedDuration = useMemo(() => total / 14, [total]) // ≈ 14 caractères/seconde

  const [status, setStatus] = useState<NarrationStatus>('idle')
  const [mode, setMode] = useState<NarrationMode>('none')
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(estimatedDuration)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const segmentRef = useRef(0)
  const generationRef = useRef(0)
  const progressRef = useRef(0)
  const endedRef = useRef(onEnded)
  endedRef.current = onEnded

  const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window

  const teardown = useCallback(() => {
    generationRef.current += 1
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeAttribute('src')
      audioRef.current.load()
      audioRef.current = null
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [])

  const updateProgress = useCallback((value: number) => {
    progressRef.current = value
    setProgress(value)
  }, [])

  // Recherche d'un enregistrement à chaque changement de conte / langue.
  useEffect(() => {
    let alive = true
    teardown()
    setStatus('idle')
    updateProgress(0)
    segmentRef.current = 0
    setChecking(true)
    findRecording(story.slug, lang).then((url) => {
      if (!alive) return
      setRecordingUrl(url)
      setMode(url ? 'recording' : hasSpeech ? 'speech' : 'none')
      setDuration(estimatedDuration)
      setChecking(false)
    })
    return () => {
      alive = false
      teardown()
    }
  }, [story.slug, lang, estimatedDuration, hasSpeech, teardown, updateProgress])

  const finish = useCallback(() => {
    setStatus('ended')
    updateProgress(1)
    endedRef.current?.()
  }, [updateProgress])

  const speakFrom = useCallback(
    (index: number) => {
      if (!hasSpeech) return
      const synth = window.speechSynthesis
      synth.cancel()
      const generation = ++generationRef.current
      const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('fr'))
      const speak = (i: number) => {
        if (generation !== generationRef.current) return
        if (i >= segments.length) return finish()
        segmentRef.current = i
        const seg = segments[i]
        const u = new SpeechSynthesisUtterance(seg.text)
        u.lang = 'fr-FR'
        if (voice) u.voice = voice
        u.rate = 0.92
        u.onboundary = (e) => {
          if (generation !== generationRef.current) return
          updateProgress(Math.min(0.999, (seg.start + e.charIndex) / total))
        }
        u.onend = () => {
          if (generation !== generationRef.current) return
          updateProgress(Math.min(0.999, (seg.start + seg.text.length) / total))
          speak(i + 1)
        }
        u.onerror = (e) => {
          if (generation !== generationRef.current) return
          if (e.error === 'canceled' || e.error === 'interrupted') return
          setStatus('idle')
        }
        synth.speak(u)
      }
      speak(index)
      setStatus('playing')
    },
    [finish, hasSpeech, segments, total, updateProgress],
  )

  const playRecording = useCallback(
    (url: string, fraction = 0) => {
      teardown()
      const audio = new Audio(url)
      audioRef.current = audio
      audio.addEventListener('loadedmetadata', () => {
        if (Number.isFinite(audio.duration)) {
          setDuration(audio.duration)
          if (fraction > 0) audio.currentTime = audio.duration * fraction
        }
      })
      audio.addEventListener('timeupdate', () => {
        if (audio.duration) updateProgress(audio.currentTime / audio.duration)
      })
      audio.addEventListener('ended', finish)
      audio.addEventListener('error', () => {
        // Fichier illisible : repli sur la voix de synthèse.
        recordingCache.set(`${story.slug}.${lang}`, null)
        setRecordingUrl(null)
        setMode(hasSpeech ? 'speech' : 'none')
        setStatus('idle')
      })
      setStatus('playing')
      void audio.play().catch(() => setStatus('idle'))
    },
    [finish, hasSpeech, lang, story.slug, teardown, updateProgress],
  )

  const toggle = useCallback(() => {
    if (checking || mode === 'none') return
    if (status === 'playing') {
      if (mode === 'recording') audioRef.current?.pause()
      else {
        generationRef.current += 1
        window.speechSynthesis.cancel()
      }
      setStatus('paused')
      return
    }
    const restart = status === 'ended'
    if (mode === 'recording' && recordingUrl) {
      if (status === 'paused' && audioRef.current) {
        setStatus('playing')
        void audioRef.current.play()
      } else playRecording(recordingUrl, restart ? 0 : progressRef.current)
    } else {
      speakFrom(restart ? 0 : segmentRef.current)
    }
  }, [checking, mode, playRecording, recordingUrl, speakFrom, status])

  const stop = useCallback(() => {
    teardown()
    segmentRef.current = 0
    updateProgress(0)
    setStatus('idle')
  }, [teardown, updateProgress])

  const seek = useCallback(
    (fraction: number) => {
      const value = Math.min(0.999, Math.max(0, fraction))
      if (mode === 'recording' && audioRef.current?.duration) {
        audioRef.current.currentTime = audioRef.current.duration * value
        updateProgress(value)
        return
      }
      const target = value * total
      let idx = segments.findIndex((s) => s.start + s.text.length >= target)
      if (idx < 0) idx = 0
      segmentRef.current = idx
      updateProgress(segments[idx].start / total)
      if (status === 'playing') speakFrom(idx)
    },
    [mode, segments, speakFrom, status, total, updateProgress],
  )

  // Chapitre courant, déduit de la progression.
  let chapter = 0
  for (let i = 0; i < weights.length; i++) if (progress >= weights[i]) chapter = i

  return {
    status,
    mode,
    progress,
    chapter,
    duration,
    elapsed: progress * duration,
    fallback: lang !== 'fr' && !recordingUrl && !checking,
    checking,
    toggle,
    stop,
    seek,
  }
}
