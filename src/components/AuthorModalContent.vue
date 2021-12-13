<template>
  <div>
    <h1 class="text-lg font-bold text-gray-800 leading-tight lg:text-2xl pr-3">
      Other graph papers by {{ author.name }}
    </h1>
    <sql-view :ids="ids" :sql="sql" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SqlView from './SqlView.vue'

export default defineComponent({
  name: 'AuthorModalContent',
  components: {
    SqlView
  },
  props: {
    author: Object,
    ids: Array,
    options: Object
  }
})
</script>
