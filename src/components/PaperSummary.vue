<template>
  <div>
    <div v-if="paper">
      <button
        :title="paper.title"
        v-on:click="bus.$emit('show_paper_modal', paper.id)"
        class="underline block font-semibold pb-2 text-left"
      >
        {{ paper.title }}
      </button>
      <div v-if="paper.author" class="font-semibold text-gray-500">
        <Authors :authors="paper.author" />
      </div>
      <span>
        <i>{{ paper.journal }}</i
        >{{ paper.published_year && paper.journal ? "," : "" }}
        {{ paper.published_year ? `${paper.published_year}` : "" }}
      </span>
    </div>
  </div>
</template>

<script>
import Authors from './Authors.vue'
import bus from '../utils/bus'

export default {
  components: { Authors },
  name: 'PaperCard',
  props: {
    paper: Object
  },
  data () {
    return {
      bus
    }
  }
}
</script>
