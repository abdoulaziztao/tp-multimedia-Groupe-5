'use client'

import { Award, BookMarked } from 'lucide-react'
import { computeBadges, resetProgress, useProgress } from '@/lib/progress'

export function Carnet({ total }: { total: number }) {
  const progress = useProgress()
  const badges = computeBadges(progress, total)
  const earned = badges.filter((b) => b.earned).length
  const heard = progress.heard.length

  return (
    <section className="carnet" aria-labelledby="carnet-title">
      <div className="carnet__top">
        <BookMarked aria-hidden="true" />
        <div>
          <h3 id="carnet-title">Ton carnet du griot</h3>
          <p>
            {heard}/{total} contes terminés · {earned}/{badges.length} badges
          </p>
        </div>
      </div>
      <div className="carnet__bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={heard} aria-label="Contes terminés">
        <span style={{ width: `${(heard / total) * 100}%` }} />
      </div>
      <ul className="carnet__badges">
        {badges.map((b) => (
          <li key={b.id} className={b.earned ? 'is-earned' : ''} title={b.description}>
            <Award aria-hidden="true" />
            <span>{b.label}</span>
            <small>{b.earned ? 'Obtenu' : b.description}</small>
          </li>
        ))}
      </ul>
      {heard > 0 && (
        <button type="button" className="link-button" onClick={resetProgress}>
          Réinitialiser ma progression
        </button>
      )}
    </section>
  )
}
