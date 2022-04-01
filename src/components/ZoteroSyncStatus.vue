<template>
  <div class="flex-shrink">
    <div v-if="isSynced">
      Synced to
      <span class="italic pr-3 border-r-2 mr-3">"{{ syncedTo }}"</span>
      <button
        class="text-purple-500 text-sm hover:underline"
        @click="clearSync()"
      >
        Clear
      </button>
    </div>
    <button
      v-else
      class="text-purple-500 text-sm hover:underline"
      @click="setupSync()"
    >
      Sync
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { ZoteroKey } from '../types/zoteroTypes'
import { useZoteroStore } from '@/stores/zoteroStore'
import {
  SyncIncitefulCollectionAction,
  SyncZoteroCollectionAction
} from '../types/modalTypes'
import { showModalHelper } from '@/utils/emitHelpers'
import { usePaperCollectionStore } from '@/stores/paperCollectionStore'

export default defineComponent({
  props: {
    zoteroKey: {} as PropType<ZoteroKey>,
    incitefulKey: {} as PropType<string>
  },
  setup (props) {
    let zotero = useZoteroStore()
    let pc = usePaperCollectionStore()

    let zoteroCollection = computed(() => {
      return props.zoteroKey
        ? zotero.getZoteroCollection(props.zoteroKey)
        : undefined
    })

    let incitefulCollection = computed(() => {
      return props.incitefulKey
        ? pc.getPaperCollection(props.incitefulKey)
        : undefined
    })

    let syncedTo = computed(() => {
      if (props.zoteroKey) {
        return zotero.getSyncedByZoteroKey(props.zoteroKey)?.name
      } else if (props.incitefulKey) {
        return zotero.getSyncedByIncitefulKey(props.incitefulKey)?.name
      } else return undefined
    })

    let setupSync = () => {
      if (zoteroCollection.value) {
        let action: SyncZoteroCollectionAction = {
          zoteroKey: zoteroCollection.value.key,
          zoteroName: zoteroCollection.value.name
        }
        showModalHelper({ action })
      } else if (incitefulCollection.value?.id) {
        let action: SyncIncitefulCollectionAction = {
          incitefulKey: incitefulCollection.value.id,
          incitefulName: incitefulCollection.value.name
        }
        showModalHelper({ action })
      }
    }

    let clearSync = () => {
      if (props.zoteroKey) {
        zotero.clearSyncByZoteroKey(props.zoteroKey)
      } else if (props.incitefulKey) {
        zotero.clearSyncByIncitefulKey(props.incitefulKey)
      }
    }

    let isSynced = computed(() => !!syncedTo.value)

    return {
      clearSync,
      setupSync,
      isSynced,
      syncedTo
    }
  }
})
</script>
