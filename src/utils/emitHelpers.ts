import mitt from 'mitt'
import { IncitefulEmitter, PaperID } from '../types/incitefulTypes';
import { ModalOptions, NotificationModalOptions } from '../types/modalTypes';

export const EmitEvents = {
    ShowModal: Symbol("show_modal"),
    AddToLitReview: Symbol("add_to_lit_review"),
    ShowNotification: Symbol("show_notification"),
    GoToPaper: Symbol("go_to_paper"),
    GraphLoaded: Symbol("graph_loaded"),
}

export const emitter = mitt() as IncitefulEmitter

export const showModalHelper = (modalOptions: ModalOptions) => {
    emitter.emit(EmitEvents.ShowModal, modalOptions)
}

export const showNotificationHelper = (options: NotificationModalOptions) => {
    emitter.emit(EmitEvents.ShowNotification, options)
}

export const graphLoadedHelper = () => {
    emitter.emit(EmitEvents.GraphLoaded)
}
export const addToLitReviewHelper = (id: PaperID) => {
    emitter.emit(EmitEvents.AddToLitReview, id)
}
