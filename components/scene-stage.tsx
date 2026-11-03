'use client'

import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { SceneFX } from '@/components/scene-fx'
import type { SceneVariant } from '@/lib/types'

interface Props {
  variant: SceneVariant
  night: boolean
  rain: boolean
  /** Mouvement de caméra lent (héros) en plus de la parallaxe. */
  cinematic?: boolean
  /** Image facultative (ex. générée par IA) : affichée par-dessus le SVG si le fichier existe. */
  image?: string
  children: ReactNode
}

/**
 * Habille une illustration SVG : parallaxe au pointeur, atmosphère animée,
 * rayons de lumière, grain de pellicule, vignettage, et image photo optionnelle.
 */
export function SceneStage({ variant, night, rain, cinematic = false, image, children }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [imageReady, setImageReady] = useState(false)

  function move(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'touch' || !root.current) return
    const r = root.current.getBoundingClientRect()
    root.current.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3))
    root.current.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3))
  }

  function leave() {
    root.current?.style.setProperty('--px', '0')
    root.current?.style.setProperty('--py', '0')
  }

  return (
    <div
      ref={root}
      className={`stage ${cinematic ? 'stage--cinematic' : ''} ${night ? 'stage--night' : 'stage--day'}`}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <div className="stage__media">
        <div className="stage__kb">
          {children}
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={`stage__img ${imageReady ? 'is-loaded' : ''}`}
              src={image}
              alt=""
              loading={cinematic ? 'eager' : 'lazy'}
              onLoad={() => setImageReady(true)}
              onError={() => setImageReady(false)}
            />
          )}
        </div>
      </div>
      <SceneFX variant={variant} night={night} rain={rain} />
      {!night && <div className="stage__rays" aria-hidden="true" />}
      <div className="stage__grain" aria-hidden="true" />
      <div className="stage__vignette" aria-hidden="true" />
    </div>
  )
}
