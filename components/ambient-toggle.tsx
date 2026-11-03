'use client'

import { useEffect, useRef, useState } from 'react'
import { Waves, VolumeX } from 'lucide-react'
import { AMBIENT_BY_VARIANT, createAmbient, type AmbientEngine } from '@/lib/ambient'
import type { SceneVariant } from '@/lib/types'

export function AmbientToggle({ variant }: { variant: SceneVariant }) {
  const [on, setOn] = useState(false)
  const engine = useRef<AmbientEngine | null>(null)

  useEffect(() => {
    return () => {
      engine.current?.stop()
      engine.current = null
    }
  }, [])

  // Si le décor change, on coupe l'ambiance précédente.
  useEffect(() => {
    engine.current?.stop()
    engine.current = null
    setOn(false)
  }, [variant])

  async function toggle() {
    if (on) {
      engine.current?.stop()
      engine.current = null
      setOn(false)
      return
    }
    engine.current = createAmbient(AMBIENT_BY_VARIANT[variant])
    try {
      await engine.current.start()
      setOn(true)
    } catch {
      engine.current = null
    }
  }

  return (
    <button type="button" className={`pill ${on ? 'is-active' : ''}`} onClick={toggle} aria-pressed={on}>
      {on ? <Waves aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
      Ambiance sonore {on ? 'activée' : 'coupée'}
    </button>
  )
}
