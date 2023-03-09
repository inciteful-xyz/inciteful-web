import { PaperID, Author } from './incitefulTypes';

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

export interface SaveCollectionAction {
    contextIds: PaperID[];
}

export type CollectionModalActions = SaveCollectionAction;

export function isSaveCollectionAction(
    options: CollectionModalActions
): options is SaveCollectionAction {
    return (options as SaveCollectionAction).contextIds !== undefined;
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

export interface NotificationModalOptions {
    message1: string,
    message2: string
}