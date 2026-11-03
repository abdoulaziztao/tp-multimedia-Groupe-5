'use client'

import { useEffect, useRef } from 'react'
import type { SceneVariant } from '@/lib/types'

/**
 * Couche d'atmosphère animée (canvas 2D) posée sur les illustrations SVG :
 * lucioles, poussière dorée, sable, brume, braises, oiseaux.
 * - ne s'anime que lorsque la scène est visible à l'écran ;
 * - se met en pause quand l'onglet est masqué ;
 * - est désactivée si l'utilisateur demande de réduire les animations.
 */

type Kind = 'dust' | 'fireflies' | 'sand' | 'mist' | 'embers'

interface Particle {
  kind: Kind
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
  ph: number
  sp: number
  life: number
  max: number
}

interface Bird {
  x: number
  y: number
  v: number
  ph: number
  s: number
}

interface Props {
  variant: SceneVariant
  night: boolean
  rain: boolean
}

function layersFor(variant: SceneVariant, night: boolean, rain: boolean): Kind[] {
  if (rain) return ['mist']
  if (variant === 'village' && night) return ['embers', 'fireflies']
  if (variant === 'dune') return ['sand', 'fireflies']
  if (variant === 'mare') return ['fireflies', 'mist']
  if (variant === 'cascade') return ['mist', 'dust']
  if (night) return ['fireflies']
  return ['dust']
}

const COLORS: Record<Kind, string> = {
  dust: '255,241,201',
  fireflies: '255,233,150',
  sand: '240,200,140',
  mist: '235,245,240',
  embers: '255,150,60',
}

function makeSprite(rgb: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, `rgba(${rgb},1)`)
  grad.addColorStop(0.35, `rgba(${rgb},0.45)`)
  grad.addColorStop(1, `rgba(${rgb},0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return c
}

const rand = (a: number, b: number) => a + Math.random() * (b - a)

function spawn(kind: Kind, w: number, h: number, variant: SceneVariant, fresh: boolean): Particle {
  const base = { kind, ph: rand(0, Math.PI * 2), sp: rand(0.6, 1.6), life: 0, max: 1, x: 0, y: 0, vx: 0, vy: 0, r: 2, a: 0.3 }
  switch (kind) {
    case 'dust':
      return { ...base, x: rand(0, w), y: rand(0, h), vx: rand(5, 14), vy: rand(-8, -2), r: rand(1.5, 3.8), a: rand(0.18, 0.55) }
    case 'fireflies':
      return { ...base, x: rand(0, w), y: rand(h * 0.4, h * 0.95), vx: rand(-9, 9), vy: rand(-7, 7), r: rand(2.2, 4.2), a: rand(0.6, 1) }
    case 'sand':
      return { ...base, x: rand(0, w), y: rand(h * 0.45, h), vx: rand(45, 95), vy: rand(-3, 3), r: rand(1, 2), a: rand(0.2, 0.5) }
    case 'mist':
      return { ...base, x: rand(-60, w), y: rand(h * 0.55, h * 1.02), vx: rand(3, 9), vy: rand(-1.5, 0.5), r: rand(70, 150), a: rand(0.05, 0.12) }
    case 'embers': {
      const life = fresh ? rand(0, 3) : 0
      return {
        ...base,
        x: w * 0.62 + rand(-14, 14),
        y: h * 0.8 + rand(-6, 4),
        vx: rand(-10, 14),
        vy: rand(-55, -24),
        r: rand(1.6, 3.2),
        a: 1,
        life,
        max: rand(2, 4),
      }
    }
  }
}

function drawBird(ctx: CanvasRenderingContext2D, b: Bird, t: number) {
  const f = Math.sin(t * 8 + b.ph)
  const s = b.s
  ctx.beginPath()
  ctx.moveTo(b.x - 10 * s, b.y - 6 * s * f)
  ctx.quadraticCurveTo(b.x - 4 * s, b.y - 4 * s, b.x, b.y)
  ctx.quadraticCurveTo(b.x + 4 * s, b.y - 4 * s, b.x + 10 * s, b.y - 6 * s * f)
  ctx.stroke()
}

export function SceneFX({ variant, night, rain }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const kinds = layersFor(variant, night, rain)
    const sprites = Object.fromEntries(kinds.map((k) => [k, makeSprite(COLORS[k])])) as Record<Kind, HTMLCanvasElement>
    const withBirds = !night && !rain && (variant === 'savane' || variant === 'cascade' || variant === 'foret')

    let w = 0
    let h = 0
    let particles: Particle[] = []
    let birds: Bird[] = []
    let raf = 0
    let last = 0
    let t = 0
    let visible = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = host.clientWidth
      h = host.clientHeight
      if (!w || !h) return
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const area = w * h
      particles = []
      kinds.forEach((k) => {
        const per = k === 'mist' ? 14000 : k === 'embers' ? 30000 : k === 'sand' ? 12000 : 16000
        const n = Math.max(k === 'mist' ? 4 : 8, Math.min(k === 'mist' ? 9 : 48, Math.round(area / per)))
        for (let i = 0; i < n; i++) particles.push(spawn(k, w, h, variant, true))
      })
      birds = withBirds
        ? Array.from({ length: 3 }, (_, i) => ({ x: rand(-w, w), y: rand(h * 0.1, h * 0.34), v: rand(26, 42), ph: i * 2.1, s: Math.max(0.6, h / 320) * rand(0.8, 1.2) }))
        : []
    }

    const frame = (now: number) => {
      raf = 0
      if (!visible || document.hidden) return
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016)
      last = now
      t += dt
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx * dt
        p.y += p.vy * dt
        let alpha = p.a
        let size = p.r * 4

        if (p.kind === 'fireflies') {
          p.vx += Math.cos(t * p.sp + p.ph) * 6 * dt
          p.vy += Math.sin(t * p.sp * 1.3 + p.ph) * 6 * dt
          p.vx = Math.max(-12, Math.min(12, p.vx))
          p.vy = Math.max(-10, Math.min(10, p.vy))
          alpha = p.a * Math.pow(Math.max(0, Math.sin(t * p.sp * 1.7 + p.ph)), 2)
          size = p.r * 7
        } else if (p.kind === 'dust') {
          alpha = p.a * (0.55 + 0.45 * Math.sin(t * p.sp + p.ph))
        } else if (p.kind === 'embers') {
          p.life += dt
          alpha = Math.max(0, 1 - p.life / p.max) * 0.95
          p.vx += Math.sin(t * 3 + p.ph) * 14 * dt
          size = p.r * 6 * (1 - p.life / p.max / 1.6)
          if (p.life >= p.max) {
            particles[i] = spawn('embers', w, h, variant, false)
            continue
          }
        } else if (p.kind === 'mist') {
          size = p.r * 2
        }

        if (alpha > 0.01) {
          ctx.globalAlpha = alpha
          if (p.kind === 'sand') ctx.drawImage(sprites.sand, p.x, p.y, size * 3, size * 0.9)
          else ctx.drawImage(sprites[p.kind], p.x - size / 2, p.y - size / 2, size, size)
        }

        // sortie d'écran : on réapparaît de l'autre côté
        const m = p.kind === 'mist' ? p.r * 2 : 20
        if (p.x > w + m) p.x = -m
        else if (p.x < -m) p.x = w + m
        if (p.kind !== 'embers') {
          if (p.y < -m) p.y = h + m
          else if (p.y > h + m) p.y = -m
        }
      }

      if (birds.length) {
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 0.75
        ctx.strokeStyle = 'rgba(40,28,22,1)'
        ctx.lineCap = 'round'
        for (const b of birds) {
          b.x += b.v * dt
          b.y += Math.sin(t * 0.8 + b.ph) * 4 * dt
          if (b.x > w + 30) {
            b.x = -30
            b.y = rand(h * 0.1, h * 0.34)
          }
          ctx.lineWidth = 1.6 * b.s
          drawBird(ctx, b, t)
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (raf || !visible || document.hidden || !w) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting)
        if (visible) start()
      },
      { threshold: 0.05 },
    )
    const ro = new ResizeObserver(() => {
      resize()
      start()
    })
    const onVisibility = () => start()

    resize()
    io.observe(host)
    ro.observe(host)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [variant, night, rain])

  return <canvas ref={ref} className="stage__fx" aria-hidden="true" />
}
