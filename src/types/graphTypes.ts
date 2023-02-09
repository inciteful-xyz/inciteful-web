import { LayoutOptions, Core } from 'cytoscape';
import { Paper, Connection, Path, PaperID } from './incitefulTypes';
import { IModalOptions } from './modalTypes';


export interface GraphModalOptions extends IModalOptions {
    connectTo?: PaperID;
}

export interface GraphData {
    type: string;
    papers?: Paper[];
    connections?: Connection[];
    paths?: Path[];
    toId?: PaperID;
    fromId?: PaperID;
    sourcePaperIds?: PaperID[];
    modalOptions?: GraphModalOptions;
}

export class IncitefulGraph {
    cy: Core;
    sourcePaperIds?: PaperID[];
    constructor(cy: Core, sourcePaperIds?: PaperID[]) {
        this.cy = cy;
        this.sourcePaperIds = sourcePaperIds;
        this.cy.on('resize', () => {
            this.centerSource();
        });

        this.cy.ready(() => {
            this.centerSource();
        });
    }

    centerSource() {
        const sourcePaperId = this.sourcePaperIds && this.sourcePaperIds.length == 1 ? this.sourcePaperIds[0] : undefined;
        if (this.cy && (this.cy.height() > 600 || !sourcePaperId)) {
            this.cy.fit();
        } else {
            const j = this.cy.$(`[id = "${sourcePaperId}"]`);
            this.cy.reset().center(j);
        }
    }

    filterNodes(ids: Set<PaperID>) {
        this.cy.nodes().forEach(node => {
            if (ids.has(node.id())) {
                node.removeClass('disabled');
            } else {
                node.addClass('disabled');
            }
        });
    }

    highlightNodes(ids: Set<PaperID>) {
        this.cy.nodes().forEach(node => {
            if (ids.has(node.id())) {
                node.addClass('highlighted');
            } else {
                node.removeClass('highlighted');
            }
        });
    }

    resize() {
        this.cy.resize();
    }

    zoom(level?: number) {
        return this.cy.zoom(level);
    }

    curZoom(): number {
        return this.cy.zoom();
    }

    renderLayout(layoutParams: LayoutOptions) {
        const layout = this.cy.layout(layoutParams);
        layout.run();
    }
}
