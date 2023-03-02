<template>
  <ul>
    <li v-for="(key, index) in keys" :key="`${index}`">
      <div class="flex mb-2 mt-2">
        <div class="flex-grow">
          <button @click="isCollapsed[key] = !isCollapsed[key]">
            <ChevronDownIcon
              v-if="collections[key].childCollections && !isCollapsed[key]"
              class="h-5 w-5 text-violet-400 inline"
            />
            <ChevronRightIcon
              v-if="collections[key].childCollections && isCollapsed[key]"
              class="h-5 w-5 text-violet-400 inline"
            />
          </button>
          <FolderIcon
            class="h-5 w-5 text-violet-400 inline"
            :class="{ 'ml-5': !collections[key].childCollections }"
          />

          {{ collections[key].name }}
        </div>
        <div class="flex-shrink">
          <zotero-sync-status :zoteroKey="key" />
        </div>
      </div>
      <zotero-nested-collection-view
        class="border-l-2 ml-8 pl-2"
        v-if="collections[key].childCollections && !isCollapsed[key]"
        :collections="collections[key].childCollections"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import {
  ZoteroCollectionNode,
  ZoteroKey,
  NestedZoteroCollection
} from '../types/zoteroTypes'
import { useZoteroStore } from '@/stores/zoteroStore'
import { SyncZoteroCollectionAction } from '../types/modalTypes'
import { showModalHelper } from '@/utils/emitHelpers'
import {
  FolderIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/vue/solid'
import ZoteroSyncStatus from './ZoteroSyncStatus.vue'

export default defineComponent({
  components: {
    FolderIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ZoteroSyncStatus
  },
  props: {
    collections: {} as PropType<ZoteroCollectionNode>
  },
  setup(props) {
    let zotero = useZoteroStore()
    let isCollapsed = ref({} as Record<string, boolean>)

    let keys = computed(() => {
      if (!props.collections) return []
      let keys = Object.keys(props.collections)

      keys.sort((a, b) => {
        if (!props.collections) return 0
        if (props.collections[a].name < props.collections[b].name) {
          return -1
        }
        if (props.collections[a].name > props.collections[b].name) {
          return 1
        }
        return 0
      })

      return keys
    })
    let setupSync = (collection: NestedZoteroCollection) => {
      console.log(collection)
      let action: SyncZoteroCollectionAction = {
        zoteroKey: collection.key,
        zoteroName: collection.name
      }
      showModalHelper({ action })
    }
    let clearSync = (key: ZoteroKey) => {
      zotero.clearSyncByZoteroKey(key)
    }

    return {
      keys,
      clearSync,
      setupSync,
      isSynced: zotero.isSyncedByZoteroKey,
      syncedTo: zotero.getSyncedByZoteroKey,
      isCollapsed
    }
  }
})
</script>
