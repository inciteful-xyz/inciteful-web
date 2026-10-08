<template>
  <a :href="MED_HOME_URL" @click="trackMedLinkClick('hero')"
    class="inline-flex items-center gap-1 rounded-full bg-white border border-theme-pink px-4 py-1.5 text-sm text-theme-charcoal hover:border-theme-violet hover:text-theme-violet transition-colors">
    <span>Looking for <span class="font-semibold text-theme-violet">Inciteful Med</span>?</span>
    <span class="hidden sm:inline">Evidence-based answers to your health questions</span>
    <span aria-hidden="true">&rarr;</span>
  </a>
</template>

<script setup lang="ts">
import { MED_HOME_URL } from '@/utils/config'
import { trackMedLinkClick } from '@/utils/medLink'
</script>
