'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { saveQuizScore, useProgress } from '@/lib/progress'
import type { Story } from '@/lib/types'

export function Quiz({ story }: { story: Story }) {
  const questions = story.quiz
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const best = useProgress().quiz[story.slug]

  const q = questions[index]

  function choose(i: number) {
    if (picked !== null) return
    setPicked(i)
    if (i === q.answer) setScore((s) => s + 1)
  }

  function next() {
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      setPicked(null)
    } else {
      saveQuizScore(story.slug, score)
      setDone(true)
    }
  }

  function restart() {
    setIndex(0)
    setPicked(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <section className="quiz quiz--result" aria-live="polite">
        <p className="eyebrow"><span /> RÉSULTAT</p>
        <h3>
          {score} / {questions.length}
        </h3>
        <p>
          {score === questions.length
            ? 'Sans faute : tu écoutes comme un vrai griot.'
            : score >= 2
              ? 'Bien joué ! Relis le conte pour attraper le dernier détail.'
              : 'Pas de souci, les contes se réécoutent. Retente après une nouvelle lecture.'}
        </p>
        <button type="button" className="btn btn--ghost" onClick={restart}>
          <RotateCcw aria-hidden="true" /> Refaire le quiz
        </button>
      </section>
    )
  }

  return (
    <section className="quiz" aria-labelledby="quiz-title">
      <header className="quiz__head">
        <div>
          <p className="eyebrow"><span /> QUIZ</p>
          <h3 id="quiz-title">As-tu bien écouté ?</h3>
        </div>
        <p className="quiz__step">
          Question {index + 1}/{questions.length}
          {best !== undefined && <span> · meilleur score {best}/{questions.length}</span>}
        </p>
      </header>

      <p className="quiz__question">{q.question}</p>
      <div className="quiz__options" role="group" aria-label="Réponses possibles">
        {q.options.map((opt, i) => {
          const state = picked === null ? '' : i === q.answer ? 'is-right' : i === picked ? 'is-wrong' : 'is-dim'
          return (
            <button key={opt} type="button" className={`option ${state}`} onClick={() => choose(i)} aria-disabled={picked !== null}>
              <span>{opt}</span>
              {state === 'is-right' && <Check aria-label="Bonne réponse" />}
              {state === 'is-wrong' && <X aria-label="Mauvaise réponse" />}
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <div className="quiz__feedback" role="status">
          <p>{q.explanation}</p>
          <button type="button" className="btn" onClick={next}>
            {index + 1 < questions.length ? 'Question suivante' : 'Voir mon résultat'}
          </button>
        </div>
      )}
    </section>
  )
}
