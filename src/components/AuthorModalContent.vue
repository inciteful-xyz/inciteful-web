<template>
  <div>
    <h1 class="text-lg font-bold text-gray-800 leading-tight lg:text-2xl pr-3">
      Other graph papers by {{ options.author.name }}
    </h1>
    <sql-view :ids="options.contextIds" :sql="sql" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SqlView from './SqlView.vue'
import { AuthorModalOptions } from '../types/inciteful'

export default defineComponent({
  name: 'AuthorModalContent',
  components: {
    SqlView
  },
  emits: ['clearModal'],
  props: {
    options: Object() as PropType<AuthorModalOptions>
  },
  computed: {
    sql () {
      if (this.options)
        return `SELECT paper_id, doi, authors, title, published_year, adamic_adar + COALESCE(cocite, 0) as similarity, num_cited_by\nFROM papers p\nWHERE {{filters}} AND p.paper_id IN (SELECT paper_id FROM authors WHERE author_id = ${this.options.author.author_id}) ORDER BY similarity DESC, published_year DESC`
      else return ''
    }
  }
})
</script>
