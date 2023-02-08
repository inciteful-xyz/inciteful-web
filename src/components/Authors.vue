<template>
  <span>
    <span v-for="(author, index) in sortedAuthors" :key="index">
      <span v-if="showAll || index == 0 || index == sortedAuthors.length - 1">
        <AuthorComp
          :author="author"
          :ids="ids"
          :showAffiliation="showAffiliation"
          :authorClass="authorClass"
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

<script lang="ts">
import { Author, PaperID } from '@/types/incitefulTypes'
import { defineComponent, PropType } from 'vue'
import AuthorComp from './Author.vue'

export default defineComponent({
  components: { AuthorComp },
  name: 'Authors',
  props: {
    showAffiliation: { type: Boolean, default: false },
    authors: {} as PropType<Author[]>,
    separator: { type: String, default: ', ' },
    showAll: { type: Boolean, default: false },
    authorClass: {} as PropType<string[]>,
    ids: {} as PropType<PaperID[]>
  },
  computed: {
    sortedAuthors(): Author[] {
      if (this.authors) {
        const sortAuth = [...this.authors]
        sortAuth.sort((a, b) => a.sequence - b.sequence)
        return sortAuth
      } else {
        return []
      }
    }
  },
  methods: {
    useSeperator(index: number) {
      return (
        this.sortedAuthors.length > 1 && index !== this.sortedAuthors.length - 1
      )
    }
  }
})
</script>
