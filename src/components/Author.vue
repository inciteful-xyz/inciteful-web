<template>
  <button
    v-on:click="showModal(author)"
    :title="author.affiliation"
    class="hover:underline"
  >
    {{ author.name }}
    <span v-if="showAffiliation">({{ author.affiliation }})</span>
  </button>
</template>

<script lang="ts">
import { Author } from '@/types/inciteful'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'Author',
  props: {
    showAffiliation: { type: Boolean, default: false },
    author: {} as PropType<Author>,
    ids: Array
  },
  methods: {
    showModal (author: Author) {
      const options = {
        author,
        graphIds: this.ids
      }
      this.emitter.emit('show_paper_modal', options)
    }
  }
})
</script>
