<template>
  <li
    :id="itemId"
    role="option"
    :aria-selected="isHighlighted"
    class="cursor-pointer p-3 border-b border-gray-100 last:border-b-0 hover:bg-theme-pink transition-colors text-left"
    :class="{ 'bg-theme-pink': isHighlighted }"
    @click="$emit('select')"
  >
    <div class="text-sm font-medium text-theme-charcoal" v-html="result.title"></div>
    <div class="text-xs text-gray-500 mt-1">
      <Authors :authors="result.author" /> ({{ result.published_year }}) -
      {{ formatNumber(result.num_cited_by) }} citations
    </div>
  </li>
</template>

<script setup lang="ts">
import numeral from 'numeral'
import Authors from '@/components/Authors.vue'
import { Paper } from '@/types/incitefulTypes'

interface Props {
  result: Paper
  itemId?: string
  isHighlighted?: boolean
}

withDefaults(defineProps<Props>(), {
  isHighlighted: false
})

defineEmits<{
  select: []
}>()

function formatNumber(val: number) {
  return numeral(val).format('0,0.[000000]')
}
</script>
