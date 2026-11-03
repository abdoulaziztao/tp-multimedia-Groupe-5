'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const NAV = [
  { href: '/', label: 'Explorer' },
  { href: '/contes', label: 'Les contes' },
  { href: '/langues', label: 'Les langues' },
  { href: '/contribuer', label: 'Contribuer' },
  { href: '/a-propos', label: 'À propos' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Faso, récits vivants — accueil">
        <span className="brand__mark" aria-hidden="true">✦</span>
        <span>
          <strong>FASO</strong>
          <small>RÉCITS VIVANTS</small>
        </span>
      </Link>
      <nav id="nav-principale" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Navigation principale">
        {NAV.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={active ? 'active' : ''}>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <button
        type="button"
        className="menu-button"
        aria-expanded={open}
        aria-controls="nav-principale"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  )
}
