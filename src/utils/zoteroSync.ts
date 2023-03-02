import { ZoteroItem, ZoteroIdMatch, ZoteroKey } from '../types/zoteroTypes';
import { PaperID } from '../types/incitefulTypes';
import { IncitefulCollectionItem } from '@/types/userTypes';


function getIdentifiers(items: ZoteroItem[]): ZoteroIdMatch[] {
    return items.map(item => {
        return {
            key: item.key,
            ids: getIdsFromItem(item),
        } as ZoteroIdMatch
    })
}

function getIdsFromItem(item: ZoteroItem): PaperID[] {
    const ids: PaperID[] = []

    if (item.DOI)
        ids.push(item.DOI)

    if (item.url)
        ids.push(item.url)

    return ids
}

function mergeItems(incitefulItems: IncitefulCollectionItem[], zoteroItems: ZoteroItem[], matchedIds: Record<ZoteroKey, PaperID>) {
    throw new Error('Not implemented')
}

export default {
    getIdentifiers
}