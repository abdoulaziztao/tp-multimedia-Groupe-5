'use client'

import { useEffect, useRef, useState } from 'react'
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { BookOpen, ChevronDown, Compass, Headphones, Menu, Pause, Play, Search, Volume2, X } from 'lucide-react'

const regions = [
  { name: 'Centre', city: 'Ouagadougou', tale: 'La hyène et le lièvre', story: 'Une ruse du lièvre pour rappeler que la sagesse triomphe de la force.', coords: [12.3714, -1.5197] as [number, number], color: '#db6b32', tag: 'SAGESSE' },
  { name: 'Hauts-Bassins', city: 'Bobo-Dioulasso', tale: 'Le génie de la mare sacrée', story: 'Au bord de l’eau, un pacte ancien protège les villages et leurs récoltes.', coords: [11.1771, -4.2979] as [number, number], color: '#b84d38', tag: 'MYSTÈRE' },
  { name: 'Sahel', city: 'Dori', tale: 'Le chant de la dune', story: 'Une histoire de voyage, de courage et de transmission sous les étoiles.', coords: [14.0354, -0.0345] as [number, number], color: '#c58a3a', tag: 'VOYAGE' },
  { name: 'Est', city: 'Fada N’Gourma', tale: 'La fille aux cauris', story: 'Une jeune fille trouve sa voie en écoutant les signes laissés par ses ancêtres.', coords: [12.0616, 0.3581] as [number, number], color: '#d78a42', tag: 'INITIATION' },
  { name: 'Cascades', city: 'Banfora', tale: 'Les larmes de la falaise', story: 'Une légende née du murmure des cascades et de la mémoire des griots.', coords: [10.6333, -4.7667] as [number, number], color: '#71905a', tag: 'NATURE' },
]

const languages = ['Mooré', 'Dioula', 'Fulfulde']

export default function Page() {
  const [selected, setSelected] = useState(regions[0])
  const [language, setLanguage] = useState('Mooré')
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(32)
  const [menuOpen, setMenuOpen] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<LeafletMap | null>(null)
  const markers = useRef<LeafletMarker[]>([])

  useEffect(() => {
    let mounted = true
    import('leaflet').then((L) => {
      if (!mounted || !mapRef.current || leafletMap.current) return
      const map = L.map(mapRef.current, { zoomControl: false, scrollWheelZoom: false }).setView([12.25, -1.7], 6)
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map)
      leafletMap.current = map
      markers.current = regions.map((region) => {
        const icon = L.divIcon({ className: 'custom-pin', html: `<span style="--pin-color:${region.color}"><b></b></span>`, iconSize: [28, 36], iconAnchor: [14, 34] })
        const marker = L.marker(region.coords, { icon }).addTo(map)
        marker.bindTooltip(region.name, { direction: 'top', offset: [0, -26] })
        marker.on('click', () => setSelected(region))
        return marker
      })
    })
    return () => { mounted = false; leafletMap.current?.remove(); leafletMap.current = null }
  }, [])

  useEffect(() => {
    if (!playing) return
    const interval = window.setInterval(() => setProgress((value) => value >= 100 ? 0 : value + 1), 180)
    return () => window.clearInterval(interval)
  }, [playing])

  const chooseRegion = (region: typeof regions[number]) => {
    setSelected(region)
    leafletMap.current?.flyTo(region.coords, 7, { duration: 1 })
  }

  return (
    <main className="site-shell">
      <div className="top-pattern" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#accueil" aria-label="Retour à l'accueil"><span className="brand-mark">✦</span><span><strong>FASO</strong><small>RÉCITS VIVANTS</small></span></a>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navigation principale"><a className="active" href="#explorer">Explorer</a><a href="#atlas">L'atlas</a><a href="#apropos">À propos</a></nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu">{menuOpen ? <X /> : <Menu />}</button>
        <button className="search-button" aria-label="Rechercher"><Search /></button>
      </header>

      <section className="hero" id="accueil"><div className="hero-copy"><p className="eyebrow"><span /> PATRIMOINE ORAL DU BURKINA FASO</p><h1>Écouter le pays<br /><em>raconter</em></h1><p className="hero-intro">Une collection vivante de contes, de voix et de légendes. Parcourez les régions et laissez-vous guider par les récits transmis de génération en génération.</p><a className="primary-button" href="#explorer">Commencer l’exploration <Compass /></a></div><div className="hero-art" aria-label="Illustration abstraite d'un conteur sous un arbre"><div className="sun" /><div className="tree tree-left" /><div className="tree tree-right" /><div className="storyteller"><div className="head" /><div className="body" /><div className="drum" /></div><div className="land" /></div></section>

      <section className="explorer-section" id="explorer"><div className="section-heading"><div><p className="eyebrow"><span /> CARTE DES RÉCITS</p><h2>Un territoire,<br /><em>mille histoires.</em></h2></div><p className="section-note">Cliquez sur un marqueur pour découvrir la voix d'une région et son conte.</p></div>
        <div className="explorer-grid"><div className="map-card map-card-3d"><div className="map-3d-badge">MODE 3D</div><div className="map-terrain-shadow" aria-hidden="true" /><div ref={mapRef} className="map" /><div className="map-label"><span className="live-dot" /> Carte interactive <small>Relief immersif · 5 régions</small></div></div><aside className="story-panel"><div className="panel-top"><span className="region-tag" style={{ backgroundColor: selected.color }}>{selected.tag}</span><span className="location"><Compass /> {selected.city}</span></div><h3>{selected.tale}</h3><p className="story-description">{selected.story}</p><div className="language-row"><label htmlFor="language">Écouter en</label><select id="language" value={language} onChange={(event) => setLanguage(event.target.value)}>{languages.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown className="select-icon" /></div><div className="audio-player"><div className="audio-meta"><button className="play-button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Mettre en pause' : 'Lire le conte'}>{playing ? <Pause /> : <Play fill="currentColor" />}</button><div><strong>La voix du griot</strong><span>{language} · Conte traditionnel</span></div><Volume2 className="volume-icon" /></div><div className="progress-wrap"><button className="progress-bar" onClick={() => setProgress(68)} aria-label="Avancer dans le récit"><span style={{ width: `${progress}%` }} /></button><div><small>0{Math.floor(progress / 10)}:{String(Math.floor(progress * 1.2) % 60).padStart(2, '0')}</small><small>03:42</small></div></div></div><div className="panel-footer"><BookOpen /> <span>Conte collecté auprès des anciens de {selected.city}</span></div></aside></div>
        <div className="region-list" aria-label="Régions disponibles">{regions.map((region) => <button key={region.name} className={selected.name === region.name ? 'region-chip selected' : 'region-chip'} onClick={() => chooseRegion(region)}><span style={{ backgroundColor: region.color }} />{region.name}<small>{region.city}</small></button>)}</div>
      </section>
      <footer id="apropos"><span>✦ FASO — RÉCITS VIVANTS</span><span>Un projet de valorisation du patrimoine oral burkinabè</span></footer>
    </main>
  )
}
