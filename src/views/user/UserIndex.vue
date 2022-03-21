<template>
  <single-column>
    <div class="py-3">
      <div class="flex justify-center">
        <div class="flex-auto  max-w-6xl">
          <h1>User Dashboard</h1>
          <div>
            <div class="flex pt-6">
              <h2 class="flex-grow">Collections</h2>
              <div>
                <router-link :to="{ name: 'Zotero' }" class="text-purple-500">
                  Manage Zotero Connection
                </router-link>
              </div>
            </div>
            <div class="shadow-box mt-3">
              <table class="base-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Count</th>
                    <th>Created</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="collection in paperCollections"
                    :key="collection.id"
                  >
                    <td>{{ collection.name }}</td>
                    <td>{{ collection.papers.length }} papers</td>
                    <td>
                      {{ collection.dateCreated.toDate().toLocaleDateString() }}
                    </td>
                    <td>
                      <button
                        @click="addToCollection(collection.id)"
                        class="text-purple-500"
                      >
                        Details
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

            <div class="pt-6">
              <h2>Favorite Papers</h2>
              <favorite-papers />
            </div>
          </div>
        </div>
      </div>
    </div>
  </single-column>
</template>
<script lang="ts">
import SingleColumn from '@/components/layout/SingleColumn.vue'
import { useDBStore } from '@/stores/db'
import { storeToRefs } from 'pinia'
import { defineComponent } from 'vue'
import FavoritePapers from '../../components/FavoritePapers.vue'

export default defineComponent({
  components: {
    FavoritePapers,
    SingleColumn
  },
  setup () {
    let db = useDBStore()
    let { paperCollections } = storeToRefs(db)

    return { paperCollections }
  }
})
</script>
