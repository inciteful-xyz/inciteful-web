const DEFAULT_TITLE = 'Inciteful'
const SITE_URL = 'https://inciteful.xyz'

function setTitle (title: string) {
  document.title = (title || DEFAULT_TITLE) + ' | Inciteful.xyz'
}
function setDescription (description: string) {
  if (document != null) {
    const d = document.querySelector('meta[name="description"]')

    if (d != null) {
      d.setAttribute('content', description)
    }
  }
}

function setCanonical (path: string) {
  if (document != null) {
    const canonicalUrl = `${SITE_URL}${path}`
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement

    if (link) {
      link.setAttribute('href', canonicalUrl)
    } else {
      link = document.createElement('link')
      link.rel = 'canonical'
      link.href = canonicalUrl
      document.head.appendChild(link)
    }
  }
}

export default {
  setTitle,
  setDescription,
  setCanonical
}
