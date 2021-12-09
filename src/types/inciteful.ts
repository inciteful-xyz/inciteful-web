/* eslint-disable camelcase */

import { Core } from 'cytoscape'

export type PaperID = number | string;

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

export interface ExternalIds {
  S2ID?: string | null;
  DOI?: string | null;
  MAG?: number | null;
}
export interface Connection {
  citing: string;
  cited: string;
}

export interface ModalOptions {
  paperId: PaperID;
  author: Author;
  previousScreen?: {
    options: ModalOptions;
  };
  graphIds?: PaperID[];
  connectTo?: PaperID;
}

type Path = PaperID[];

export interface GraphData {
  type: string;
  papers: Paper[];
  connections: Connection[];
  paths: Path[];
  toId?: PaperID;
  fromId?: PaperID;
  sourcePaperId?: PaperID;
  modalOptions: ModalOptions;
}

export class IncitefulGraph {
  cy: Core;
  sourcePaperId?: PaperID;
  constructor (cy: Core) {
    this.cy = cy
  }

  centerSource () {
    if (this.cy && (this.cy.height() > 600 || !this.sourcePaperId)) {
      this.cy.fit()
    } else {
      const j = this.cy.$(`#${this.sourcePaperId}`)
      this.cy.reset().center(j)
    }
  }

  filterNodes (ids: Set<PaperID>) {
    this.cy.nodes().forEach(node => {
      if (ids.has(Number(node.id()))) {
        node.removeClass('disabled')
      } else {
        node.addClass('disabled')
      }
    })
  }

  highlightNodes (ids: Set<PaperID>) {
    const idSet = new Set()
    ids.forEach(id => idSet.add(id))

    this.cy.nodes().forEach(node => {
      if (idSet.has(Number(node.id()))) {
        node.addClass('highlighted')
      } else {
        node.removeClass('highlighted')
      }
    })
  }

  resize () {
    this.cy.resize()
  }

  zoom (level?: number) {
    this.cy.zoom(level)
  }
}
