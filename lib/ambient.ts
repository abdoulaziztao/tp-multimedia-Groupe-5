import type { SceneVariant } from './types'

export type AmbientLayer = 'wind' | 'crickets' | 'water' | 'fire' | 'drum'

export const AMBIENT_BY_VARIANT: Record<SceneVariant, AmbientLayer[]> = {
  savane: ['wind', 'crickets'],
  mare: ['water', 'crickets'],
  dune: ['wind', 'drum'],
  cascade: ['water'],
  village: ['fire', 'drum', 'crickets'],
  foret: ['wind', 'crickets'],
}

export interface AmbientEngine {
  start: () => Promise<void>
  stop: () => void
}

/**
 * Ambiance sonore 100 % synthétisée (Web Audio) : aucun fichier à charger,
 * aucun droit d'auteur à gérer, et un rendu qui s'adapte au décor du conte.
 */
export function createAmbient(layers: AmbientLayer[]): AmbientEngine {
  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  const timers: number[] = []
  const stoppers: Array<() => void> = []

  function noiseBuffer(c: AudioContext, brown: boolean) {
    const buffer = c.createBuffer(1, c.sampleRate * 2, c.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1
      if (brown) {
        last = (last + 0.02 * white) / 1.02
        data[i] = last * 3.5
      } else data[i] = white
    }
    return buffer
  }

  function loopNoise(c: AudioContext, brown: boolean) {
    const src = c.createBufferSource()
    src.buffer = noiseBuffer(c, brown)
    src.loop = true
    src.start()
    stoppers.push(() => src.stop())
    return src
  }

  function addWind(c: AudioContext, out: AudioNode) {
    const src = loopNoise(c, true)
    const filter = c.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 420
    filter.Q.value = 0.6
    const gain = c.createGain()
    gain.gain.value = 0.55
    const lfo = c.createOscillator()
    lfo.frequency.value = 0.12
    const lfoGain = c.createGain()
    lfoGain.gain.value = 180
    lfo.connect(lfoGain).connect(filter.frequency)
    lfo.start()
    stoppers.push(() => lfo.stop())
    src.connect(filter).connect(gain).connect(out)
  }

  function addWater(c: AudioContext, out: AudioNode) {
    const src = loopNoise(c, false)
    const filter = c.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1400
    const gain = c.createGain()
    gain.gain.value = 0.16
    const lfo = c.createOscillator()
    lfo.frequency.value = 0.35
    const lfoGain = c.createGain()
    lfoGain.gain.value = 0.05
    lfo.connect(lfoGain).connect(gain.gain)
    lfo.start()
    stoppers.push(() => lfo.stop())
    src.connect(filter).connect(gain).connect(out)
  }

  function addCrickets(c: AudioContext, out: AudioNode) {
    const osc = c.createOscillator()
    osc.frequency.value = 4300
    const gain = c.createGain()
    gain.gain.value = 0.006
    const lfo = c.createOscillator()
    lfo.type = 'square'
    lfo.frequency.value = 11
    const lfoGain = c.createGain()
    lfoGain.gain.value = 0.006
    lfo.connect(lfoGain).connect(gain.gain)
    osc.connect(gain).connect(out)
    osc.start()
    lfo.start()
    stoppers.push(() => osc.stop(), () => lfo.stop())
  }

  function addFire(c: AudioContext, out: AudioNode) {
    const buffer = noiseBuffer(c, false)
    const rumble = loopNoise(c, true)
    const low = c.createGain()
    low.gain.value = 0.22
    rumble.connect(low).connect(out)
    timers.push(
      window.setInterval(() => {
        if (Math.random() < 0.35) return
        const src = c.createBufferSource()
        src.buffer = buffer
        const hp = c.createBiquadFilter()
        hp.type = 'highpass'
        hp.frequency.value = 1800 + Math.random() * 3000
        const g = c.createGain()
        const t = c.currentTime
        g.gain.setValueAtTime(0.0001, t)
        g.gain.exponentialRampToValueAtTime(0.12 * Math.random() + 0.03, t + 0.005)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05 + Math.random() * 0.06)
        src.connect(hp).connect(g).connect(out)
        src.start(t, Math.random())
        src.stop(t + 0.15)
      }, 130),
    )
  }

  function addDrum(c: AudioContext, out: AudioNode) {
    const pattern = [1, 0, 0.5, 0, 0.7, 0, 0.5, 0.35]
    let step = 0
    timers.push(
      window.setInterval(() => {
        const accent = pattern[step++ % pattern.length]
        if (!accent) return
        const t = c.currentTime
        const osc = c.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(accent > 0.6 ? 130 : 180, t)
        osc.frequency.exponentialRampToValueAtTime(55, t + 0.18)
        const g = c.createGain()
        g.gain.setValueAtTime(0.0001, t)
        g.gain.exponentialRampToValueAtTime(0.22 * accent, t + 0.01)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
        osc.connect(g).connect(out)
        osc.start(t)
        osc.stop(t + 0.4)
      }, 420),
    )
  }

  return {
    async start() {
      if (ctx) return
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new Ctor()
      await ctx.resume()
      master = ctx.createGain()
      master.gain.setValueAtTime(0, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5)
      master.connect(ctx.destination)
      for (const layer of layers) {
        if (layer === 'wind') addWind(ctx, master)
        if (layer === 'water') addWater(ctx, master)
        if (layer === 'crickets') addCrickets(ctx, master)
        if (layer === 'fire') addFire(ctx, master)
        if (layer === 'drum') addDrum(ctx, master)
      }
    },
    stop() {
      if (!ctx || !master) return
      const c = ctx
      timers.splice(0).forEach((id) => window.clearInterval(id))
      master.gain.cancelScheduledValues(c.currentTime)
      master.gain.setValueAtTime(master.gain.value, c.currentTime)
      master.gain.linearRampToValueAtTime(0, c.currentTime + 0.6)
      const toStop = stoppers.splice(0)
      window.setTimeout(() => {
        toStop.forEach((fn) => {
          try {
            fn()
          } catch {
            /* source déjà arrêtée */
          }
        })
        void c.close()
      }, 700)
      ctx = null
      master = null
    },
  }
}
