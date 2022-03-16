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
  },
  computed: {
    sql () {
      if (this.author) {
        return `SELECT paper_id, doi, authors, title, published_year, adamic_adar + COALESCE(cocite, 0) as similarity, num_cited_by\nFROM papers p\nWHERE {{filters}} AND p.paper_id IN (SELECT paper_id FROM authors WHERE author_id = ${this.author.author_id}) ORDER BY similarity DESC, published_year DESC`
      }
      return ''
    }
  }
})
</script>
