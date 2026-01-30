<template>
  <h1 :class="classes" v-bind="$attrs">
    <slot />
  </h1>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

export interface TitleLGProps {
  class?: any
}

const props = defineProps<TitleLGProps>()

const classes = computed(() =>
  cn(
    'text-3xl md:text-5xl font-light font-battambang text-black leading-tight md:leading-tight',
    props.class
  )
)
</script>
