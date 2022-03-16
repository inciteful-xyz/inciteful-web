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

export interface CollectionModalOptions extends IModalOptions {
    collectionAction: 'save' | 'remove';
    contextIds: PaperID[];
}

export type ModalOptions = PaperModalOptions | AuthorModalOptions | CollectionModalOptions;

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

export function isCollectionModalOptions(
    options: ModalOptions
): options is CollectionModalOptions {
    return (options as CollectionModalOptions).collectionAction !== undefined;
}
