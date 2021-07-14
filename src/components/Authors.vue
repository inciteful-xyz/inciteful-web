<template>
  <span>
    <span v-for="(author, index) in sortedAuthors" :key="index">
      <span
        v-if="showAll || index == 0 || index == sortedAuthors.length - 1"
        :title="author.affiliation"
      >
        {{ makeText(author, index) }}
        <span v-if="showAffiliation">({{ author.affiliation }})</span>
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
export default {
  name: 'Authors',
  props: {
    showAffiliation: { type: Boolean, default: false },
    authors: Array,
    separator: { type: String, default: ', ' },
    showAll: { type: Boolean, default: false }
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
    makeText (author, index) {
      const useSep =
        this.sortedAuthors.length > 1 &&
        index !== this.sortedAuthors.length - 1
      return `${author.name}${useSep ? this.separator : ''}`
    }
  }
}
</script>
