<template>
  <h4 :class="classes" v-bind="$attrs">
    <slot />
  </h4>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

export interface TitleSupProps {
  class?: any
}

const props = defineProps<TitleSupProps>()

const classes = computed(() =>
  cn(
    'text-theme-violet uppercase md:text-sm font-medium font-dm-mono leading-snug md:leading-snug',
    props.class
  )
)
</script>
