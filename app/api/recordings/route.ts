import { NextResponse } from 'next/server'
import { getPublishedUrl, parseUpload, recordingsMode, saveUpload, storageKind } from '@/lib/recordings'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** GET ?slug=…&lang=… → URL de l'enregistrement publié, ou null. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') ?? ''
  const lang = searchParams.get('lang') ?? ''
  if (!/^[a-z0-9-]{1,80}$/.test(slug) || !/^(fr|mos|dyu|ful)$/.test(lang)) return NextResponse.json({ url: null }, { status: 400 })
  try {
    const url = await getPublishedUrl(slug, lang)
    return NextResponse.json({ url }, { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300' } })
  } catch {
    return NextResponse.json({ url: null })
  }
}

/** POST multipart : audio, slug, lang, consent, narrator?, place? */
export async function POST(request: Request) {
  if (!storageKind()) {
    return NextResponse.json({ error: "L'envoi direct n'est pas activé sur ce site. Télécharge le fichier à la place." }, { status: 501 })
  }
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Requête illisible.' }, { status: 400 })
  }
  const parsed = await parseUpload(form)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status })
  try {
    const status = await saveUpload(parsed.bytes, parsed.meta, recordingsMode() === 'open')
    return NextResponse.json({ status })
  } catch {
    return NextResponse.json({ error: "Impossible d'enregistrer le fichier pour le moment. Réessaie ou télécharge-le." }, { status: 500 })
  }
}
