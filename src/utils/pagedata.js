const DEFAULT_TITLE = 'Inciteful'

function setTitle (title) {
  document.title = (title || DEFAULT_TITLE) + ' | Inciteful.xyz'
}
function setDescription (description) {
  document
    .querySelector('meta[name="description"]')
    .setAttribute('content', description || '')
}

export default { setTitle, setDescription }
