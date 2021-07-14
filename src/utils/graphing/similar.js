function edgeLength (edge) {
  return 15 / Math.pow(0.2 + edge.data('weight'), 2)
}

function countIntersection (a, b) {
  let ai = 0; let bi = 0; let count = 0

  while (ai < a.length && bi < b.length) {
    if (a[ai] < b[bi]) { ai++ }
    if (a[ai] > b[bi]) { bi++ } else { count++; bi++; ai++ }
  }

  return count
}

function coupling (p, p2) {
  // let maxLength = Math.max(p.citing.length, p2.citing.length);
  const denom = Math.sqrt(p.citing.length * p2.citing.length)

  if (denom === 0) {
    return 0
  }

  const intersection = countIntersection(p.citing, p2.citing)

  return intersection / denom
}

function cocitations (p, p2) {
  const denom = Math.sqrt(p.cited_by.length * p2.cited_by.length)

  if (denom === 0) {
    return 0
  }

  const intersection = countIntersection(p.cited_by, p2.cited_by)

  return intersection / denom
}

function buildLayout () {
  const layout = {
    name: 'fcose',
    // Ideal edge (non nested) length
    idealEdgeLength: edgeLength,
    edgeElasticity: (edge) => {
      return 0.1
      // return (edge.data().adamic_adar + 0.1);
    },
    // 'draft', 'default' or 'proof'
    // - 'draft' only applies spectral layout
    // - 'default' improves the quality with subsequent CoSE layout (fast cooling rate)
    // - 'proof' improves the quality with subsequent CoSE layout (slow cooling rate)
    quality: 'proof',
    // Use random node positions at beginning of layout
    // if this is set to false, then quality option must be "proof"
    randomize: true,
    // Whether or not to animate the layout
    animate: false,
    // Whether or not to animate the layout
    animationEasing: undefined,
    // Fit the viewport to the repositioned nodes
    fit: false,
    // Padding around layout
    padding: 30,
    // Whether to include labels in node dimensions. Valid in "proof" quality
    nodeDimensionsIncludeLabels: false,
    // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
    uniformNodeDimensions: false,
    // Whether to pack disconnected components - valid only if randomize: true
    packComponents: false,
    // Layout step - all, transformed, enforced, cose - for debug purpose only
    step: 'all',
    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: (node) => 100,
    nestingFactor: 0.1,
    // Maximum number of iterations to perform
    numIter: 5000,
    // For enabling tiling
    tile: true,
    // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
    tilingPaddingVertical: 10,
    // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
    tilingPaddingHorizontal: 10,
    // Gravity force (constant)
    gravity: 0.25,
    // Gravity range (constant)
    gravityRange: 3.8,
    // Initial cooling factor for incremental layout
    initialEnergyOnIncremental: 0.3,

    /* constraint options */

    // Fix desired nodes to predefined positions
    // [{nodeId: 'n1', position: {x: 100, y: 200}}, {...}]
    // fixedNodeConstraint: [
    //   { nodeId: "78435850", position: { x: 0, y: 0 } },
    // ],
    // Align desired nodes in vertical/horizontal direction
    // {vertical: [['n1', 'n2'], [...]], horizontal: [['n2', 'n4'], [...]]}
    alignmentConstraint: undefined,
    // Place two nodes relatively in vertical/horizontal direction
    // [{top: 'n1', bottom: 'n2', gap: 100}, {left: 'n3', right: 'n4', gap: 75}, {...}]
    relativePlacementConstraint: undefined
  }

  layout.idealEdgeLength = edgeLength
  layout.edgeElasticity = (edge) => {
    return 0.1
    // return (edge.data().adamic_adar + 0.1);
  }
  layout.nodeRepulsion = (node) => 100
  return layout
}

function makeTippy (p) {
  const content = document.createElement('div')

  content.innerHTML = p.title

  return content
}

function buildElements (graphData, minDate, maxDate) {
  const elements = []
  const possibleEdges = []
  const edgeCounts = {}
  const papers = graphData.papers

  Object.values(papers).forEach((p) => (edgeCounts[p.id] = 0))

  Object.values(papers).forEach((p) => {
    let author = 'NA'

    if (p.author && p.author.length > 0) {
      author = p.author[0].name.split(' ').pop()
    }

    const title = `${author}, ${p.published_year}`
    const size = 25 * (2.5 + Math.log10(1 + p.num_cited_by))

    const date =
            p.published_year + (1 - p.published_month) / 12
    const lightness =
            20 + 50 * (1 - (date - minDate) / (maxDate - minDate))

    elements.push({
      data: {
        id: p.id,
        title: title,
        lightness,
        size,
        color: `hsl(259, 92.7%, ${lightness}%)`,
        group: p.id === graphData.sourcePaperId ? 'isSource' : 'notSource',
        tippyContent: makeTippy(p)
      }
    })

    Object.values(papers).forEach((p2) => {
      if (p2.id > p.id) {
        const coup = coupling(p, p2)
        const cocite = cocitations(p, p2)
        const score = coup + (0.25 * cocite)

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

  const edges = []
  possibleEdges.sort((a, b) => b.coup - a.coup)

  possibleEdges.forEach((e) => {
    if (
      (edgeCounts[e.source] < 3 &&
                edgeCounts[e.destination] < 3 &&
                e.score > 0.5) ||
            (e.score > 0.8) ||
            (e.score > 0.5 &&
                (e.source === graphData.sourcePaperId || e.destination === graphData.sourcePaperId) &&
                edgeCounts[graphData.sourcePaperId] < 6
            ) ||
            edgeCounts[e.destination] < 1 ||
            edgeCounts[e.source] < 1
    ) {
      const score = e.score < 0.05 ? 0.05 : e.score

      edges.push({
        id: `${e.source}-${e.destination}`,
        source: e.source,
        target: e.destination,
        score: score
      })

      edgeCounts[e.source]++
      edgeCounts[e.destination]++
    }
  })

  const maxScore = Math.max(...edges.map((e) => e.score))
  const minScore = Math.min(...edges.map((e) => e.score))

  edges.forEach((e) => {
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
