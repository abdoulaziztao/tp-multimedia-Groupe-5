import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import { SceneArt } from '@/components/scene-art'
import { readingMinutes } from '@/lib/stories'
import type { Story } from '@/lib/types'

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/contes/${story.slug}`} className="card" style={{ ['--c' as string]: story.color }}>
      <div className="card__art">
        <SceneArt variant={story.variant} night={story.night} rain={story.rain} focus={story.slug === 'la-fille-aux-cauris' ? 'person' : undefined} />
        <span className="tag">{story.tag}</span>
      </div>
      <div className="card__body">
        <p className="card__meta">
          {story.region} · {story.city}
        </p>
        <h3>{story.title}</h3>
        <p>{story.summary}</p>
        <div className="card__foot">
          <span><Clock aria-hidden="true" /> {readingMinutes(story)} min · {story.tradLanguage}</span>
          <ArrowUpRight aria-hidden="true" />
        </div>
      </div>
    </Link>
  )
}
