import { Paper, PaperID } from '../../types/incitefulTypes'
import { GraphData } from "../../types/graphTypes"
import { ElementDefinition, EdgeSingular, EdgeDataDefinition } from 'cytoscape'


function edgeLength(edge: EdgeSingular): number {
  const len = 75 / Math.pow(0.2 + edge.data('weight'), 2)
  return len > 500 ? 500 : len
}

function countIntersection(a: PaperID[], b: PaperID[]): number {
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

function coupling(p: Paper, p2: Paper): number {
  // Hub Supressed
  // const denom = Math.max(p.citing!.length, p2.citing!.length);
  // Salton Similarity
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const denom = Math.sqrt(p.citing!.length * p2.citing!.length);

  if (denom === 0) {
    return 0
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const intersection = countIntersection(p.citing!, p2.citing!)

  return intersection / denom
}

function cocitations(p: Paper, p2: Paper): number {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const denom = Math.sqrt(p.cited_by!.length * p2.cited_by!.length)

  if (denom === 0) {
    return 0
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const intersection = countIntersection(p.cited_by!, p2.cited_by!)

  return intersection / denom
}

function buildLayout() {
  const layout = {
    name: 'fcose',
    // Ideal edge (non nested) length
    idealEdgeLength: edgeLength,
    edgeElasticity: () => {
      return 0.1
      // return (edge.data().adamic_adar + 0.1);
    },
    nodeRepulsion: () => 1000,
    tile: true,
    nodeSeparation: 75,
    animate: false,
    initialEnergyOnIncremental: 0.5,
    packComponents: true,
  }

  return layout
}

function makeTippy(p: Paper) {
  const content = document.createElement('div')

  content.innerHTML = p.title

  return content
}

interface Edge {
  source: PaperID;
  destination: PaperID;
  score: number; coup: number;
  cocite: number
}

function buildElements(graphData: GraphData, minDate: number, maxDate: number) {
  const elements: ElementDefinition[] = []
  const possibleEdges: Edge[] = []
  const papers = graphData.papers ?? []
  const edgeCounts: Record<PaperID, number> = {}

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
        group: graphData.sourcePaperIds?.includes(p.id) ? 'isSource' : 'notSource',
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

  if (possibleEdges.length == 0)
    return elements

  let edges: EdgeDataDefinition[] = []
  possibleEdges.sort((a, b) => b.score - a.score)

  console.log(possibleEdges.length)

  const topPercentile = possibleEdges[Math.floor(possibleEdges.length * 0.02)].score
  const medPercentile = possibleEdges[Math.floor(possibleEdges.length * 0.05)].score
  const minPercentile = possibleEdges[Math.floor(possibleEdges.length * 0.10)].score

  const sourcePaperId = graphData.sourcePaperIds && graphData.sourcePaperIds.length > 0 ? graphData.sourcePaperIds[0] : undefined

  possibleEdges.forEach(e => {
    if (
      (
        edgeCounts[e.source] < 3
        && edgeCounts[e.destination] < 3
        && e.score > medPercentile
      )
      || (
        e.score > topPercentile
        && edgeCounts[e.source] < 5
        && edgeCounts[e.destination] < 5
      )
      || (
        e.score > minPercentile
        && (
          e.source === sourcePaperId
          || e.destination === sourcePaperId
        )
        && edgeCounts[sourcePaperId ?? 'NA'] < 4
      )
      || (
        edgeCounts[e.source] < 5
        && edgeCounts[e.destination] < 1
      )
      || (
        edgeCounts[e.destination] < 5
        && edgeCounts[e.source] < 1
      )
    ) {
      const score = e.score < 0.02 ? 0.02 : e.score

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


  edges = connectDisconnectedComponents(edges, possibleEdges)

  const maxScore = Math.max(...edges.map(e => e.score))
  const minScore = Math.min(...edges.map(e => e.score))

  edges.forEach(e => e.weight = 0.01 + (e.score - minScore) / maxScore)
  const avgWeight = edges.reduce((a, b) => a + b.weight, 0) / edges.length

  edges.forEach(e => {
    e.color = `hsla(0, 0%, 13%, ${e.weight})`
    e.opacity = e.weight + 0.08
    e.opacity = e.opacity > 1 ? 1 : e.opacity

    e.weight = e.weight / avgWeight

    elements.push({
      data: e
    })
  })

  return elements
}

function connectDisconnectedComponents(elements: EdgeDataDefinition[], possibleEdges: Edge[]): EdgeDataDefinition[] {
  const components = findDisconnectedComponents(elements)
  const newEdges = findConnectingEdges(components, possibleEdges);
  return elements.concat(newEdges)
}

function findConnectingEdges(components: Set<PaperID>[], possibleEdges: Edge[]): EdgeDataDefinition[] {
  const edges: EdgeDataDefinition[] = []

  for (let i = 0; i < possibleEdges.length; i++) {
    const e = possibleEdges[i]
    let found = false
    let sourceComponent = -1
    let destinationComponent = -1

    for (let j = 0; j < components.length; j++) {
      for (let k = j + 1; k < components.length; k++) {
        if (components[j].has(e.source) && components[k].has(e.destination)) {
          found = true
          sourceComponent = j
          destinationComponent = k
          break
        }
      }
    }

    if (found) {
      edges.push({
        id: `${e.source}-${e.destination}`,
        source: e.source.toString(),
        target: e.destination.toString(),
        score: e.score
      })

      components[sourceComponent] = new Set([...components[sourceComponent], ...components[destinationComponent]])
      components = components.filter((_, i) => i !== destinationComponent)
    }

    if (components.length === 1) {
      break
    }
  }

  return edges
}

function findDisconnectedComponents(elements: EdgeDataDefinition[]): Set<PaperID>[] {
  const components: Set<PaperID>[] = []

  elements.forEach(e => {
    let found = false

    for (let i = 0; i < components.length; i++) {
      if (components[i].has(e.source) || components[i].has(e.target)) {
        components[i].add(e.source)
        components[i].add(e.target)
        found = true
        break
      }
    }

    if (!found) {
      components.push(new Set([e.source, e.target]))
    }
  });

  return mergeComponents(components)
}

function mergeComponents(components: Set<PaperID>[]): Set<PaperID>[] {
  const mergedComponents: Set<PaperID>[] = []
  const mergedComponentIndices: number[] = []

  for (let i = 0; i < components.length; i++) {
    if (mergedComponentIndices.includes(i)) {
      continue
    }

    let newComponent = new Set([...components[i]])

    for (let j = i + 1; j < components.length; j++) {
      if ([...components[i]].filter(p => components[j].has(p)).length > 0) {
        mergedComponentIndices.push(j)
        newComponent = new Set([...newComponent, ...components[j]])
      }
    }

    mergedComponents.push(newComponent)
  }

  if (mergedComponents.length === components.length)
    return components
  else
    return mergeComponents(mergedComponents)
}

export default {
  buildLayout,
  buildElements
}
