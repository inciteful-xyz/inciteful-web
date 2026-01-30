<template>
  <h2 :class="classes" v-bind="$attrs">
    <slot />
  </h2>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

export interface TitleMDProps {
  class?: any
}

const props = defineProps<TitleMDProps>()

const classes = computed(() =>
  cn(
    'text-xl md:text-3xl font-light font-battambang text-black leading-tight md:leading-tight',
    props.class
  )
)
</script>
