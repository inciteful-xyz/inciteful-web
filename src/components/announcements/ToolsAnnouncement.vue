<template>
  <AnnouncementBanner>
    <template v-slot:title>
      Use Inciteful inside Zotero, or inside Claude, ChatGPT and other AI assistants. Both are free.
      <router-link to="/zotero" class="text-theme-violet hover:underline font-medium">Get the Zotero plugin</router-link>
      or
      <a href="https://incitefulmed.com/academic/mcp" class="text-theme-violet hover:underline font-medium">connect the MCP server</a>
    </template>
  </AnnouncementBanner>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import AnnouncementBanner from '@/components/announcements/AnnouncementBanner.vue'

export default defineComponent({
  name: 'ToolsAnnouncement',
  components: {
    AnnouncementBanner
  }
})
</script>
