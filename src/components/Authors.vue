<template>
  <span>
    <span v-for="(author, index) in sortedAuthors" :key="index">
      <span v-if="showAll || index == 0 || index == sortedAuthors.length - 1">
        <button
          v-on:click="showModal(author)"
          :title="author.affiliation"
          class="hover:underline"
        >
          {{ author.name }}
          <span v-if="showAffiliation">({{ author.affiliation }})</span>
        </button>
        <span v-if="useSeperator(index)">{{ separator }}</span>
      </span>
      <span
        v-if="
          !showAll &&
            index != 0 &&
            index != sortedAuthors.length - 1 &&
            index == 1
        "
      >
        ...
      </span>
    </span>
  </span>
</template>

<script>
import bus from '../utils/bus'

export default {
  name: 'Authors',
  props: {
    showAffiliation: { type: Boolean, default: false },
    authors: Array,
    separator: { type: String, default: ', ' },
    showAll: { type: Boolean, default: false },
    ids: Array
  },
  computed: {
    sortedAuthors () {
      if (this.authors) {
        const sortAuth = [...this.authors]
        sortAuth.sort((a, b) => a.sequence - b.sequence)
        return sortAuth
      } else {
        return null
      }
    }
  },
  methods: {
    useSeperator (index) {
      return (
        this.sortedAuthors.length > 1 && index !== this.sortedAuthors.length - 1
      )
    },
    makeText (author) {
      return `${author.name}`
    },
    showModal (author) {
      const options = {
        author,
        graphIds: this.ids
      }
      bus.$emit('show_paper_modal', options)
    }
  }
}
</script>
