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

export interface PaperCollection {
    id: string | null,
    ownerId: string,
    parentID: string | null,
    visibility: ItemVisibility,
    name: string,
    papers: CollectionPaper[]
    dateCreated: Timestamp
}

export interface CollectionPaper {
    paperId: PaperID
}
