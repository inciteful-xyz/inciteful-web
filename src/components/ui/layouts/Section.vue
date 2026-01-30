<template>
  <section :class="sectionClasses" v-bind="$attrs">
    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

export interface SectionProps {
  class?: any
}

const props = defineProps<SectionProps>()

const sectionClasses = computed(() =>
  cn('py-6 md:py-10 relative', props.class)
)
</script>
