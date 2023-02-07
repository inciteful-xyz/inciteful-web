<template>
  <span v-if="paper">
    <span v-if="paper.doi">
      <a
        class="underline hover:no-underline"
        target="_blank"
        :href="`https://doi.org/${paper.doi}`"
        >Publisher</a
      >
      |
      <a
        class="underline hover:no-underline"
        target="_blank"
        :href="`https://libkey.io/${paper.doi}?utm_source=inciteful`"
        >Full Text from LibKey</a
      >
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Paper } from '../types/incitefulTypes'
export default defineComponent({
  name: 'ExternalLinks',
  props: {
    paper: {} as PropType<Paper>
  }
})
</script>
