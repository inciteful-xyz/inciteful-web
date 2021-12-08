const DEFAULT_TITLE = 'Inciteful'

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

export default {
  setTitle,
  setDescription
}
