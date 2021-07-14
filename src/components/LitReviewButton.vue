<template>
  <button
    v-if="idsToHide.indexOf(this.id.toString()) == -1"
    class="
      add-paper-button
      font-extrabold
      text-sm
      rounded-full
      h-5
      w-5
      bg-purple-500
      text-white
      justify-center
    "
    title="Add paper to a literature review search"
    v-on:click="addToLitReview()"
  >
    +
  </button>
</template>

<script>
import bus from '../utils/bus'

export default {
  name: 'LitReviewButton',
  props: {
    ids: Array,
    id: undefined
  },
  data () {
    return {
      isSubmitted: false,
      idsToHide: []
    }
  },
  mounted () {
    bus.$on('add_to_lit_review', id => {
      this.idsToHide.push(id)
    })
  },
  created () {
    if (this.ids) {
      this.ids.forEach(id => this.idsToHide.push(id))
    }
  },
  methods: {
    addToLitReview () {
      if (this.id) {
        bus.$emit('add_to_lit_review', this.id.toString())
      }
    }
  }
}
</script>
