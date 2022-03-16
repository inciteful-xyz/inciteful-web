/* eslint-disable camelcase */

import { LayoutOptions, Core } from 'cytoscape'
import { Emitter, EventType } from 'mitt';

export type IncitefulEmitter = Emitter<Record<EventType, unknown>>

export type PaperID = string

export interface Paper {
  id: PaperID;
  doi: string;
  author?: Author[];
  title: string;
  published_year: number;
  journal: string;
  pages: string;
  abstract: string;
  volume: string;
  external_ids?: ExternalIds[];
  num_citing: number;
  num_cited_by: number;
  distance?: number;
  path_count?: number;
  citing?: PaperID[];
  cited_by?: PaperID[];
}

export interface Author {
  author_id: number;
  name: string;
  sequence: number;
  affiliation: string;
}

export interface PaperConnector {
  source: PaperID;
  papers: Paper[];
  paths: Path[];
  connections: Connection[];
  num_paths: number;
  papers_searched: number;
  max_hops: number;
}
export interface ExternalIds {
  S2ID?: string | null;
  DOI?: string | null;
  MAG?: number | null;
}
export interface Connection {
  citing: string;
  cited: string;
}

export interface IModalOptions {
  previousScreen?: ModalOptions;
}

export interface PaperModalOptions extends IModalOptions {
  paperId: PaperID;
  connectTo?: PaperID;
}
export interface AuthorModalOptions extends IModalOptions {
  author: Author;
  contextIds?: PaperID[];
}
export interface GraphModalOptions extends IModalOptions {
  connectTo?: PaperID;
}

export type ModalOptions = PaperModalOptions | AuthorModalOptions;

export function isPaperModalOptons(
  options: ModalOptions
): options is PaperModalOptions {
  return (options as PaperModalOptions).paperId !== undefined;
}

export function isAuthorModalOptions(
  options: ModalOptions
): options is AuthorModalOptions {
  return (options as AuthorModalOptions).author !== undefined;
}

export type Path = PaperID[]

export interface Faq {
  question: string;
  answer: string;
}
export interface GraphData {
  type: string;
  papers?: Paper[];
  connections?: Connection[];
  paths?: Path[];
  toId?: PaperID;
  fromId?: PaperID;
  sourcePaperId?: PaperID;
  modalOptions?: GraphModalOptions;
}

export class IncitefulGraph {
  cy: Core
  sourcePaperId?: PaperID
  constructor(cy: Core, sourcePaperId?: PaperID) {
    this.cy = cy
    this.sourcePaperId = sourcePaperId
    this.cy.on('resize', () => {
      this.centerSource()
    })

    this.cy.ready(() => {
      this.centerSource()
    })
  }

  centerSource() {
    if (this.cy && (this.cy.height() > 600 || !this.sourcePaperId)) {
      this.cy.fit()
    } else {
      const j = this.cy.$(`[id = "${this.sourcePaperId}"]`)
      this.cy.reset().center(j)
    }
  }

  filterNodes(ids: Set<PaperID>) {
    this.cy.nodes().forEach(node => {
      if (ids.has(node.id())) {
        node.removeClass('disabled')
      } else {
        node.addClass('disabled')
      }
    })
  }

  highlightNodes(ids: Set<PaperID>) {
    this.cy.nodes().forEach(node => {
      if (ids.has(node.id())) {
        node.addClass('highlighted')
      } else {
        node.removeClass('highlighted')
      }
    })
  }

  resize() {
    this.cy.resize()
  }

  zoom(level?: number) {
    return this.cy.zoom(level)
  }

  curZoom(): number {
    return this.cy.zoom()
  }

  renderLayout(layoutParams: LayoutOptions) {
    const layout = this.cy.layout(layoutParams)
    layout.run()
  }
}
