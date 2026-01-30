<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

export interface ContainerProps {
  class?: any
  md?: boolean
  sm?: boolean
  xs?: boolean
  fluid?: boolean
}

const props = defineProps<ContainerProps>()

const containerClasses = computed(() =>
  cn(
    'container mx-auto px-4',
    props.class,
    props.md && 'max-w-6xl',
    props.sm && 'max-w-3xl',
    props.xs && 'max-w-2xl',
    props.fluid && 'w-full max-w-full',
  )
)
</script>
