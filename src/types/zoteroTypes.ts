import { Timestamp } from 'firebase/firestore';
import { PaperID } from './incitefulTypes';
export type ZoteroKey = string;

export interface ZoteroCollectionSync {
    key: ZoteroKey;
    dateUpdated: Timestamp;
    dateCreated: Timestamp;
    itemSyncStatus: { [id: PaperID]: ZoteroSyncStatus };
}

export interface ZoteroSyncStatus {
    lastSynced?: Timestamp;
    actionTaken?: ZoteroSyncAction;
}

export enum ZoteroSyncAction {
    Added = 'ADDED',
    Removed = 'REMOVED',
    Updated = 'UPDATED',
}

export interface ZoteroData {
    token: ZoteroToken,
    syncedCollections: { [id: string]: ZoteroCollectionSync } | undefined
    collections: ZoteroCollection[] | undefined
}

export interface ZoteroToken {
    oauthToken: string,
    oauthTokenSecret: string,
    username: string | undefined,
    userId: string | undefined
}

export interface ZoteroCollection {
    key: ZoteroKey,
    parentCollection: ZoteroKey | false,
    name: string,
}

export interface NestedZoteroCollection extends ZoteroCollection {
    childCollections: ZoteroCollectionNode | undefined,
}

export type ZoteroCollectionNode = Record<ZoteroKey, NestedZoteroCollection>

export interface ZoteroPaper {
    key: ZoteroKey,
}

export interface ZoteroIdMatch {
    key: ZoteroKey,
    ids: PaperID[],
}

export interface ZoteroItem {
    key: string,
    version: number,
    itemType: string,
    title: string,
    creators: ZoteroCreator[],
    abstractNote: string,
    publicationTitle: string,
    volume: string,
    issue: string,
    pages: string,
    date: string,
    series: string,
    seriesTitle: string,
    seriesText: string,
    journalAbbreviation: string,
    language: string,
    DOI: string,
    ISSN: string,
    shortTitle: string,
    url: string,
    accessDate: string,
    archive: string,
    archiveLocation: string,
    libraryCatalog: string,
    callNumber: string,
    rights: string,
    extra: string,
    tags: string[],
    collections: string[],
    dateAdded: string,
    dateModified: string,
}

export interface ZoteroCreator {
    creatorType: string,
    firstName: string,
    lastName: string,
}

