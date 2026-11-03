import type { MetadataRoute } from 'next'
import { STORIES } from '@/lib/stories'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  const pages = ['', '/contes', '/langues', '/contribuer', '/a-propos'].map((p) => ({ url: `${base}${p}`, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 }))
  const stories = STORIES.map((s) => ({ url: `${base}/contes/${s.slug}`, changeFrequency: 'yearly' as const, priority: 0.8 }))
  return [...pages, ...stories]
}
