import { NextResponse } from 'next/server'
import { recordingsMode, storageKind } from '@/lib/recordings'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Indique à l'atelier si l'envoi direct est disponible et en quel mode. */
export async function GET() {
  return NextResponse.json({ enabled: storageKind() !== null, mode: recordingsMode() })
}
