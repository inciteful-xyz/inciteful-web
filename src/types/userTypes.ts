import { Timestamp } from "firebase/firestore";
import { PaperID } from "./incitefulTypes";

export interface User {
    id: string,
    zoteroToken: ZoteroToken | null,
    favoritePapers: PaperID[]
}

export enum ItemVisibility {
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
    id: string | null,
    ownerId: string,
    parentID: string | null,
    visibility: ItemVisibility,
    name: string,
    papers: CollectionPaper[]
    zoteroKey: string | null,
    dateCreated: Timestamp
}

export interface CollectionPaper {
    paperId: PaperID
    zoteroKey: string | null
}
