<template>
  <single-column>
    <div class="py-3">
      <div class="flex justify-center">
        <div class="flex-auto  max-w-6xl">
          <h1>User Dashboard</h1>
          <div>
            <div class="flex pt-6">
              <h2 class="flex-grow">Collections</h2>
              <div class="flex-shrink justify-end">
                <router-link :to="{ name: 'Zotero' }" class="button-purple">
                  Manage Zotero Connection
                </router-link>
              </div>
            </div>
            <collection-manager />
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
import { usePaperCollectionStore } from '@/stores/paperCollectionStore'
import { storeToRefs } from 'pinia'
import { defineComponent } from 'vue'
import FavoritePapers from '../../components/FavoritePapers.vue'
import CollectionManager from '../../components/CollectionManager.vue'

export default defineComponent({
  components: {
    FavoritePapers,
    CollectionManager,
    SingleColumn
  },
  setup () {
    let db = usePaperCollectionStore()
    let { paperCollections } = storeToRefs(db)

    return { paperCollections }
  }
})
</script>
