<template>
  <h3 :class="classes" v-bind="$attrs">
    <slot />
  </h3>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

export interface TitleSMProps {
  class?: any
}

const props = defineProps<TitleSMProps>()

const classes = computed(() =>
  cn(
    'text-black font-battambang text-xl leading-tight md:leading-tight',
    props.class
  )
)
</script>
