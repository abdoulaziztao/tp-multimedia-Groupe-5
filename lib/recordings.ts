/**
 * Enregistrements envoyés depuis le site (côté serveur uniquement).
 *
 * Deux stockages :
 *  - `blob`  : Vercel Blob (production), activé par la variable BLOB_READ_WRITE_TOKEN ;
 *  - `local` : dossiers du projet (développement seulement), pour tester sans compte.
 * En production sans Blob, l'envoi est désactivé et l'atelier propose le téléchargement.
 *
 * Deux modes (variable RECORDINGS_MODE) :
 *  - `moderated` (défaut) : l'envoi attend une validation sur /moderation ;
 *  - `open` : l'envoi est publié immédiatement.
 */
import { createHash, timingSafeEqual } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { copy, del, list, put } from '@vercel/blob'
import { LANGUAGES } from '@/lib/languages'
import { STORIES } from '@/lib/stories'

/** Limite du corps d'une requête sur Vercel : 4,5 Mo. On reste en dessous. */
export const MAX_BYTES = 4 * 1024 * 1024
export const MIN_BYTES = 2 * 1024

export type Ext = 'webm' | 'ogg' | 'm4a' | 'mp3'
export type RecordingsMode = 'moderated' | 'open'

export interface RecordingMeta {
  slug: string
  lang: string
  narrator: string | null
  place: string | null
  consentGiven: true
  recordedAt: string
  ext: Ext
  bytes: number
}

export interface PendingItem {
  /** Identifiant = chemin du fichier en attente. */
  id: string
  url: string
  meta: RecordingMeta | null
}

const CONTENT_TYPE: Record<Ext, string> = { webm: 'audio/webm', ogg: 'audio/ogg', m4a: 'audio/mp4', mp3: 'audio/mpeg' }
const PENDING_ID = /^pending\/([a-z0-9-]+)\.(fr|mos|dyu|ful)\.(\d{10,})\.(webm|ogg|m4a|mp3)$/

export const recordingsMode = (): RecordingsMode => (process.env.RECORDINGS_MODE === 'open' ? 'open' : 'moderated')

export function storageKind(): 'blob' | 'local' | null {
  if (process.env.BLOB_READ_WRITE_TOKEN) return 'blob'
  return process.env.NODE_ENV !== 'production' ? 'local' : null
}

/** Reconnaît le vrai format à partir des premiers octets (le type MIME envoyé ne suffit pas). */
export function sniffExt(buf: Uint8Array): Ext | null {
  const at = (i: number, s: string) => [...s].every((c, k) => buf[i + k] === c.charCodeAt(0))
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return 'webm'
  if (at(0, 'OggS')) return 'ogg'
  if (at(4, 'ftyp')) return 'm4a'
  if (at(0, 'ID3') || (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0)) return 'mp3'
  return null
}

const clean = (v: FormDataEntryValue | null, max = 80): string | null => {
  if (typeof v !== 'string') return null
  const t = v.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max)
  return t || null
}

export type ParsedUpload =
  | { ok: true; bytes: Uint8Array; meta: RecordingMeta }
  | { ok: false; status: number; error: string }

export async function parseUpload(form: FormData): Promise<ParsedUpload> {
  const fail = (status: number, error: string): ParsedUpload => ({ ok: false, status, error })

  if (clean(form.get('website'))) return fail(400, 'Requête refusée.') // champ piège pour les robots
  if (form.get('consent') !== 'true') return fail(400, "L'accord de la personne enregistrée est obligatoire.")

  const slug = clean(form.get('slug'), 80)
  if (!slug || !STORIES.some((s) => s.slug === slug)) return fail(400, 'Conte inconnu.')
  const lang = clean(form.get('lang'), 8)
  if (!lang || !LANGUAGES.some((l) => l.code === lang)) return fail(400, 'Langue inconnue.')

  const file = form.get('audio')
  if (!(file instanceof File)) return fail(400, 'Fichier audio manquant.')
  if (file.size > MAX_BYTES) return fail(413, 'Enregistrement trop long (4 Mo maximum, soit environ 10 minutes).')
  if (file.size < MIN_BYTES) return fail(400, 'Enregistrement trop court ou vide.')

  const bytes = new Uint8Array(await file.arrayBuffer())
  const ext = sniffExt(bytes)
  if (!ext) return fail(415, "Ce fichier n'est pas un audio reconnu (webm, ogg, m4a ou mp3).")

  return {
    ok: true,
    bytes,
    meta: {
      slug,
      lang,
      narrator: clean(form.get('narrator')),
      place: clean(form.get('place')),
      consentGiven: true,
      recordedAt: new Date().toISOString(),
      ext,
      bytes: bytes.byteLength,
    },
  }
}

/* ------------------------------------------------------------------ */
/* Administration                                                      */
/* ------------------------------------------------------------------ */

export function isAdmin(request: Request): boolean {
  const expected = process.env.ADMIN_TOKEN ?? (process.env.NODE_ENV !== 'production' ? 'dev' : '')
  if (!expected) return false
  const given = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  const a = createHash('sha256').update(given).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

/* ------------------------------------------------------------------ */
/* Stockage local (développement)                                      */
/* ------------------------------------------------------------------ */

const LOCAL_PENDING = path.join(process.cwd(), '.recordings', 'pending')
const LOCAL_PUBLISHED = path.join(process.cwd(), 'public', 'audio')

async function localRemovePublished(slug: string, lang: string) {
  for (const e of Object.keys(CONTENT_TYPE)) await fs.rm(path.join(LOCAL_PUBLISHED, `${slug}.${lang}.${e}`), { force: true })
}

/* ------------------------------------------------------------------ */
/* Enregistrement                                                      */
/* ------------------------------------------------------------------ */

export async function saveUpload(bytes: Uint8Array, meta: RecordingMeta, publish: boolean): Promise<'published' | 'pending'> {
  const kind = storageKind()
  const { slug, lang, ext } = meta
  const base = publish ? `published/${slug}.${lang}` : `pending/${slug}.${lang}.${Math.floor(Date.now() / 1000)}`

  if (kind === 'blob') {
    if (publish) await removePublishedBlobs(slug, lang)
    const common = { access: 'public' as const, addRandomSuffix: false, allowOverwrite: true }
    await put(`${base}.${ext}`, Buffer.from(bytes), { ...common, contentType: CONTENT_TYPE[ext] })
    await put(`${base}.json`, JSON.stringify(meta, null, 2), { ...common, contentType: 'application/json' })
  } else if (kind === 'local') {
    if (publish) {
      await fs.mkdir(LOCAL_PUBLISHED, { recursive: true })
      await localRemovePublished(slug, lang)
      await fs.writeFile(path.join(LOCAL_PUBLISHED, `${slug}.${lang}.${ext}`), bytes)
    } else {
      await fs.mkdir(LOCAL_PENDING, { recursive: true })
      const name = base.replace('pending/', '')
      await fs.writeFile(path.join(LOCAL_PENDING, `${name}.${ext}`), bytes)
      await fs.writeFile(path.join(LOCAL_PENDING, `${name}.json`), JSON.stringify(meta, null, 2))
    }
  } else {
    throw new Error('storage-disabled')
  }
  return publish ? 'published' : 'pending'
}

async function removePublishedBlobs(slug: string, lang: string) {
  const { blobs } = await list({ prefix: `published/${slug}.${lang}.` })
  if (blobs.length) await del(blobs.map((b) => b.url))
}

/** URL de l'enregistrement publié pour un conte et une langue (stockage Blob uniquement). */
export async function getPublishedUrl(slug: string, lang: string): Promise<string | null> {
  if (storageKind() !== 'blob') return null
  const { blobs } = await list({ prefix: `published/${slug}.${lang}.` })
  return blobs.find((b) => !b.pathname.endsWith('.json'))?.url ?? null
}

/* ------------------------------------------------------------------ */
/* Modération                                                          */
/* ------------------------------------------------------------------ */

export async function listPending(): Promise<PendingItem[]> {
  const kind = storageKind()
  if (kind === 'blob') {
    const { blobs } = await list({ prefix: 'pending/', limit: 200 })
    const audio = blobs.filter((b) => PENDING_ID.test(b.pathname))
    return Promise.all(
      audio.map(async (b) => {
        const json = blobs.find((x) => x.pathname === b.pathname.replace(/\.[a-z0-9]+$/, '.json'))
        let meta: RecordingMeta | null = null
        if (json) {
          try {
            meta = (await (await fetch(json.url)).json()) as RecordingMeta
          } catch {
            meta = null
          }
        }
        return { id: b.pathname, url: b.url, meta }
      }),
    )
  }
  if (kind === 'local') {
    const files = await fs.readdir(LOCAL_PENDING).catch(() => [] as string[])
    const out: PendingItem[] = []
    for (const f of files.filter((n) => !n.endsWith('.json'))) {
      const id = `pending/${f}`
      if (!PENDING_ID.test(id)) continue
      let meta: RecordingMeta | null = null
      try {
        meta = JSON.parse(await fs.readFile(path.join(LOCAL_PENDING, f.replace(/\.[a-z0-9]+$/, '.json')), 'utf8'))
      } catch {
        meta = null
      }
      out.push({ id, url: `/api/recordings/moderate?file=${encodeURIComponent(f)}`, meta })
    }
    return out
  }
  return []
}

/** Lecture d'un fichier en attente (développement local seulement). */
export async function readLocalPending(file: string): Promise<Buffer | null> {
  if (storageKind() !== 'local' || !PENDING_ID.test(`pending/${file}`)) return null
  return fs.readFile(path.join(LOCAL_PENDING, file)).catch(() => null)
}

export async function moderate(id: string, action: 'approve' | 'reject'): Promise<void> {
  const m = PENDING_ID.exec(id)
  if (!m) throw new Error('bad-id')
  const [, slug, lang, , ext] = m
  const stem = id.replace(/\.[a-z0-9]+$/, '')
  const kind = storageKind()

  if (kind === 'blob') {
    const { blobs } = await list({ prefix: stem })
    const audio = blobs.find((b) => b.pathname === id)
    const json = blobs.find((b) => b.pathname === `${stem}.json`)
    if (!audio) throw new Error('not-found')
    if (action === 'approve') {
      await removePublishedBlobs(slug, lang)
      const to = `published/${slug}.${lang}`
      const common = { access: 'public' as const, addRandomSuffix: false, allowOverwrite: true }
      await copy(audio.url, `${to}.${ext}`, { ...common, contentType: CONTENT_TYPE[ext as Ext] })
      if (json) await copy(json.url, `${to}.json`, { ...common, contentType: 'application/json' })
    }
    await del([audio.url, ...(json ? [json.url] : [])])
    return
  }

  if (kind === 'local') {
    const name = id.replace('pending/', '')
    const src = path.join(LOCAL_PENDING, name)
    if (action === 'approve') {
      await fs.mkdir(LOCAL_PUBLISHED, { recursive: true })
      await localRemovePublished(slug, lang)
      await fs.copyFile(src, path.join(LOCAL_PUBLISHED, `${slug}.${lang}.${ext}`))
    }
    await fs.rm(src, { force: true })
    await fs.rm(path.join(LOCAL_PENDING, name.replace(/\.[a-z0-9]+$/, '.json')), { force: true })
    return
  }
  throw new Error('storage-disabled')
}
