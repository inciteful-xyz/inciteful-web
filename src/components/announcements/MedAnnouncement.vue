<template>
  <AnnouncementBanner>
    <template v-slot:title>
        Introducing <a class="underline" href="https://incitefulmed.com" target="_blank">Inciteful Med</a> - AI-powered medical insights!
    </template>
    <template v-slot:message>
      Get instant, patient friendly, verifiable answers to medical questions and analyze your own records.  All anchored in peer-reviewed literature. Transform how you understand and access medical knowledge.
    </template>
    <template v-slot:action>
      <a href="https://incitefulmed.com" target="_blank" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
        Try It Now
        <svg class="ml-1 -mr-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
