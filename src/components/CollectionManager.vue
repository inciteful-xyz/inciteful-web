<template>
  <div class="shadow-box mt-3">
    <table class="base-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Count</th>
          <th>Created</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="collection in paperCollections" :key="collection.id">
          <td>
            <router-link
              class="hover:underline text-violet-500"
              :to="{
                name: 'CollectionView',
                params: { pathMatch: collection.id }
              }"
              >{{ collection.name }}</router-link
            >
          </td>
          <td>{{ collection.papers.length }} papers</td>
          <td>
            {{ collection.dateCreated.toDate().toLocaleDateString() }}
          </td>
          <td>
            <div class="flex justify-end">
              <div v-if="zotero.isSetup" class="flex-shrink px-3 border-r-2">
                <zotero-sync-status :incitefulKey="collection.id" />
              </div>
              <div class="flex-shrink border-r-2 px-3">
                <button class="hover:underline text-violet-500">
                  Details
                </button>
              </div>
              <div class="flex-shrink px-3">
                <button
                  @click="deleteCollection(collection.id)"
                  class="hover:underline text-violet-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia'
import { defineComponent } from 'vue'
import { usePaperCollectionStore } from '@/stores/paperCollectionStore'
import { showNotificationHelper } from '@/utils/emitHelpers'
import { useZoteroStore } from '@/stores/zoteroStore'
import ZoteroSyncStatus from './ZoteroSyncStatus.vue'

export default defineComponent({
  components: {
    ZoteroSyncStatus
  },
  setup() {
    let pc = usePaperCollectionStore()
    let { paperCollections } = storeToRefs(pc)
    let zotero = useZoteroStore()

    let deleteCollection = (id: string) => {
      if (confirm('Are you sure you want to delete this collection?')) {
        pc.deletePaperCollection(id)
        showNotificationHelper({
          message1: 'Collection deleted',
          message2: ''
        })
      }
    }

    return {
      paperCollections,
      deleteCollection,
      zotero
    }
  }
})
</script>
