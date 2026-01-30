<template>
  <p :class="classes" v-bind="$attrs">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

export interface TextLGProps {
  class?: any
}

const props = defineProps<TextLGProps>()

const classes = computed(() =>
  cn('text-lg md:text-2xl leading-snug', props.class)
)
</script>
