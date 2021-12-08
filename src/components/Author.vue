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

<script>
import Vue from 'vue'
import bus from '../utils/bus'

export default Vue.extend({
  name: 'Author',
  props: {
    showAffiliation: { type: Boolean, default: false },
    author: Object,
    ids: Array
  },
  methods: {
    showModal (author) {
      const options = {
        author,
        graphIds: this.ids
      }
      bus.$emit('show_paper_modal', options)
    }
  }
})
</script>
