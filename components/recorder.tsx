'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Download, Mic, RotateCcw, Send, Square } from 'lucide-react'
import { LANGUAGES } from '@/lib/languages'
import { STORIES } from '@/lib/stories'
import type { LangCode } from '@/lib/types'

type Phase = 'idle' | 'recording' | 'recorded'
/** 4 min à 48 kbit/s ≈ 1,5 Mo : sous la limite d'envoi de 4 Mo. */
const MAX_SECONDS = 240

type Upload = { state: 'idle' | 'sending' | 'published' | 'pending' | 'error'; message?: string }

function pickMime(): { mime: string | undefined; ext: string } {
  if (typeof MediaRecorder === 'undefined') return { mime: undefined, ext: 'webm' }
  const candidates: Array<[string, string]> = [
    ['audio/webm;codecs=opus', 'webm'],
    ['audio/webm', 'webm'],
    ['audio/mp4', 'm4a'],
    ['audio/ogg;codecs=opus', 'ogg'],
  ]
  for (const [mime, ext] of candidates) if (MediaRecorder.isTypeSupported(mime)) return { mime, ext }
  return { mime: undefined, ext: 'webm' }
}

export function Recorder() {
  const [slug, setSlug] = useState(STORIES[0].slug)
  const [lang, setLang] = useState<LangCode>('mos')
  const [narrator, setNarrator] = useState('')
  const [place, setPlace] = useState('')
  const [consent, setConsent] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [ext, setExt] = useState('webm')
  const [remote, setRemote] = useState<{ enabled: boolean; mode: 'moderated' | 'open' } | null>(null)
  const [upload, setUpload] = useState<Upload>({ state: 'idle' })

  const recorder = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const chunks = useRef<Blob[]>([])
  const canvas = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)
  const timer = useRef(0)
  const audioCtx = useRef<AudioContext | null>(null)

  const story = STORIES.find((s) => s.slug === slug) ?? STORIES[0]
  const filename = `${slug}.${lang}.${ext}`

  const cleanup = useCallback(() => {
    window.cancelAnimationFrame(raf.current)
    window.clearInterval(timer.current)
    stream.current?.getTracks().forEach((t) => t.stop())
    stream.current = null
    void audioCtx.current?.close()
    audioCtx.current = null
  }, [])

  useEffect(() => cleanup, [cleanup])
  useEffect(() => {
    fetch('/api/recordings/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setRemote(d))
      .catch(() => setRemote(null))
  }, [])
  useEffect(() => () => { if (url) URL.revokeObjectURL(url) }, [url])

  function drawWave(analyser: AnalyserNode) {
    const el = canvas.current
    const ctx = el?.getContext('2d')
    if (!el || !ctx) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    const render = () => {
      analyser.getByteTimeDomainData(data)
      ctx.clearRect(0, 0, el.width, el.height)
      ctx.lineWidth = 2
      ctx.strokeStyle = '#c95432'
      ctx.beginPath()
      const step = el.width / data.length
      data.forEach((v, i) => {
        const y = (v / 255) * el.height
        if (i === 0) ctx.moveTo(0, y)
        else ctx.lineTo(i * step, y)
      })
      ctx.stroke()
      raf.current = window.requestAnimationFrame(render)
    }
    render()
  }

  async function start() {
    setError(null)
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError("Ce navigateur ne permet pas l'enregistrement audio. Essaie Chrome, Edge, Firefox ou Safari récent.")
      return
    }
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      stream.current = media
      const { mime, ext: e } = pickMime()
      setExt(e)
      chunks.current = []
      const rec = new MediaRecorder(media, { ...(mime ? { mimeType: mime } : {}), audioBitsPerSecond: 48000 })
      recorder.current = rec
      rec.ondataavailable = (ev) => ev.data.size && chunks.current.push(ev.data)
      rec.onstop = () => {
        const out = new Blob(chunks.current, { type: rec.mimeType || 'audio/webm' })
        setBlob(out)
        setUrl(URL.createObjectURL(out))
        setPhase('recorded')
        cleanup()
      }
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctor()
      audioCtx.current = ctx
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      ctx.createMediaStreamSource(media).connect(analyser)
      rec.start()
      setSeconds(0)
      setPhase('recording')
      drawWave(analyser)
      timer.current = window.setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) rec.stop()
          return s + 1
        })
      }, 1000)
    } catch (err) {
      const denied = err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'SecurityError')
      setError(denied ? "L'accès au micro a été refusé. Autorise-le dans le navigateur puis réessaie." : "Impossible de démarrer l'enregistrement (micro introuvable ?).")
      cleanup()
    }
  }

  function stop() {
    if (recorder.current?.state === 'recording') recorder.current.stop()
  }

  function reset() {
    if (url) URL.revokeObjectURL(url)
    setBlob(null)
    setUrl(null)
    setSeconds(0)
    setPhase('idle')
    setUpload({ state: 'idle' })
  }

  function download(content: Blob, name: string) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(content)
    a.download = name
    a.click()
    window.setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  }

  async function publish() {
    if (!blob) return
    setUpload({ state: 'sending' })
    const form = new FormData()
    form.append('audio', new File([blob], filename, { type: blob.type }))
    form.append('slug', slug)
    form.append('lang', lang)
    form.append('consent', String(consent))
    form.append('narrator', narrator)
    form.append('place', place)
    form.append('website', '')
    try {
      const res = await fetch('/api/recordings', { method: 'POST', body: form })
      const data = (await res.json().catch(() => ({}))) as { status?: 'published' | 'pending'; error?: string }
      if (res.ok && data.status) setUpload({ state: data.status })
      else setUpload({ state: 'error', message: data.error ?? "L'envoi a échoué. Télécharge le fichier à la place." })
    } catch {
      setUpload({ state: 'error', message: "Pas de connexion : télécharge le fichier et réessaie plus tard." })
    }
  }

  function downloadMeta() {
    const meta = {
      story: slug,
      language: lang,
      narrator: narrator || null,
      place: place || null,
      consentGiven: consent,
      recordedAt: new Date().toISOString(),
      audioFile: filename,
      durationSeconds: seconds,
    }
    download(new Blob([JSON.stringify(meta, null, 2)], { type: 'application/json' }), `${slug}.${lang}.json`)
  }

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  const locked = phase === 'recording'

  return (
    <div className="recorder">
      <div className="recorder__form">
        <label>
          Conte à enregistrer
          <select value={slug} onChange={(e) => setSlug(e.target.value)} disabled={locked}>
            {STORIES.map((s) => (
              <option key={s.slug} value={s.slug}>{s.title}</option>
            ))}
          </select>
        </label>
        <label>
          Langue de l’enregistrement
          <select value={lang} onChange={(e) => setLang(e.target.value as LangCode)} disabled={locked}>
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </label>
        <label>
          Nom du conteur (facultatif)
          <input value={narrator} onChange={(e) => setNarrator(e.target.value)} placeholder="Ex. Grand-mère Awa" disabled={locked} />
        </label>
        <label>
          Village / quartier (facultatif)
          <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Ex. Tanghin, Ouagadougou" disabled={locked} />
        </label>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
        <label className="recorder__consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>
            La personne enregistrée est d’accord pour que sa voix soit utilisée dans ce projet universitaire et pour la
            diffusion sur le site.
          </span>
        </label>
      </div>

      <div className="recorder__stage">
        <div className="recorder__wave" aria-hidden="true">
          <canvas ref={canvas} width={640} height={96} />
          {phase !== 'recording' && <span>{phase === 'recorded' ? 'Enregistrement terminé' : 'Le signal du micro s’affichera ici'}</span>}
        </div>
        <p className="recorder__time" aria-live="off">{mmss}</p>

        <div className="recorder__actions">
          {phase === 'idle' && (
            <button type="button" className="btn" onClick={start} disabled={!consent}>
              <Mic aria-hidden="true" /> Commencer l’enregistrement
            </button>
          )}
          {phase === 'recording' && (
            <button type="button" className="btn btn--danger" onClick={stop}>
              <Square aria-hidden="true" /> Terminer
            </button>
          )}
          {phase === 'recorded' && (
            <>
              <button type="button" className="btn btn--ghost" onClick={reset}>
                <RotateCcw aria-hidden="true" /> Recommencer
              </button>
              {remote?.enabled && upload.state !== 'published' && upload.state !== 'pending' && (
                <button type="button" className="btn btn--publish" onClick={publish} disabled={upload.state === 'sending'}>
                  <Send aria-hidden="true" /> {upload.state === 'sending' ? 'Envoi…' : 'Publier sur le site'}
                </button>
              )}
              <button type="button" className="btn btn--ghost" onClick={() => blob && download(blob, filename)}>
                <Download aria-hidden="true" /> Télécharger {filename}
              </button>
              <button type="button" className="btn btn--ghost" onClick={downloadMeta}>
                <Download aria-hidden="true" /> Fiche (.json)
              </button>
            </>
          )}
        </div>
        {!consent && phase === 'idle' && <p className="hint">Coche d’abord l’accord de la personne enregistrée.</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {url && phase === 'recorded' && <audio controls src={url} className="recorder__audio" />}
        {upload.state === 'published' && (
          <p className="notice notice--ok" role="status">C’est en ligne. Recharge la page du conte : ta voix remplace la voix de synthèse.</p>
        )}
        {upload.state === 'pending' && (
          <p className="notice notice--ok" role="status">Merci ! Ton enregistrement est envoyé. Il apparaîtra sur le site après validation.</p>
        )}
        {upload.state === 'error' && <p className="form-error" role="alert">{upload.message}</p>}
        {phase === 'recorded' && !remote?.enabled && (
          <p className="hint">
            L’envoi direct n’est pas activé sur ce site : télécharge le fichier et dépose-le dans <code>public/audio/</code> du dépôt.
          </p>
        )}
        {phase === 'recorded' && remote?.enabled && upload.state === 'idle' && (
          <p className="hint">
            {remote.mode === 'moderated' ? 'L’enregistrement sera publié après relecture par l’équipe.' : 'L’enregistrement sera publié immédiatement.'}
          </p>
        )}
      </div>

      <details className="recorder__reference">
        <summary>Texte de référence : {story.title}</summary>
        {story.chapters.map((c, i) => (
          <p key={i}>{c}</p>
        ))}
      </details>
    </div>
  )
}
