'use client'

import { useSyncExternalStore } from 'react'
import type { Progress } from './types'

const KEY = 'faso:progress:v1'
const EMPTY: Progress = { heard: [], quiz: {}, endings: {} }

let cache: Progress | null = null
const listeners = new Set<() => void>()

function read(): Progress {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(KEY)
    const parsed = raw ? (JSON.parse(raw) as Partial<Progress>) : {}
    cache = {
      heard: Array.isArray(parsed.heard) ? parsed.heard : [],
      quiz: parsed.quiz && typeof parsed.quiz === 'object' ? parsed.quiz : {},
      endings: parsed.endings && typeof parsed.endings === 'object' ? parsed.endings : {},
    }
  } catch {
    cache = { ...EMPTY }
  }
  return cache
}

function write(next: Progress) {
  cache = next
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* stockage indisponible (navigation privée) : la progression reste en mémoire */
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export function markHeard(slug: string) {
  const p = read()
  if (p.heard.includes(slug)) return
  write({ ...p, heard: [...p.heard, slug] })
}

export function saveQuizScore(slug: string, score: number) {
  const p = read()
  if ((p.quiz[slug] ?? -1) >= score) return
  write({ ...p, quiz: { ...p.quiz, [slug]: score } })
}

export function saveEnding(slug: string, endingId: string) {
  const p = read()
  const list = p.endings[slug] ?? []
  if (list.includes(endingId)) return
  write({ ...p, endings: { ...p.endings, [slug]: [...list, endingId] } })
}

export function resetProgress() {
  write({ heard: [], quiz: {}, endings: {} })
}

export interface Badge {
  id: string
  label: string
  description: string
  earned: boolean
}

export function computeBadges(progress: Progress, total: number): Badge[] {
  const perfect = Object.values(progress.quiz).filter((s) => s >= 3).length
  const endings = Object.values(progress.endings).reduce((n, l) => n + l.length, 0)
  return [
    { id: 'voyageur', label: 'Voyageur', description: 'Écouter ou lire 3 contes', earned: progress.heard.length >= 3 },
    { id: 'griot', label: 'Griot', description: `Terminer les ${total} contes`, earned: progress.heard.length >= total },
    { id: 'sage', label: 'Sage', description: '3 quiz sans faute', earned: perfect >= 3 },
    { id: 'explorateur', label: 'Explorateur', description: 'Découvrir 5 fins différentes', earned: endings >= 5 },
  ]
}
