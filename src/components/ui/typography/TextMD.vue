<template>
  <p :class="classes" v-bind="$attrs">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

export interface TextMDProps {
  class?: any
}

const props = defineProps<TextMDProps>()

const classes = computed(() =>
  cn('text-lg leading-snug', props.class)
)
</script>
