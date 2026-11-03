import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock, MapPin } from 'lucide-react'
import { SceneArt } from '@/components/scene-art'
import { StoryExperience } from '@/components/story-experience'
import { STORIES, getStory, readingMinutes } from '@/lib/stories'

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const story = getStory(slug)
  if (!story) return {}
  return {
    title: story.title,
    description: `${story.summary} Conte de la région ${story.region} (${story.city}), à lire, écouter et jouer.`,
    openGraph: { title: story.title, description: story.summary, type: 'article' },
  }
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = getStory(slug)
  if (!story) notFound()

  const index = STORIES.findIndex((s) => s.slug === slug)
  const prev = STORIES[(index - 1 + STORIES.length) % STORIES.length]
  const next = STORIES[(index + 1) % STORIES.length]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: story.title,
    inLanguage: 'fr',
    genre: 'Conte',
    about: `${story.culture}, ${story.region}, Burkina Faso`,
    description: story.summary,
  }

  return (
    <article className="story" style={{ ['--c' as string]: story.color }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="story__hero">
        <SceneArt
          variant={story.variant}
          night={story.night}
          rain={story.rain}
          focus={story.slug === 'la-fille-aux-cauris' ? 'person' : undefined}
          label={`Illustration animée du conte « ${story.title} »`}
        />
        <div className="story__shade" aria-hidden="true" />
        <div className="story__title">
          <Link href="/contes" className="back"><ArrowLeft aria-hidden="true" /> Tous les contes</Link>
          <span className="tag">{story.tag}</span>
          <h1>{story.title}</h1>
          <p>{story.summary}</p>
          <ul className="story__meta">
            <li><MapPin aria-hidden="true" /> {story.city}, {story.region}</li>
            <li><Clock aria-hidden="true" /> {readingMinutes(story)} min de lecture</li>
            <li>Tradition : {story.tradLanguage}</li>
          </ul>
        </div>
      </header>

      <div className="story__body">
        <StoryExperience story={story} />
      </div>

      <nav className="story__pager" aria-label="Contes voisins">
        <Link href={`/contes/${prev.slug}`}><ArrowLeft aria-hidden="true" /><span><small>Précédent</small>{prev.title}</span></Link>
        <Link href={`/contes/${next.slug}`}><span><small>Suivant</small>{next.title}</span><ArrowRight aria-hidden="true" /></Link>
      </nav>
    </article>
  )
}
