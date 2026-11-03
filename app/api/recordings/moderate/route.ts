import { NextResponse } from 'next/server'
import { isAdmin, listPending, moderate, readLocalPending } from '@/lib/recordings'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const unauthorized = () => NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

/** GET → liste des enregistrements en attente. GET ?file=… → audio local (développement). */
export async function GET(request: Request) {
  if (!isAdmin(request)) return unauthorized()
  const file = new URL(request.url).searchParams.get('file')
  if (file) {
    const data = await readLocalPending(file)
    if (!data) return NextResponse.json({ error: 'Introuvable.' }, { status: 404 })
    return new NextResponse(new Uint8Array(data), { headers: { 'Content-Type': 'application/octet-stream' } })
  }
  try {
    return NextResponse.json({ items: await listPending() })
  } catch {
    return NextResponse.json({ error: 'Stockage indisponible.' }, { status: 500 })
  }
}

/** POST { id, action: 'approve' | 'reject' } */
export async function POST(request: Request) {
  if (!isAdmin(request)) return unauthorized()
  const body = (await request.json().catch(() => null)) as { id?: string; action?: string } | null
  if (!body?.id || (body.action !== 'approve' && body.action !== 'reject')) {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }
  try {
    await moderate(body.id, body.action)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Opération impossible.' }, { status: 400 })
  }
}
