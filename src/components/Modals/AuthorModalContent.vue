<template>
  <div>
    <h1>Other graph papers by {{ options.author.name }}</h1>
    <sql-view :ids="options.contextIds" :sql="sql" />
    <button v-on:click="$emit('back')" class="button-gray mt-4">
      Back
    </button>
  </div>
</template>

<script lang="ts">
import { AuthorModalOptions } from '@/types/modalTypes'
import { defineComponent, PropType } from 'vue'
import SqlView from '../SqlView.vue'

export default defineComponent({
  name: 'AuthorModalContent',
  components: {
    SqlView
  },
  emits: ['back'],
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
