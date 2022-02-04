import {
  EventObject,
  NodeDefinition,
  Position,
  ElementDefinition
} from 'cytoscape'
import { Paper, GraphData } from '@/types/inciteful'
import { Emitter } from 'mitt'

function buildKlayLayout() {
  return {
    name: 'klay',
    nodeDimensionsIncludeLabels: false, // Boolean which changes whether label dimensions are included when calculating node dimensions
    fit: true, // Whether to fit
    padding: 20, // Padding on fit
    animate: false, // Whether to transition the node positions
    animateFilter: function () {
      return false
    }, // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    animationDuration: 500, // Duration of animation in ms if enabled
    animationEasing: undefined, // Easing of animation if enabled
    transform: function (_node: NodeDefinition, pos: Position) {
      return pos
    }, // A function that applies a transform to the final node position
    ready: undefined, // Callback on layoutready
    stop: undefined, // Callback on layoutstop
    klay: {
      // Following descriptions taken from http://layout.rtsys.informatik.uni-kiel.de:9444/Providedlayout.html?algorithm=de.cau.cs.kieler.klay.layered
      addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
      aspectRatio: 1, // The aimed aspect ratio of the drawing, that is the quotient of width by height
      borderSpacing: 20, // Minimal amount of space to be left to the border
      compactComponents: true, // Tries to further compact components (disconnected sub-graphs).
      crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
      /* LAYER_SWEEP The layer sweep algorithm iterates multiple times over the layers, trying to find node orderings that minimize the number of crossings. The algorithm uses randomization to increase the odds of finding a good result. To improve its results, consider increasing the Thoroughness option, which influences the number of iterations done. The Randomization seed also influences results.
            INTERACTIVE Orders the nodes of each layer by comparing their positions before the layout algorithm was started. The idea is that the relative order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive layer sweep algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
      cycleBreaking: 'GREEDY', // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will point left if edges usually point right).
      /* GREEDY This algorithm reverses edges greedily. The algorithm tries to avoid edges that have the Priority property set.
            INTERACTIVE The interactive algorithm tries to reverse edges that already pointed leftwards in the input graph. This requires node and port coordinates to have been set to sensible values. */
      direction: 'DOWN', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
      /* UNDEFINED, RIGHT, LEFT, DOWN, UP */
      edgeRouting: 'SPLINES', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
      edgeSpacingFactor: 0.5, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
      feedbackEdges: false, // Whether feedback edges should be highlighted by routing around the nodes.
      fixedAlignment: 'BALANCED', // Tells the BK node placer to use a certain alignment instead of taking the optimal result.  This option should usually be left alone.
      /* NONE Chooses the smallest layout from the four possible candidates.
            LEFTUP Chooses the left-up candidate from the four possible candidates.
            RIGHTUP Chooses the right-up candidate from the four possible candidates.
            LEFTDOWN Chooses the left-down candidate from the four possible candidates.
            RIGHTDOWN Chooses the right-down candidate from the four possible candidates.
            BALANCED Creates a balanced layout from the four possible candidates. */
      inLayerSpacingFactor: 0.5, // Factor by which the usual spacing is multiplied to determine the in-layer spacing between objects.
      layoutHierarchy: false, // Whether the selected layouter should consider the full hierarchy
      linearSegmentsDeflectionDampening: 0.3, // Dampens the movement of nodes to keep the diagram from getting too large.
      mergeEdges: false, // Edges that have no ports are merged so they touch the connected nodes at the same points.
      mergeHierarchyCrossingEdges: true, // If hierarchical layout is active, hierarchy-crossing edges use as few hierarchical ports as possible.
      nodeLayering: 'NETWORK_SIMPLEX', // Strategy for node layering.
      /* NETWORK_SIMPLEX This algorithm tries to minimize the length of edges. This is the most computationally intensive algorithm. The number of iterations after which it aborts if it hasn't found a result yet can be set with the Maximal Iterations option.
            LONGEST_PATH A very simple algorithm that distributes nodes along their longest path to a sink node.
            INTERACTIVE Distributes the nodes into layers by comparing their positions before the layout algorithm was started. The idea is that the relative horizontal order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive node layering algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
      nodePlacement: 'LINEAR_SEGMENTS', // Strategy for Node Placement
      /* BRANDES_KOEPF Minimizes the number of edge bends at the expense of diagram size: diagrams drawn with this algorithm are usually higher than diagrams drawn with other algorithms.
            LINEAR_SEGMENTS Computes a balanced placement.
            INTERACTIVE Tries to keep the preset y coordinates of nodes from the original layout. For dummy nodes, a guess is made to infer their coordinates. Requires the other interactive phase implementations to have run as well.
            SIMPLE Minimizes the area at the expense of... well, pretty much everything else. */
      randomizationSeed: 1, // Seed used for pseudo-random number generators to control the layout algorithm; 0 means a new seed is generated
      routeSelfLoopInside: false, // Whether a self-loop is routed around or inside its node.
      separateConnectedComponents: true, // Whether each connected component should be processed separately
      spacing: 20, // Overall setting for the minimal amount of space to be left between objects
      thoroughness: 7 // How much effort should be spent to produce a nice layout..
    },
    priority: function () {
      return null
    } // Edges with a non-nil value are skipped when greedy edge cycle breaking is enabled
  }
}
function buildLayout() {
  return buildKlayLayout()
}

function makeTippy(p: Paper, title: string) {
  const content = document.createElement('div')

  content.innerHTML = p.title + ', ' + title

  return content
}

function buildElements(
  graphData: GraphData,
  minDate: number,
  maxDate: number
) {
  const elements: ElementDefinition[] = []
  const papers = graphData.papers ?? []

  Object.values(papers).forEach(p => {
    let author = 'NA'

    if (p.author && p.author.length > 0) {
      author = p.author[0].name.split(' ').pop() ?? author
    }

    const title = `${author}, ${p.published_year}`
    let size = 75 * (1 + Math.log10(p.path_count ?? 1))

    const elsToHighlight = new Set()

    if (graphData.toId === p.id || graphData.fromId === p.id) {
      size = 150
    } else {
      const paths = graphData.paths ?? []
      paths.forEach(a => {
        if (a.includes(p.id)) {
          for (let i = 0; i < a.length; i++) {
            elsToHighlight.add(a[i])

            if (i > 0) {
              elsToHighlight.add(`${a[i - 1]}-${a[i]}`)
            }
          }
        }
      })
    }

    const date = p.published_year
    let lightness = 70
    if (minDate !== maxDate) {
      lightness = 20 + 50 * (1 - (date - minDate) / (maxDate - minDate))
    }

    const content = makeTippy(p, title)

    elements.push({
      data: {
        id: p.id.toString(),
        title: title,
        lightness,
        size,
        color: `hsl(259, 92.7%, ${lightness}%)`,
        tippyContent: content,
        elsToHighlight
      }
    })
  })

  if (graphData.connections) {
    graphData.connections.forEach(c => {
      elements.push({
        data: {
          id: `${c.citing}-${c.cited}`,
          source: c.citing,
          target: c.cited,
          weight: 0.5,
          color: 'hsla(0, 0%, 13%, .5)',
          opacity: 0.5
        }
      })
    })
  }
  return elements
}

function contextMenu(bus: Emitter<any>) {
  return {
    // Customize event to bring up the context menu
    // Possible options https://js.cytoscape.org/#events/user-input-device-events
    evtType: 'cxttap',
    // List of initial menu items
    // A menu item must have either onClickFunction or submenu or both
    menuItems: [
      {
        id: 'set-as-from',
        content: 'Set as From',
        selector: 'node',
        onClickFunction: function (event: EventObject) {
          const target = event.target
          const id = target.data('id')
          bus.emit('set_as_from', id)
        },
        disabled: false
      },
      {
        id: 'set-as-to',
        content: 'Set as To',
        selector: 'node',
        onClickFunction: function (event: EventObject) {
          const target = event.target
          const id = target.data('id')
          bus.emit('set_as_to', id)
        },
        disabled: false
      },
      {
        id: 'lock-paper',
        content: 'Lock Paper',
        selector: 'node',
        // tooltipText: 'Lock the graph to paths including paper',
        onClickFunction: function (event: EventObject) {
          const target = event.target
          const id = target.data('id')
          bus.emit('lock_paper', id)
        },
        disabled: false
      },
      {
        id: 'add_to_lit_review',
        content: 'Add to Lit Review',
        selector: 'node',
        // tooltipText: 'Lock the graph to paths including paper',
        onClickFunction: function (event: EventObject) {
          const target = event.target
          const id = target.data('id')
          bus.emit('add_to_lit_review', id)
        },
        disabled: false
      },
      {
        id: 'paper-graph',
        content: 'Go to Graph',
        selector: 'node',
        // tooltipText: 'Create a graph around this paper',
        onClickFunction: function (event: EventObject) {
          const target = event.target
          const id = target.data('id')
          bus.emit('go_to_paper', id)
        },
        disabled: false
      }
    ],
    // css classes that menu items will have
    menuItemClasses: [
      // add class names to this list
    ],
    // css classes that context menu will have
    contextMenuClasses: [
      'shadow',
      'rounded',
      'overflow-hidden',
      'bg-white',
      'z-10'
    ]
    // Indicates that the menu item has a submenu. If not provided default one will be used
    // submenuIndicator: { src: 'assets/submenu-indicator-default.svg', width: 12, height: 12 }
  }
}

export default {
  buildLayout,
  buildElements,
  contextMenu
}
