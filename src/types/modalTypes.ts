import { PaperID, Author } from './incitefulTypes';
import { ZoteroKey } from './zoteroTypes';

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

export interface SyncZoteroCollectionAction {
    zoteroKey: ZoteroKey;
    zoteroName: string;
}

export interface SyncIncitefulCollectionAction {
    incitefulKey: string;
    incitefulName: string;
}

export type CollectionModalActions = SaveCollectionAction | SyncZoteroCollectionAction | SyncIncitefulCollectionAction;

export function isSaveCollectionAction(
    options: CollectionModalActions
): options is SaveCollectionAction {
    return (options as SaveCollectionAction).contextIds !== undefined;
}

export function isSyncZoteroCollectionAction(
    options: CollectionModalActions
): options is SyncZoteroCollectionAction {
    return (options as SyncZoteroCollectionAction).zoteroKey !== undefined;
}
export function isSyncIncitefulCollectionAction(
    options: CollectionModalActions
): options is SyncIncitefulCollectionAction {
    return (options as SyncIncitefulCollectionAction).incitefulKey !== undefined;
}

export function isValidCollectectionModalAction(
    options: CollectionModalActions
): boolean {
    return isSaveCollectionAction(options) || isSyncZoteroCollectionAction(options) || isSyncIncitefulCollectionAction(options);
}
export interface CollectionModalOptions extends IModalOptions {
    action: CollectionModalActions;
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
    return (options as CollectionModalOptions).action !== undefined;
}

export interface NotificationModalOptions {
    message1: string,
    message2: string
}