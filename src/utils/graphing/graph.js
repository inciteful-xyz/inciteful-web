import cytoscape from 'cytoscape'
import contextMenus from 'cytoscape-context-menus'
import 'cytoscape-context-menus/cytoscape-context-menus.css'
import fcose from 'cytoscape-fcose'
import klay from 'cytoscape-klay'
import graphStyle from './graphStyle.json'
import similar from './similar'
import connector from './connector'
import popper from 'cytoscape-popper'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

cytoscape.use(popper)
cytoscape.use(fcose)
cytoscape.use(klay)
cytoscape.use(contextMenus)

function hideTippy (node) {
  const tippy = node.data('tippy')

  if (tippy != null) {
    tippy.hide()
  }
}

function createTippys (cy) {
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
      const els = node.data('elsToHighlight')

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
          els.forEach(id => {
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
function setupTippy (cy, bus, modalOptions) {
  createTippys(cy)

  const hideAllTippies = function () {
    cy.nodes().forEach(hideTippy)
  }

  cy.on('tap', function (ev) {
    hideAllTippies()
    const id = Number(ev.target.data('id'))
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

function renderLayout (cy, layoutParams, opts) {
  for (const i in opts) {
    layoutParams[i] = opts[i]
  }

  const layout = cy.layout(layoutParams)

  layout.run()

  return cy
}

function loadBaseGraph (
  elements,
  container,
  layoutParams,
  opts,
  bus,
  modalOptions
) {
  const cy = cytoscape({
    container,
    autounselectify: true,
    wheelSensitivity: 0.15,
    userZoomingEnabled: true,
    userPanningEnabled: true,
    elements,
    ready: function (e) {
      // var j = e.cy.$("");
      e.cy.center()
    },
    style: graphStyle,
    layout: { name: 'random' }
  })

  renderLayout(cy, layoutParams, opts)

  setupTippy(cy, bus, modalOptions)

  return cy
}

function loadGraph (graphData, container, bus, minDate, maxDate) {
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

  const cy = loadBaseGraph(
    elements,
    container,
    layoutParams,
    undefined,
    bus,
    graphData.modalOptions
  )

  if (contextMenuOptions) {
    cy.contextMenus(contextMenuOptions)
  }
  cy.on('resize', ev => {
    ev.cy.centerSource()
  })

  cy.centerSource = () => {
    if (cy && (cy.height() > 600 || !graphData.sourcePaperId)) {
      cy.fit()
    } else {
      const j = cy.$(`#${graphData.sourcePaperId}`)
      cy.reset().center(j)
    }
  }

  cy.filterNodes = ids => {
    cy.nodes().forEach(node => {
      if (ids.has(Number(node.id()))) {
        node.removeClass('disabled')
      } else {
        node.addClass('disabled')
      }
    })
  }

  cy.highlightNodes = ids => {
    const idSet = new Set()
    ids.forEach(id => idSet.add(id))

    cy.nodes().forEach(node => {
      if (idSet.has(Number(node.id()))) {
        node.addClass('highlighted')
      } else {
        node.removeClass('highlighted')
      }
    })
  }
  window.cy = cy
  return cy
}

export default {
  loadGraph
}
