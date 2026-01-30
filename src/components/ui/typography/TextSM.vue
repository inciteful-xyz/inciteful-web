<template>
  <p :class="classes" v-bind="$attrs">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

export interface TextSMProps {
  class?: any
}

const props = defineProps<TextSMProps>()

const classes = computed(() =>
  cn('leading-snug', props.class)
)
</script>
