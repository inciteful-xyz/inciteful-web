<template>
  <div>
    <div v-if="paper">
      <button
        :title="paper.title"
        v-on:click="bus.$emit('show_paper_modal', { paperId: paper.id })"
        class="underline block font-semibold pb-2 text-left"
      >
        {{ paper.title }}
      </button>
      <div v-if="paper.author" class="font-semibold text-gray-500">
        <Authors :authors="paper.author" :ids="ids" />
      </div>
      <span>
        <i>{{ paper.journal }}</i
        >{{ paper.published_year && paper.journal ? ',' : '' }}
        {{ paper.published_year ? `${paper.published_year}` : '' }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Authors from './Authors.vue'
import bus from '../utils/bus'
import { PropType } from 'vue/types/umd'
import { Paper, PaperID } from '@/types/inciteful'

export default Vue.extend({
  components: { Authors },
  name: 'PaperCard',
  props: {
    paper: {} as PropType<Paper>
  },
  computed: {
    ids (): PaperID[] {
      return [this.paper.id]
    }
  },
  data () {
    return {
      bus
    }
  }
})
</script>
