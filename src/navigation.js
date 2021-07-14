import urls from './utils/urls'

function toggleMobileMenu () {
  var closedMobileMenuIcon = document.getElementById('closedMobileMenuIcon')
  var openMobileMenuIcon = document.getElementById('openMobileMenuIcon')
  var mobileMenu = document.getElementById('mobileMenu')

  if (mobileMenu.classList.contains('hidden')) {
    closedMobileMenuIcon.classList.remove('block')
    closedMobileMenuIcon.classList.add('hidden')

    openMobileMenuIcon.classList.remove('hidden')
    openMobileMenuIcon.classList.add('block')

    mobileMenu.classList.remove('hidden')
    mobileMenu.classList.add('block')
  } else {
    closedMobileMenuIcon.classList.add('block')
    closedMobileMenuIcon.classList.remove('hidden')

    openMobileMenuIcon.classList.add('hidden')
    openMobileMenuIcon.classList.remove('block')

    mobileMenu.classList.add('hidden')
    mobileMenu.classList.remove('block')
  }
}

function removeLitReviewPaper (id) {
  var newUrl = urls.removeIdFromUrl(id, window.location)
  window.location.href = newUrl
}

function addLitReviewPaper (id) {
  var newUrl = urls.addIdToUrl(id, window.location)
  window.location.href = newUrl
}
function addLitReviewPapers (ids) {
  var newUrl = urls.addIdsToUrl(ids, window.location, false)
  window.location.href = newUrl
}

function getPaperUrl (id) {
  return urls.constructUrlFromIdsAndParams('/p', [id], [])
}

function goToPaper (id) {
  if (id !== undefined && id) {
    window.location.href = getPaperUrl(id)
  }
}

function goToPapers (ids) {
  if (ids !== undefined && ids) {
    window.location.href = urls.constructUrlFromIdsAndParams('/p', ids, [])
  }
}

function goToSearch (query) {
  window.location.href = `/search?q=${encodeURIComponent(query)}`
}

function goToLitConnector (from, to) {
  let url = '/c'

  if (from) { url = url + `?from=${encodeURIComponent(from)}` }

  if (to) {
    url = url + (!from ? '?' : '&')

    url = url + `to=${encodeURIComponent(to)}`
  }

  window.location.href = url
}

const filterParams = [
  'keywords',
  'maxDistance',
  'minDistance',
  'maxYear',
  'minYear'
]

function getFiltersFromQS () {
  const filters = {}
  const params = new URLSearchParams(window.location.search)

  filterParams.forEach((x) => {
    const val = params.get(x)
    if (val) filters[x] = val
  })

  return filters
}

function setSearchParam (param, value) {
  var searchParams = new URLSearchParams(window.location.search)
  searchParams.set(param, value)
  history.pushState(null, null, '?' + searchParams.toString())
}

export default {
  toggleMobileMenu,
  removeLitReviewPaper,
  addLitReviewPaper,
  addLitReviewPapers,
  getFiltersFromQS,
  filterParams,
  getPaperUrl,
  goToSearch,
  goToLitConnector,
  goToPapers,
  goToPaper,
  setSearchParam
}
