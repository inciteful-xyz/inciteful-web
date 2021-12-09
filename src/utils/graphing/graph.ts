/* eslint-disable @typescript-eslint/ban-ts-ignore */
import cytoscape, { Core, NodeSingular, ElementDefinition } from 'cytoscape'
// @ts-ignore
import contextMenus from 'cytoscape-context-menus'
import 'cytoscape-context-menus/cytoscape-context-menus.css'
// @ts-ignore
import fcose from 'cytoscape-fcose'
// @ts-ignore
import klay from 'cytoscape-klay'
import graphStyles from './graphStyles'
import similar from './similar'
import connector from './connector'
import popper from 'cytoscape-popper'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import { ModalOptions, GraphData, IncitefulGraph, PaperID } from '@/types/inciteful'

cytoscape.use(popper)
cytoscape.use(fcose)
cytoscape.use(klay)
cytoscape.use(contextMenus)

function hideTippy (node: NodeSingular) {
  const tippy = node.data('tippy')

  if (tippy != null) {
    tippy.hide()
  }
}

function createTippys (cy: Core) {
  cy.nodes().forEach(node => {
    const content = node.data('tippyContent')

    if (content) {
      const ref = node.popperRef() // used only for positioning

      // A dummy element must be passed as tippy only accepts dom element(s) as the target
      // https://atomiks.github.io/tippyjs/v6/constructor/#target-types
      const dummyDomEle = document.createElement('div')

      const tip = tippy(dummyDomEle, {
        // tippy props:
        getReferenceClientRect: ref.getBoundingClientRect, // https://atomiks.github.io/tippyjs/v6/all-props/#getreferenceclientrect
        trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
        arrow: true,
        allowHTML: true,
        hideOnClick: false,
        interactive: false,
        appendTo: document.body,
        // your own custom props
        // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
        content
      })

      node.data('tippy', tip)
      const els: PaperID[] = node.data('elsToHighlight')

      node.on('mouseover', function () {
        // If the context menu is open, don't trigger the mouseover actions.
        if (
          cy.scratch &&
          cy.scratch().cycontextmenus &&
          cy.scratch().cycontextmenus.cxtMenu &&
          cy.scratch().cycontextmenus.cxtMenu.style.display !== 'none'
        ) {
          return
        }

        tip.show()
        setTimeout(() => tip.hide(), 5000)

        if (els) {
          els.forEach((id: PaperID) => {
            const el = cy.$(`#${id}`)
            if (el) el.addClass('highlighted')
          })
        }

        node.addClass('highlighted')
        cy.nodes()
          .not(node)
          .forEach(hideTippy)
      })

      node.on('mouseout', function () {
        if (els) {
          els.forEach(id => {
            const el = cy.$(`#${id}`)
            if (el) el.removeClass('highlighted')
          })
        }

        node.removeClass('highlighted')
        tip.hide()
      })
    }
  })
}
function setupTippy (cy: Core, bus: Vue, modalOptions: ModalOptions) {
  createTippys(cy)

  const hideAllTippies = function () {
    cy.nodes().forEach(hideTippy)
  }

  cy.on('tap', function (ev) {
    hideAllTippies()
    const id = ev.target.data('id')
    if (id) {
      modalOptions.paperId = id
      bus.$emit('show_paper_modal', modalOptions)
    }
  })

  cy.on('tap', 'edge', function () {
    hideAllTippies()
  })

  cy.on('zoom pan', function () {
    hideAllTippies()
  })
}

function loadBaseGraph (
  elements: ElementDefinition[],
  container: HTMLElement,
  bus: Vue,
  modalOptions: ModalOptions
) {
  const cy = cytoscape({
    container,
    autounselectify: true,
    wheelSensitivity: 0.15,
    userZoomingEnabled: true,
    userPanningEnabled: true,
    elements,
    style: graphStyles.default,
    layout: { name: 'random' }
  })

  setupTippy(cy, bus, modalOptions)

  return cy
}

function loadGraph (graphData: GraphData, container: HTMLElement, bus: Vue, minDate: number, maxDate: number) {
  let elements
  let layoutParams
  let contextMenuOptions

  if (graphData.type === 'similar') {
    elements = similar.buildElements(graphData, minDate, maxDate)
    layoutParams = similar.buildLayout()
  }

  if (graphData.type === 'connector') {
    elements = connector.buildElements(graphData, minDate, maxDate)
    layoutParams = connector.buildLayout()
    contextMenuOptions = connector.contextMenu(bus)
  }

  if (elements === undefined) {
    console.error('Graph type not supported: ' + graphData.type)
    return new IncitefulGraph(cytoscape())
  }

  const cy = loadBaseGraph(
    elements,
    container,
    bus,
    graphData.modalOptions ?? {}
  )

  const graph = new IncitefulGraph(cy, graphData.sourcePaperId)

  if (contextMenuOptions) {
    (cy as any).contextMenus(contextMenuOptions)
  }

  // @ts-ignore
  graph.renderLayout(layoutParams)

  return graph
}

export default {
  loadGraph
}
