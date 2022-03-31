export type ZoteroKey = string;

export interface ZoteroData {
    token: ZoteroToken,
    syncedCollections: Record<string, ZoteroKey> | undefined
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

