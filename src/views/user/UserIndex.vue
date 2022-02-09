<template>
  <div class="py-3">
    <div class="flex justify-center">
      <div class="flex-auto  max-w-2xl">
        <h1 class="text-xl">User Dashboard</h1>
        <p class="py-2">
          Body
        </p>
        <div v-for="(collection, index) in paperCollections" :key="index">
          {{ collection.name }}
        </div>
        <div v-if="!userData">
          Favorite Papers
          <div v-for="(paper, index) in favoritePapers" :key="index">
            {{ paper.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useDBStore } from '@/stores/db'
import api from '@/utils/api'
import { storeToRefs } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    let db = useDBStore()
    let { paperCollections } = storeToRefs(db)
    let favoritePapers = () => {
      if (db.userData) {
        return api.getPapers(db.userData.favoritePapers, true)
      }
      return Promise.resolve([])
    }

    return { paperCollections, favoritePapers }
  }
})
</script>
