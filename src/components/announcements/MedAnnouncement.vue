<template>
  <AnnouncementBanner>
    <template v-slot:title>
        Introducing <a class="text-theme-violet hover:underline font-medium" href="https://incitefulmed.com" target="_blank">Inciteful Med</a> - AI-powered medical insights!
    </template>
    <template v-slot:message>
      Get instant, patient friendly, verifiable answers to medical questions and analyze your own records. All anchored in peer-reviewed literature. Transform how you understand and access medical knowledge.
    </template>
    <template v-slot:action>
      <a href="https://incitefulmed.com" target="_blank" class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-theme-violet hover:bg-theme-violet-2 transition-colors">
        Try It Now
        <svg class="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </template>
  </AnnouncementBanner>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import AnnouncementBanner from '@/components/announcements/AnnouncementBanner.vue'

export default defineComponent({
  name: 'MedAnnouncement',
  components: {
    AnnouncementBanner
  }
})
</script>
