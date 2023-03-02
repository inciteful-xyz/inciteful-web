import { Timestamp } from "firebase/firestore";
import { PaperID } from "./incitefulTypes";

export interface UserData {
    id: string,
    favoritePapers: PaperID[]
}

export enum ItemVisibility {
    Hidden = "HIDDEN",
    Public = "PUBLIC",
}

export interface IncitefulCollection {
    id: string | null,
    ownerId: string,
    parentID: string | null,
    visibility: ItemVisibility,
    name: string,
    papers: IncitefulCollectionItem[]
    dateCreated: Timestamp
}

export enum IncitefulCollectionItemSource {
    Inciteful = "INCITEFUL",
    Zotero = "ZOTERO",
}
export interface IncitefulCollectionItem {
    paperId: PaperID,
    dateAdded: Timestamp,
    source: IncitefulCollectionItemSource,
}
