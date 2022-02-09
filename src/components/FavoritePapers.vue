<template>
  <table-base>
    <template v-slot:header>
      <th></th>
      <th>Title</th>
      <th>First Author</th>
      <th>Year</th>
      <th>Cited</th>
    </template>
    <template v-slot:rows>
      <tr v-for="paper in favoritePapers" :key="paper.id">
        <td>{{ collection.name }}</td>
        <td>{{ paper.title }}</td>
        <td>{{ collection.name }}</td>
        <td>{{ collection.name }}</td>
        <td>{{ collection.name }}</td>
      </tr>
    </template>
  </table-base>
</template>

<script lang="ts">
import { useDBStore } from '@/stores/db'
import { Paper } from '@/types/inciteful'
import api from '@/utils/api'
import { defineComponent, onMounted, ref } from 'vue'
import TableBase from './TableBase.vue'

export default defineComponent({
  components: { TableBase },
  setup () {
    let db = useDBStore()
    let favoritePapers = ref([] as Paper[])

    onMounted(() => {
      if (db.userData) {
        api
          .getPapers(db.userData.favoritePapers, true)
          .then(papers => (favoritePapers.value = papers))
      }
    })

    return { favoritePapers }
  }
})
</script>
