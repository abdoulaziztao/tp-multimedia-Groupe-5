'use client'

import { useEffect, useRef } from 'react'
import type { Map as MapLibreMap, MapOptions, Marker } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Story } from '@/lib/types'

export type MapView = '2d' | '3d'
export type Basemap = 'plan' | 'satellite'

interface StoryMapProps {
  stories: Story[]
  selectedSlug: string | null
  highlightRegion: string | null
  view: MapView
  basemap: Basemap
  onSelectStory: (slug: string) => void
  onSelectRegion: (region: string) => void
  onUnavailable: (reason: string) => void
}

type StyleSpec = Exclude<MapOptions['style'], string | undefined>

const BURKINA_BOUNDS: [[number, number], [number, number]] = [
  [-5.6, 9.3],
  [2.5, 15.2],
]

const FR_LOCALE: Record<string, string> = {
  'NavigationControl.ResetBearing': 'Remettre le nord en haut',
  'NavigationControl.ZoomIn': 'Zoom avant',
  'NavigationControl.ZoomOut': 'Zoom arrière',
  'ScaleControl.Meters': 'm',
  'ScaleControl.Kilometers': 'km',
  'AttributionControl.ToggleAttribution': 'Afficher les crédits',
  'AttributionControl.MapFeedback': 'Retour sur la carte',
  'CooperativeGesturesHandler.WindowsHelpText': 'Utilisez Ctrl + molette pour zoomer la carte',
  'CooperativeGesturesHandler.MacHelpText': 'Utilisez ⌘ + molette pour zoomer la carte',
  'CooperativeGesturesHandler.MobileHelpText': 'Utilisez deux doigts pour déplacer la carte',
}

function buildStyle(): StyleSpec {
  return {
    version: 8,
    sources: {
      plan: {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
        maxzoom: 18,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · © <a href="https://carto.com/attributions">CARTO</a>',
      },
      satellite: {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        maxzoom: 17,
        attribution: 'Imagerie © Esri, Maxar, Earthstar Geographics',
      },
      dem: {
        type: 'raster-dem',
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 14,
        attribution: 'Relief : Mapzen / AWS Terrain Tiles',
      },
      // Source distincte pour l'ombrage : MapLibre recommande de ne pas partager celle du terrain 3D.
      'dem-shade': {
        type: 'raster-dem',
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 14,
      },
    },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': '#e9e2d3' } },
      { id: 'plan', type: 'raster', source: 'plan' },
      { id: 'satellite', type: 'raster', source: 'satellite', layout: { visibility: 'none' } },
      {
        id: 'hillshade',
        type: 'hillshade',
        source: 'dem-shade',
        paint: {
          'hillshade-exaggeration': 0.55,
          'hillshade-shadow-color': '#5a4636',
          'hillshade-highlight-color': '#fff6e6',
        },
      },
    ],
    sky: {
      'sky-color': '#9fc7dc',
      'horizon-color': '#f4e2c4',
      'fog-color': '#f4efe6',
      'sky-horizon-blend': 0.6,
      'horizon-fog-blend': 0.7,
      'fog-ground-blend': 0.35,
    },
  } as StyleSpec
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function StoryMap({
  stories,
  selectedSlug,
  highlightRegion,
  view,
  basemap,
  onSelectStory,
  onSelectRegion,
  onUnavailable,
}: StoryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const readyRef = useRef(false)
  const markersRef = useRef<Map<string, { marker: Marker; el: HTMLButtonElement }>>(new Map())

  // Dernières valeurs, lues par les callbacks de la carte sans la recréer.
  const latest = useRef({ view, basemap, selectedSlug, highlightRegion, stories, onSelectStory, onSelectRegion })
  latest.current = { view, basemap, selectedSlug, highlightRegion, stories, onSelectStory, onSelectRegion }

  /* ---- création de la carte (une seule fois) ---- */
  useEffect(() => {
    let cancelled = false
    const container = containerRef.current
    if (!container) return

    ;(async () => {
      const maplibre = await import('maplibre-gl')
      if (cancelled) return
      // Le worker est servi depuis /public (voir scripts/copy-maplibre-worker.mjs).
      maplibre.setWorkerUrl('/vendor/maplibre-gl-worker.mjs')

      let map: MapLibreMap
      try {
        map = new maplibre.Map({
          container,
          style: buildStyle(),
          bounds: BURKINA_BOUNDS,
          fitBoundsOptions: { padding: 24 },
          maxBounds: [
            [-9, 6.5],
            [6, 17.5],
          ],
          minZoom: 4.5,
          maxPitch: 75,
          cooperativeGestures: true,
          attributionControl: { compact: true },
          locale: FR_LOCALE,
        })
      } catch {
        onUnavailable("Ton navigateur ne peut pas afficher la carte WebGL. Utilise la liste des régions ci-dessous.")
        return
      }
      mapRef.current = map
      map.addControl(new maplibre.NavigationControl({ visualizePitch: true }), 'bottom-right')
      map.addControl(new maplibre.ScaleControl({ unit: 'metric', maxWidth: 90 }), 'bottom-left')

      map.on('load', async () => {
        if (cancelled) return
        const l = latest.current

        // Régions administratives (polygones cliquables).
        map.addSource('regions', { type: 'geojson', data: '/data/regions.geojson' })
        const colorMatch: unknown[] = ['match', ['get', 'name']]
        l.stories.forEach((s) => colorMatch.push(s.region, s.color))
        colorMatch.push('#8d8577')
        map.addLayer({
          id: 'regions-fill',
          type: 'fill',
          source: 'regions',
          paint: {
            'fill-color': colorMatch as never,
            'fill-opacity': ['case', ['in', ['get', 'name'], ['literal', l.stories.map((s) => s.region)]], 0.22, 0.05],
          },
        })
        map.addLayer({
          id: 'regions-line',
          type: 'line',
          source: 'regions',
          paint: { 'line-color': '#4a3b2c', 'line-opacity': 0.45, 'line-width': 1 },
        })
        map.addLayer({
          id: 'regions-highlight',
          type: 'line',
          source: 'regions',
          filter: ['==', ['get', 'name'], l.highlightRegion ?? ''],
          paint: { 'line-color': '#c95432', 'line-width': 3 },
        })

        map.on('click', 'regions-fill', (e) => {
          const name = e.features?.[0]?.properties?.name as string | undefined
          if (name) latest.current.onSelectRegion(name)
        })
        map.on('mouseenter', 'regions-fill', () => (map.getCanvas().style.cursor = 'pointer'))
        map.on('mouseleave', 'regions-fill', () => (map.getCanvas().style.cursor = ''))

        // Marqueurs : de vrais <button>, donc accessibles au clavier et aux lecteurs d'écran.
        l.stories.forEach((story) => {
          const el = document.createElement('button')
          el.type = 'button'
          el.className = 'faso-pin'
          el.style.setProperty('--pin-color', story.color)
          el.setAttribute('aria-label', `${story.title} — ${story.city}, région ${story.region}`)
          el.innerHTML = `<span class="faso-pin__head"><b></b></span><span class="faso-pin__label">${story.city}</span>`
          el.addEventListener('click', (ev) => {
            ev.stopPropagation()
            latest.current.onSelectStory(story.slug)
          })
          const marker = new maplibre.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([story.coords.lng, story.coords.lat])
            .addTo(map)
          markersRef.current.set(story.slug, { marker, el })
        })

        readyRef.current = true
        applyView(map, latest.current.view, true)
        applyBasemap(map, latest.current.basemap)
        applySelection(latest.current.selectedSlug, latest.current.highlightRegion)
      })
    })()

    const markers = markersRef.current
    return () => {
      cancelled = true
      readyRef.current = false
      markers.forEach(({ marker }) => marker.remove())
      markers.clear()
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function applyView(map: MapLibreMap, v: MapView, instant = false) {
    const duration = instant || prefersReducedMotion() ? 0 : 1400
    if (v === '3d') {
      map.setTerrain({ source: 'dem', exaggeration: 3 })
      map.easeTo({ pitch: 58, bearing: -14, duration })
    } else {
      map.easeTo({ pitch: 0, bearing: 0, duration })
      window.setTimeout(() => map.setTerrain(null), duration)
    }
  }

  function applyBasemap(map: MapLibreMap, b: Basemap) {
    map.setLayoutProperty('plan', 'visibility', b === 'plan' ? 'visible' : 'none')
    map.setLayoutProperty('satellite', 'visibility', b === 'satellite' ? 'visible' : 'none')
    map.setPaintProperty('hillshade', 'hillshade-exaggeration', b === 'plan' ? 0.55 : 0.25)
  }

  function applySelection(slug: string | null, region: string | null) {
    const map = mapRef.current
    markersRef.current.forEach(({ el }, key) => {
      el.classList.toggle('is-selected', key === slug)
      el.setAttribute('aria-pressed', String(key === slug))
    })
    if (map && map.getLayer('regions-highlight')) {
      map.setFilter('regions-highlight', ['==', ['get', 'name'], region ?? ''])
    }
  }

  /* ---- synchronisation avec l'état React ---- */
  useEffect(() => {
    const map = mapRef.current
    if (map && readyRef.current) applyView(map, view)
  }, [view])

  useEffect(() => {
    const map = mapRef.current
    if (map && readyRef.current) applyBasemap(map, basemap)
  }, [basemap])

  useEffect(() => {
    applySelection(selectedSlug, highlightRegion)
    const map = mapRef.current
    const story = stories.find((s) => s.slug === selectedSlug)
    if (map && readyRef.current && story) {
      map.flyTo({
        center: [story.coords.lng, story.coords.lat],
        zoom: 7.6,
        pitch: view === '3d' ? 58 : 0,
        bearing: view === '3d' ? -14 : 0,
        duration: prefersReducedMotion() ? 0 : 1800,
        essential: false,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug, highlightRegion])

  return <div ref={containerRef} className="map-canvas" role="region" aria-label="Carte interactive du Burkina Faso" />
}
