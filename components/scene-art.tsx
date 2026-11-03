import { SceneStage } from '@/components/scene-stage'
import type { SceneVariant } from '@/lib/types'

export type SceneFocus = 'animals' | 'person' | 'storyteller'

interface SceneArtProps {
  variant: SceneVariant
  night?: boolean
  rain?: boolean
  focus?: SceneFocus
  label?: string
  className?: string
  /** Mouvement de caméra lent (pour les grands visuels). */
  cinematic?: boolean
  /** Image facultative affichée par-dessus l'illustration si le fichier existe. */
  image?: string
}

/* ---------- utilitaires ---------- */

function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t)
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`
}

/** Générateur pseudo-aléatoire déterministe : même rendu serveur / client. */
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const STARS = (() => {
  const rnd = seeded(42)
  return Array.from({ length: 70 }, () => ({
    x: Math.round(rnd() * 800),
    y: Math.round(rnd() * 230),
    r: Math.round((0.7 + rnd() * 1.6) * 10) / 10,
    d: Math.round(rnd() * 40) / 10,
  }))
})()

const RAIN = (() => {
  const rnd = seeded(7)
  return Array.from({ length: 46 }, () => ({
    x: Math.round(rnd() * 820),
    d: Math.round(rnd() * 10) / 10,
    l: 18 + Math.round(rnd() * 16),
  }))
})()

const SKY: Record<SceneVariant, { day: [string, string]; night: [string, string] }> = {
  savane: { day: ['#f7d9a4', '#ee9c5e'], night: ['#0c1030', '#59305a'] },
  mare: { day: ['#cfe3dc', '#f4e2b8'], night: ['#070b26', '#2b2a5c'] },
  dune: { day: ['#f9dca8', '#ec9a56'], night: ['#0a0e2a', '#6b3358'] },
  cascade: { day: ['#cfe8e0', '#f7e7be'], night: ['#0c1630', '#2f4a63'] },
  village: { day: ['#aeb7c4', '#e6d3b4'], night: ['#0b0f2c', '#5a2a50'] },
  foret: { day: ['#e7e3b4', '#f4cf8a'], night: ['#08122a', '#26435a'] },
}

/* ---------- figures ---------- */

function Person({ x, y, s = 1, fill, staff = false }: { x: number; y: number; s?: number; fill: string; staff?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <circle cx="0" cy="-62" r="14" />
      <path d="M-26 0 Q-26 -46 0 -50 Q26 -46 26 0Z" />
      {staff && <rect x="30" y="-84" width="4" height="84" rx="2" />}
    </g>
  )
}

function Hare({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y})`} fill={fill}>
      <ellipse cx="0" cy="-12" rx="24" ry="14" />
      <circle cx="26" cy="-22" r="10" />
      <ellipse cx="28" cy="-44" rx="4" ry="15" transform="rotate(-6 28 -30)" />
      <ellipse cx="37" cy="-43" rx="4" ry="14" transform="rotate(10 37 -30)" />
      <circle cx="-26" cy="-14" r="6" />
    </g>
  )
}

function Hyena({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y})`} fill={fill} stroke={fill} strokeWidth="5" strokeLinecap="round">
      <ellipse cx="0" cy="-26" rx="38" ry="17" stroke="none" />
      <ellipse cx="-40" cy="-20" rx="14" ry="12" stroke="none" />
      <path d="M-50 -38 L-44 -52 L-38 -36Z M-40 -36 L-32 -50 L-28 -32Z" stroke="none" />
      <path d="M-24 -14 L-26 0 M-8 -12 L-8 0 M16 -12 L16 0 M32 -14 L34 0" fill="none" />
      <path d="M36 -30 L52 -20" fill="none" />
    </g>
  )
}

function Flame({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-24 0 L28 -14" stroke="#3b2418" strokeWidth="9" strokeLinecap="round" />
      <path d="M-24 -14 L28 0" stroke="#4a2c1b" strokeWidth="9" strokeLinecap="round" />
      <path className="sa-flame" d="M0 -6 C-24 -20 -24 -44 -10 -62 C-10 -50 -4 -48 0 -56 C8 -70 2 -82 6 -96 C28 -76 34 -34 0 -6Z" fill="#e8501a" />
      <path className="sa-flame sa-flame--b" d="M0 -6 C-14 -16 -12 -34 -2 -46 C0 -38 5 -38 6 -46 C20 -30 18 -14 0 -6Z" fill="#ffa21f" />
      <path className="sa-flame sa-flame--c" d="M0 -6 C-7 -12 -6 -22 0 -28 C6 -22 7 -12 0 -6Z" fill="#ffe27a" />
    </g>
  )
}

/* ---------- composition ---------- */

export function SceneArt({ variant, night = false, rain = false, focus, label, className, cinematic = false, image }: SceneArtProps) {
  // id déterministe : deux scènes identiques partagent des dégradés identiques (aucun conflit).
  const uid = `sa-${variant}-${night ? 'n' : 'd'}`
  const [skyTop, skyBottom] = night ? SKY[variant].night : SKY[variant].day
  const dark = (c: string) => (night ? mix(c, '#12173f', 0.66) : c)
  const figure = dark('#2a1a16')
  const fg = focus ?? (variant === 'savane' ? 'animals' : 'person')

  return (
    <SceneStage variant={variant} night={night} rain={rain} cinematic={cinematic} image={image}>
    <svg
      className={`scene ${className ?? ''}`}
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid slice"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="1" stopColor={skyBottom} />
        </linearGradient>
        <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={dark('#5f8f8a')} />
          <stop offset="1" stopColor={dark('#1f4a52')} />
        </linearGradient>
        <linearGradient id={`${uid}-cliff`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={dark('#6f4630')} />
          <stop offset="0.6" stopColor={dark('#9a6340')} />
          <stop offset="1" stopColor={dark('#b9794a')} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffb347" stopOpacity=".7" />
          <stop offset="1" stopColor="#e8641e" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="450" fill={`url(#${uid}-sky)`} />

      {/* astre */}
      {night ? (
        <>
          <g fill="#fff6d8">
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} className="sa-twinkle" style={{ animationDelay: `-${s.d}s` }} />
            ))}
          </g>
          <circle cx="640" cy="88" r="30" fill="#f6e6b4" />
          <circle cx="654" cy="78" r="27" fill={skyTop} />
        </>
      ) : (
        <>
          <circle cx="580" cy="118" r="86" fill="#fff3cf" opacity=".28" />
          <circle cx="580" cy="118" r="54" fill={variant === 'village' ? '#e9e4d8' : '#ffe2a0'} />
        </>
      )}

      {variant === 'savane' && (
        <>
          <path d="M0 300 Q200 250 420 290 T800 280 V450H0Z" fill={dark('#d89a5a')} />
          <path d="M0 345 Q250 305 500 338 T800 330 V450H0Z" fill={dark('#b3703c')} />
          <path d="M0 392 Q300 372 800 394 V450H0Z" fill={dark('#7d4a2a')} />
          <rect x="240" y="270" width="12" height="118" rx="6" fill={dark('#3b2a1c')} />
          <g className="sa-sway" fill={dark('#3f5b3a')}>
            <ellipse cx="246" cy="262" rx="112" ry="26" />
            <ellipse cx="190" cy="274" rx="62" ry="18" />
            <ellipse cx="306" cy="274" rx="66" ry="18" />
          </g>
          {fg === 'animals' && (
            <>
              <Hare x={470} y={396} fill={figure} />
              <Hyena x={640} y={398} fill={figure} />
            </>
          )}
          {fg === 'person' && <Person x={470} y={398} s={1.1} fill={figure} />}
          {fg === 'storyteller' && (
            <>
              <Person x={470} y={402} s={1.5} fill={dark('#bd4630')} />
              <circle cx="470" cy="312" r="21" fill={dark('#51352a')} />
              <ellipse cx="520" cy="396" rx="26" ry="16" fill={dark('#c8893e')} transform="rotate(-18 520 396)" />
            </>
          )}
        </>
      )}

      {variant === 'mare' && (
        <>
          <path d="M0 270 Q200 230 420 262 T800 255 V450H0Z" fill={dark('#2f4a3c')} />
          <path d="M0 300 Q300 285 800 300 V450H0Z" fill={dark('#1f3a2f')} />
          <rect x="0" y="318" width="800" height="132" fill={`url(#${uid}-water)`} />
          <ellipse cx="640" cy="352" rx="38" ry="9" fill="#f6e6b4" opacity=".35" />
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx="420" cy="372" rx="30" ry="8" fill="none" stroke="#e6f3ef" strokeWidth="2" className="sa-ripple" style={{ animationDelay: `${i * 1.2}s` }} />
          ))}
          <path className="sa-float" d="M300 400 q22 -26 46 -8 q-12 4 -16 18 q-16 -14 -30 -10Z" fill="#cfd8d4" opacity=".6" />
          <g fill={dark('#2a3b24')} stroke={dark('#2a3b24')} strokeWidth="4" strokeLinecap="round">
            {[60, 90, 120, 700, 730, 760].map((x, i) => (
              <path key={x} d={`M${x} 330 C${x + (i % 2 ? 8 : -8)} 290 ${x} 262 ${x + 6} 238`} fill="none" className="sa-sway" />
            ))}
          </g>
          <Person x={170} y={330} s={1} fill={figure} staff />
        </>
      )}

      {variant === 'dune' && (
        <>
          <path d="M0 330 Q150 270 320 322 T640 300 T800 322 V450H0Z" fill={dark('#d9a063')} />
          <path d="M0 382 Q200 322 420 372 T800 352 V450H0Z" fill={dark('#bd7e45')} />
          <path d="M0 424 Q250 392 520 416 T800 406 V450H0Z" fill={dark('#8f5a34')} />
          <g fill="none" stroke="#fff3cf" strokeWidth="2" opacity=".35" strokeDasharray="30 50">
            <path className="sa-drift" d="M0 352 Q200 308 420 350 T800 332" />
            <path className="sa-drift sa-drift--b" d="M0 400 Q250 366 520 394 T800 386" />
          </g>
          <Person x={540} y={372} s={0.9} fill={figure} staff />
          <g fill={figure}>
            {[330, 362, 394].map((x) => (
              <ellipse key={x} cx={x} cy={404} rx="13" ry="7" />
            ))}
          </g>
        </>
      )}

      {variant === 'cascade' && (
        <>
          <path d="M0 330 Q200 300 400 320 T800 312 V450H0Z" fill={dark('#6f8f5a')} />
          <path d="M250 130 L560 130 L586 450 L228 450Z" fill={`url(#${uid}-cliff)`} />
          <g stroke={dark('#5a3828')} strokeWidth="2" opacity=".5">
            <path d="M246 190 L572 190 M240 250 L578 250 M234 320 L582 320" />
          </g>
          <g fill={dark('#4f7a46')}>
            {[270, 330, 410, 490, 540].map((x) => (
              <circle key={x} cx={x} cy={126} r={22 + (x % 3) * 4} />
            ))}
          </g>
          <g stroke="#f4fbff" strokeWidth="9" strokeLinecap="round" opacity=".85">
            {[360, 392, 424, 452].map((x, i) => (
              <path key={x} d={`M${x} 140 L${x + (i % 2 ? 3 : -3)} 390`} strokeDasharray="26 14" className="sa-flow" style={{ animationDelay: `-${i * 0.35}s` }} />
            ))}
          </g>
          <ellipse className="sa-float" cx="410" cy="396" rx="120" ry="26" fill="#ffffff" opacity=".4" />
          <ellipse cx="410" cy="420" rx="260" ry="24" fill={dark('#4a8a92')} opacity=".7" />
          <g fill={dark('#3f5b3a')}>
            <rect x="96" y="320" width="10" height="70" />
            <circle cx="101" cy="304" r="40" />
            <rect x="690" y="330" width="10" height="64" />
            <circle cx="695" cy="314" r="36" />
          </g>
          <Person x={286} y={134} s={0.55} fill={figure} />
        </>
      )}

      {variant === 'village' && (
        <>
          <path d="M0 310 Q250 280 520 306 T800 296 V450H0Z" fill={dark('#6b4a38')} />
          <path d="M0 392 Q300 372 800 396 V450H0Z" fill={dark('#3b2a22')} />
          {[130, 330, 650].map((x, i) => (
            <g key={x}>
              <rect x={x - 46} y={296 + i * 4} width="92" height={70 - i * 4} fill={dark('#a56a43')} />
              <path d={`M${x - 62} ${298 + i * 4} L${x} ${236 + i * 4} L${x + 62} ${298 + i * 4}Z`} fill={dark('#caa263')} />
              <rect x={x - 11} y={326 + i * 4} width="22" height={40 - i * 4} fill={dark('#2a1a16')} />
            </g>
          ))}
          {rain ? (
            <>
              <g fill="#5c6678" opacity=".85">
                <ellipse cx="200" cy="80" rx="120" ry="34" />
                <ellipse cx="320" cy="64" rx="100" ry="30" />
                <ellipse cx="560" cy="90" rx="130" ry="36" />
              </g>
              <g stroke="#dbe9f4" strokeWidth="2" opacity=".6">
                {RAIN.map((r, i) => (
                  <path key={i} d={`M${r.x} 0 l-8 ${r.l}`} className="sa-rain" style={{ animationDelay: `-${r.d}s` }} />
                ))}
              </g>
              {/* danseur masqué */}
              <g fill={dark('#2f5a38')} transform="translate(470 396)">
                <path d="M-22 0 L-30 -56 L30 -56 L22 0Z" />
                <ellipse cx="0" cy="-88" rx="17" ry="34" fill={dark('#3f7a4a')} />
                <path d="M0 -118 V-58" stroke={dark('#1f3a28')} strokeWidth="2" />
              </g>
            </>
          ) : (
            <>
              <ellipse className="sa-glow" cx="470" cy="392" rx="230" ry="100" fill={`url(#${uid}-glow)`} />
              <Flame x={470} y={400} scale={1.15} />
              <Person x={366} y={406} s={0.9} fill={figure} />
              <Person x={580} y={408} s={0.95} fill={figure} />
              <ellipse cx="520" cy="404" rx="20" ry="12" fill={dark('#c8893e')} transform="rotate(-14 520 404)" />
            </>
          )}
        </>
      )}

      {variant === 'foret' && (
        <>
          <path d="M0 300 Q200 270 420 296 T800 286 V450H0Z" fill={dark('#6f8f4f')} />
          <g fill={dark('#3f6b3f')}>
            {[40, 130, 230, 600, 690, 770].map((x, i) => (
              <g key={x}>
                <rect x={x - 6} y={250 - (i % 3) * 14} width="12" height="130" fill={dark('#3b2a1c')} />
                <circle cx={x} cy={236 - (i % 3) * 14} r={46 + (i % 2) * 8} />
              </g>
            ))}
          </g>
          <rect x="296" y="236" width="272" height="170" fill={dark('#caa05a')} />
          <g stroke={dark('#8a6a34')} strokeWidth="2" opacity=".7">
            <path d="M296 276 H568 M296 316 H568 M296 356 H568" />
            <path d="M344 236 V276 M420 236 V276 M496 236 V276 M320 276 V316 M392 276 V316 M468 276 V316 M540 276 V316 M344 316 V356 M420 316 V356 M496 316 V356 M320 356 V406 M392 356 V406 M468 356 V406 M540 356 V406" />
          </g>
          <rect x="414" y="296" width="44" height="110" rx="4" fill={dark('#1a120d')} />
          <path d="M0 406 Q300 392 800 410 V450H0Z" fill={dark('#3b2a22')} />
          <g fill="#fff3a0">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} cx={150 + i * 110} cy={330 + (i % 3) * 20} r="3" className="sa-float" style={{ animationDelay: `-${i * 0.7}s` }} />
            ))}
          </g>
          <Person x={236} y={408} s={1} fill={figure} staff />
        </>
      )}
    </svg>
    </SceneStage>
  )
}
