<template>
  <div class="shadow-box mt-3">
    <table class="base-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Count</th>
          <th>Created</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="collection in paperCollections" :key="collection.id">
          <td>{{ collection.name }}</td>
          <td>{{ collection.papers.length }} papers</td>
          <td>
            {{ collection.dateCreated.toDate().toLocaleDateString() }}
          </td>
          <td>
            <button class="text-purple-500">
              Details
            </button>
          </td>
          <td>
            <button
              @click="deleteCollection(collection.id)"
              class="text-purple-500"
            >
              Delete
            </button>
          </td>

          <td>
            <button
              @click="addToCollection(collection.id)"
              class="text-purple-500"
            >
              View Graph
            </button>
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

export default defineComponent({
  setup () {
    let pc = usePaperCollectionStore()
    let { paperCollections } = storeToRefs(pc)

    let deleteCollection = (id: string) => {
      if (confirm('Are you sure you want to delete this collection?')) {
        pc.deletePaperCollection(id)
        showNotificationHelper({
          message1: 'Collection deleted',
          message2: ''
        })
      }
    }

    return { paperCollections, deleteCollection }
  }
})
</script>
