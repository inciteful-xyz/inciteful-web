<template>
  <single-column>
    <div class="py-3">
      <div class="flex justify-center">
        <div class="flex-auto  max-w-6xl">
          <h1>User Dashboard</h1>
          <p class="py-2">
            Body
          </p>
          <div v-for="(collection, index) in paperCollections" :key="index">
            {{ collection.name }}
          </div>
          <div>
            Favorite Papers
            <favorite-papers />
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
