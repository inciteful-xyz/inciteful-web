<template>
  <div class="flex flex-col sm:flex-row sm:flex-wrap justify-center items-start gap-4 sm:gap-x-8 sm:gap-y-4 max-w-4xl w-full px-4 sm:px-0 ml-8 sm:ml-0">
    <div v-for="feature in features" :key="feature" class="flex items-center gap-2 sm:gap-3 justify-start">
      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-theme-violet flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="text-sm sm:text-base text-theme-charcoal">{{ feature }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  features: string[]
}

defineProps<Props>()
</script>
