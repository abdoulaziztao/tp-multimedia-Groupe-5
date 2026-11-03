'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, RefreshCw, X } from 'lucide-react'
import { STORIES } from '@/lib/stories'
import { LANG_BY_CODE } from '@/lib/languages'
import type { LangCode } from '@/lib/types'

interface Item {
  id: string
  url: string
  meta: { slug: string; lang: string; narrator: string | null; place: string | null; recordedAt: string; bytes: number } | null
}

const KEY = 'faso.admin'

export function Moderation() {
  const [token, setToken] = useState('')
  const [items, setItems] = useState<Item[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({})

  const load = useCallback(async (t: string) => {
    setError(null)
    const res = await fetch('/api/recordings/moderate', { headers: { Authorization: `Bearer ${t}` } })
    if (res.status === 401) {
      setItems(null)
      setError('Mot de passe incorrect.')
      return
    }
    if (!res.ok) {
      setItems(null)
      setError('Impossible de lire la liste pour le moment.')
      return
    }
    const data = (await res.json()) as { items: Item[] }
    setItems(data.items)
    try {
      window.sessionStorage.setItem(KEY, t)
    } catch {
      /* ignoré */
    }
    // En développement local, l'audio passe par l'API protégée : on le charge en blob.
    const local = data.items.filter((i) => i.url.startsWith('/api/'))
    const entries = await Promise.all(
      local.map(async (i) => {
        const r = await fetch(i.url, { headers: { Authorization: `Bearer ${t}` } })
        return [i.id, URL.createObjectURL(await r.blob())] as const
      }),
    )
    setBlobUrls(Object.fromEntries(entries))
  }, [])

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(KEY)
      if (saved) {
        setToken(saved)
        void load(saved)
      }
    } catch {
      /* ignoré */
    }
  }, [load])

  async function act(id: string, action: 'approve' | 'reject') {
    setBusy(id)
    const res = await fetch('/api/recordings/moderate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
    setBusy(null)
    if (!res.ok) setError("L'opération a échoué.")
    else await load(token)
  }

  return (
    <div className="moderation">
      <form
        className="moderation__login"
        onSubmit={(e) => {
          e.preventDefault()
          void load(token)
        }}
      >
        <label>
          Mot de passe de l’équipe
          <input type="password" value={token} onChange={(e) => setToken(e.target.value)} autoComplete="current-password" required />
        </label>
        <button type="submit" className="btn">
          <RefreshCw aria-hidden="true" /> Afficher les enregistrements
        </button>
      </form>

      {error && <p className="form-error" role="alert">{error}</p>}
      {items && items.length === 0 && <p className="empty">Aucun enregistrement en attente.</p>}

      <ul className="moderation__list">
        {items?.map((item) => {
          const story = STORIES.find((s) => s.slug === item.meta?.slug)
          const lang = item.meta ? LANG_BY_CODE[item.meta.lang as LangCode]?.name : undefined
          return (
            <li key={item.id}>
              <div>
                <strong>{story?.title ?? item.id}</strong>
                <p>
                  {lang ?? '—'} · {item.meta?.narrator ?? 'conteur non indiqué'}
                  {item.meta?.place ? ` · ${item.meta.place}` : ''}
                </p>
                <p className="moderation__small">
                  {item.meta ? new Date(item.meta.recordedAt).toLocaleString('fr-FR') : ''}
                  {item.meta ? ` · ${(item.meta.bytes / 1024).toFixed(0)} Ko · accord déclaré` : ''}
                </p>
              </div>
              <audio controls preload="none" src={blobUrls[item.id] ?? item.url} />
              <div className="moderation__actions">
                <button type="button" className="btn" disabled={busy === item.id} onClick={() => act(item.id, 'approve')}>
                  <Check aria-hidden="true" /> Publier
                </button>
                <button type="button" className="btn btn--ghost" disabled={busy === item.id} onClick={() => act(item.id, 'reject')}>
                  <X aria-hidden="true" /> Refuser
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
