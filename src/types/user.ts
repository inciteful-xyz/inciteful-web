import { PaperID } from "./inciteful";

export interface User {
    id: string,
    zoteroToken: ZoteroToken | null,
    favoritePapers: PaperID[]
}

enum ItemVisibility {
    Hidden = "HIDDEN",
    Public = "PUBLIC",
}

export interface ZoteroToken {
    oauthToken: string,
    oauthTokenSecret: string,
    username: string | undefined,
    userId: string | undefined
}

export interface PaperCollection {
    id: string,
    ownerId: string,
    parentID: string | null,
    visibility: ItemVisibility,
    name: string,
    papers: CollectionPaper[]
    zoteroKey: string | null,
}

export interface CollectionPaper {
    paperId: PaperID
    zoteroKey: string | null
}
