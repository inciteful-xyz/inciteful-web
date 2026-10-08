import { SITE_NAME, buildUrl } from './config'

function setTitle (title: string) {
  document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME
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
    const canonicalUrl = buildUrl(path)
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
