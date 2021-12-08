<template>
  <span>
    <span v-for="(author, index) in sortedAuthors" :key="index">
      <span v-if="showAll || index == 0 || index == sortedAuthors.length - 1">
        <author
          :author="author"
          :ids="ids"
          :showAffiliation="showAffiliation"
        />
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
import Vue from 'vue'
import Author from './Author.vue'
export default Vue.extend({
  components: { Author },
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
    }
  }
})
</script>
