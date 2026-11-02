<template>
  <AnnouncementBanner>
    <template v-slot:title>
      Use Inciteful from inside Zotero with our free plugin for Zotero 8, 9 and 10.
      <router-link to="/zotero" class="text-theme-violet hover:underline font-medium">Get the Zotero plugin</router-link>
    </template>
  </AnnouncementBanner>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import AnnouncementBanner from '@/components/announcements/AnnouncementBanner.vue'

export default defineComponent({
  name: 'ZoteroAnnouncement',
  components: {
    AnnouncementBanner
  }
})
</script>
