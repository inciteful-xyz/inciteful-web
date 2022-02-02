<template>
  <div class="py-3">
    <div class="flex justify-center">
      <div class="flex-auto  max-w-2xl">
        <h1 class="text-xl">User Dashboard</h1>
        <p class="py-2">
          Body
        </p>
        <div v-for="(collection, index) in db.paperCollections" :key="index">
          {{ collection.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useDBStore } from '@/stores/db'
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    let db = useDBStore()

    return { db: db }
  }
})
</script>
