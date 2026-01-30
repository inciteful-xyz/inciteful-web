<template>
  <p :class="classes" v-bind="$attrs">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

export interface TextXSProps {
  class?: any
}

const props = defineProps<TextXSProps>()

const classes = computed(() =>
  cn('text-sm font-medium leading-5 font-dm-sans', props.class)
)
</script>
