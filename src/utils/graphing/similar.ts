import { GraphData, Paper, PaperID } from '../../types/inciteful'
import { ElementDefinition, EdgeSingular, EdgeDataDefinition } from 'cytoscape'

function edgeLength (edge: EdgeSingular) {
  return 15 / Math.pow(0.2 + edge.data('weight'), 2)
}

function countIntersection (a: PaperID[], b: PaperID[]) {
  let ai = 0
  let bi = 0
  let count = 0

  while (ai < a.length && bi < b.length) {
    if (a[ai] < b[bi]) {
      ai++
    }
    if (a[ai] > b[bi]) {
      bi++
    } else {
      count++
      bi++
      ai++
    }
  }

  return count
}

function coupling (p: Paper, p2: Paper) {
  // let maxLength = Math.max(p.citing.length, p2.citing.length);
  const denom = Math.sqrt(p.citing!.length * p2.citing!.length)

  if (denom === 0) {
    return 0
  }

  const intersection = countIntersection(p.citing!, p2.citing!)

  return intersection / denom
}

function cocitations (p: Paper, p2: Paper) {
  const denom = Math.sqrt(p.cited_by!.length * p2.cited_by!.length)

  if (denom === 0) {
    return 0
  }

  const intersection = countIntersection(p.cited_by!, p2.cited_by!)

  return intersection / denom
}

function buildLayout () {
  const layout = {
    name: 'fcose',
    // Ideal edge (non nested) length
    idealEdgeLength: edgeLength,
    edgeElasticity: () => {
      return 0.1
      // return (edge.data().adamic_adar + 0.1);
    },
    nodeRepulsion: () => 100
  }
  return layout
}

function makeTippy (p: Paper) {
  const content = document.createElement('div')

  content.innerHTML = p.title

  return content
}

function buildElements (graphData: GraphData, minDate: number, maxDate: number) {
  const elements: ElementDefinition[] = []
  const possibleEdges: { source: PaperID; destination: PaperID; score: number; coup: number; cocite: number }[] = []
  const edgeCounts: Record<PaperID, number> = {}
  const papers = graphData.papers

  Object.values(papers).forEach((p: Paper) => (edgeCounts[p.id] = 0))

  Object.values(papers).forEach(p => {
    let author = 'NA'

    if (p.author && p.author.length > 0) {
      author = p.author[0].name.split(' ').pop() ?? author
    }

    const title = `${author}, ${p.published_year}`
    const size = 25 * (2.5 + Math.log10(1 + p.num_cited_by))

    const date = p.published_year === undefined ? maxDate : p.published_year
    const lightness = 20 + 50 * (1 - (date - minDate) / (maxDate - minDate))

    elements.push({
      data: {
        id: p.id.toString(),
        title: title,
        lightness,
        size,
        color: `hsl(259, 92.7%, ${lightness}%)`,
        group: p.id === graphData.sourcePaperId ? 'isSource' : 'notSource',
        tippyContent: makeTippy(p)
      }
    })

    Object.values(papers).forEach(p2 => {
      if (p2.id > p.id) {
        const coup = coupling(p, p2)
        const cocite = cocitations(p, p2)
        const score = coup + 0.25 * cocite

        if (score > 0.01) {
          possibleEdges.push({
            source: p.id,
            destination: p2.id,
            score,
            coup,
            cocite
          })
        }
      }
    })
  })

  const edges: EdgeDataDefinition[] = []
  possibleEdges.sort((a, b) => b.coup - a.coup)

  possibleEdges.forEach(e => {
    if (
      (edgeCounts[e.source] < 3 &&
        edgeCounts[e.destination] < 3 &&
        e.score > 0.5) ||
      e.score > 0.8 ||
      (e.score > 0.5 &&
        (e.source === graphData.sourcePaperId ||
          e.destination === graphData.sourcePaperId) &&
        edgeCounts[graphData.sourcePaperId ?? 'NA'] < 6) ||
      edgeCounts[e.destination] < 1 ||
      edgeCounts[e.source] < 1
    ) {
      const score = e.score < 0.05 ? 0.05 : e.score

      edges.push({
        id: `${e.source}-${e.destination}`,
        source: e.source.toString(),
        target: e.destination.toString(),
        score: score
      })

      edgeCounts[e.source]++
      edgeCounts[e.destination]++
    }
  })

  const maxScore = Math.max(...edges.map(e => e.score))
  const minScore = Math.min(...edges.map(e => e.score))

  edges.forEach(e => {
    e.weight = 0.01 + (e.score - minScore) / maxScore
    e.color = `hsla(0, 0%, 13%, ${e.weight})`
    e.opacity = e.weight + 0.08
    e.opacity = e.opacity > 1 ? 1 : e.opacity

    elements.push({
      data: e
    })
  })

  return elements
}

export default {
  buildLayout,
  buildElements
}
