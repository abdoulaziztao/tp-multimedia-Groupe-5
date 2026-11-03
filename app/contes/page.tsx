import type { Metadata } from 'next'
import { StoryCatalog } from '@/components/story-catalog'
import { STORIES } from '@/lib/stories'

export const metadata: Metadata = {
  title: 'Les contes',
  description: 'Catalogue des contes et légendes du Burkina Faso : recherche par région, culture ou langue de tradition.',
}

export default function StoriesPage() {
  return (
    <section className="page">
      <header className="page__head">
        <p className="eyebrow"><span /> CATALOGUE</p>
        <h1>
          Les contes du <em>Burkina</em>
        </h1>
        <p>Huit récits, huit régions. Chaque conte se lit, s’écoute, se joue et se révise.</p>
      </header>
      <StoryCatalog stories={STORIES} />
    </section>
  )
}
