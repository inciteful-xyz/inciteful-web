import { EdgeSingular, Stylesheet } from 'cytoscape'

const style: Stylesheet[] = [
  {
    selector: 'node',
    style: {
      label: 'data(title)',
      width: 'data(size)',
      height: 'data(size)',
      color: 'white',
      'background-color': 'data(color)',
      'border-width': 2,
      'border-color': 'white',
      'text-outline-width': 6,
      'text-outline-color': 'data(color)',
      'font-size': '18px',
      'text-valign': 'center',
      'text-halign': 'center',
      'overlay-padding': '6px'
    }
  },
  {
    selector: 'node[group=\'isSource\']',
    style: {
      'z-index': 1,
      'border-width': '9px',
      'border-color': '#AAD8FF',
      'border-opacity': 0.7
    }
  },
  {
    selector: 'node.disabled',
    style: {
      'background-color': '#9fa6b2',
      'text-outline-color': '#9fa6b2'
    }
  },
  {
    selector: 'edge',
    style: {
      'curve-style': 'straight',
      color: 'data(color)',
      'overlay-padding': '2px',
      opacity: (edge: EdgeSingular) => { return Number(edge.data('opacity')) },
      width: 2
    }
  },
  {
    selector: '.highlighted',
    style: {
      'z-index': 999999
    }
  },
  {
    selector: 'node.highlighted',
    style: {
      'border-width': '12px',
      'border-color': '#AAD8FF',
      'border-opacity': 0.7
    }
  },
  {
    selector: 'edge.highlighted',
    style: {
      width: '4px',
      'line-color': '#AAD8FF',
      opacity: 1
    }
  },
  {
    selector: 'node:selected',
    style: {
      'border-width': '6px',
      'border-color': '#AAD8FF',
      'border-opacity': 0.5,
      'background-color': '#77828C',
      'text-outline-color': '#77828C'
    }
  }
]

export default {
  default: style
}
