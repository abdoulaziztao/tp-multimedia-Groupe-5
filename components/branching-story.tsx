'use client'

import { useMemo, useState } from 'react'
import { RotateCcw, Sparkles } from 'lucide-react'
import { saveEnding, useProgress } from '@/lib/progress'
import type { Story } from '@/lib/types'

const TONE_LABEL = { sage: 'Fin sage', equilibre: 'Fin équilibrée', risque: 'Fin risquée' } as const

export function BranchingStory({ story }: { story: Story }) {
  const { start, nodes } = story.branching
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])
  const totalEndings = useMemo(() => nodes.filter((n) => n.ending).length, [nodes])
  const [current, setCurrent] = useState(start)
  const [steps, setSteps] = useState(0)
  const progress = useProgress()
  const found = progress.endings[story.slug] ?? []
  const node = byId.get(current)

  if (!node) return null

  function go(to: string) {
    const next = byId.get(to)
    if (!next) return
    setCurrent(to)
    setSteps((s) => s + 1)
    if (next.ending) saveEnding(story.slug, next.id)
  }

  function restart() {
    setCurrent(start)
    setSteps(0)
  }

  return (
    <section className="branch" aria-labelledby="branch-title">
      <header className="branch__head">
        <div>
          <p className="eyebrow"><span /> HISTOIRE INTERACTIVE</p>
          <h3 id="branch-title">Et si c’était toi, le héros ?</h3>
        </div>
        <p className="branch__count" aria-live="polite">
          <Sparkles aria-hidden="true" /> {found.length}/{totalEndings} fins découvertes
        </p>
      </header>

      <div className="branch__card" aria-live="polite" key={node.id}>
        <p className="branch__text">{node.text}</p>

        {node.choices && (
          <div className="branch__choices">
            {node.choices.map((c) => (
              <button key={c.to} type="button" className="choice" onClick={() => go(c.to)}>
                {c.label}
              </button>
            ))}
          </div>
        )}

        {node.ending && (
          <div className={`ending ending--${node.ending.tone}`}>
            <span className="ending__tone">{TONE_LABEL[node.ending.tone]}</span>
            <h4>{node.ending.title}</h4>
            <p>{node.ending.lesson}</p>
            <button type="button" className="btn btn--ghost" onClick={restart}>
              <RotateCcw aria-hidden="true" /> Rejouer pour une autre fin
            </button>
          </div>
        )}
      </div>

      {!node.ending && steps > 0 && (
        <button type="button" className="link-button" onClick={restart}>
          Recommencer depuis le début
        </button>
      )}
    </section>
  )
}
