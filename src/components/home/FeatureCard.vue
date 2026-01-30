<template>
  <div class="flex flex-col gap-2 sm:gap-4 p-4 sm:p-6 border border-theme-pink rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
    <div
      v-if="icon"
      class="flex items-center justify-center h-12 w-12 rounded-xl bg-theme-violet text-white"
    >
      <component :is="icon" class="h-6 w-6" />
    </div>
    <h3 class="text-black font-battambang text-xl leading-tight">{{ title }}</h3>
    <p class="leading-snug text-theme-charcoal">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

export interface FeatureCardProps {
  title: string
  text: string
  icon?: Component
}

defineProps<FeatureCardProps>()
</script>
