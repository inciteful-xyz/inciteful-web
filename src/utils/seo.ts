import { head } from './head'
import { Paper, Author } from '@/types/incitefulTypes'
import { SITE_NAME, buildUrl } from './config'

const DEFAULT_DESCRIPTION = 'Using citations to find the most relevant literature. Committed to open access, Inciteful uses the power of graph analysis to help you explore and find the most relevant academic literature.'
const DEFAULT_IMAGE = buildUrl('/og_profile.png')

/**
 * Set basic page metadata (title, description, OG tags)
 * Uses getActiveHead() to work outside of Vue setup() context
 */
export function setPageMeta(options: {
  title: string
  description?: string
  canonical?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
}) {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    canonical,
    image = DEFAULT_IMAGE,
    type = 'website',
    noindex = false
  } = options

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const canonicalUrl = canonical ? buildUrl(canonical) : undefined

  head.push({
    title: fullTitle,
    meta: [
      { name: 'description', content: description },
      // Open Graph
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:type', content: type },
      ...(canonicalUrl ? [{ property: 'og:url', content: canonicalUrl }] : []),
      { property: 'og:site_name', content: SITE_NAME },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      // Additional meta
      { name: 'robots', content: noindex ? 'noindex, follow' : 'index, follow' },
    ],
    ...(canonicalUrl ? { link: [{ rel: 'canonical', href: canonicalUrl }] } : {})
  })
}

/**
 * Generate author display string for meta tags
 */
function formatAuthors(authors: Author[]): string {
  if (!authors || authors.length === 0) return ''

  const authorNames = authors
    .slice(0, 5)
    .map(a => a.name)
    .join(', ')

  return authors.length > 5 ? `${authorNames}, et al.` : authorNames
}

/**
 * Set metadata for a paper page with structured data
 */
export function setPaperMeta(paper: Paper, options?: { noindex?: boolean }) {
  const authors = formatAuthors(paper.author)
  const title = paper.title || 'Academic Paper'
  const description = `${title} by ${authors}. Published ${paper.published_year}. Cited by ${paper.num_cited_by} papers. Explore this paper's citation network on Inciteful.`

  // Basic meta tags
  setPageMeta({
    title: title,
    description: description.substring(0, 160), // Keep under 160 chars
    canonical: `/p/${paper.id}`,
    type: 'article',
    noindex: options?.noindex
  })

  // Generate ScholarlyArticle structured data
  const structuredData = generateScholarlyArticleSchema(paper)

  head.push({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(structuredData)
      }
    ]
  })
}

/**
 * Generate Schema.org ScholarlyArticle JSON-LD
 */
function generateScholarlyArticleSchema(paper: Paper) {
  const authors = paper.author.map(author => ({
    '@type': 'Person',
    name: author.name,
    ...(author.institution && {
      affiliation: {
        '@type': 'Organization',
        name: author.institution.name
      }
    })
  }))

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: paper.title,
    name: paper.title,
    author: authors,
    datePublished: `${paper.published_year}-01-01`,
    url: buildUrl(`/p/${paper.id}`),
    isPartOf: paper.journal ? {
      '@type': 'Periodical',
      name: paper.journal,
      ...(paper.volume && { volumeNumber: paper.volume }),
      ...(paper.pages && { pagination: paper.pages })
    } : undefined
  }

  // Add DOI if available
  if (paper.doi) {
    schema.identifier = [
      {
        '@type': 'PropertyValue',
        propertyID: 'DOI',
        value: paper.doi
      }
    ]
    schema.sameAs = `https://doi.org/${paper.doi}`
  }

  // Add citation count as interactionStatistic
  if (paper.num_cited_by > 0) {
    schema.interactionStatistic = {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/Citation',
      userInteractionCount: paper.num_cited_by
    }
  }

  return schema
}

/**
 * Generate BreadcrumbList structured data
 */
export function setBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildUrl(item.url)
    }))
  }

  head.push({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(breadcrumbSchema)
      }
    ]
  })
}

/**
 * Set Organization structured data (for homepage)
 */
export function setOrganizationSchema() {
  const siteRoot = buildUrl('/')

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteRoot,
    logo: buildUrl('/logo.png'),
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      // Add social media URLs here when available
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${buildUrl('/search')}?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteRoot,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${buildUrl('/search')}?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  head.push({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(orgSchema)
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(websiteSchema)
      }
    ]
  })
}
