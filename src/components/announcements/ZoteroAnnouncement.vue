<template>
  <AnnouncementBanner>
    <template v-slot:title>
      Did you know you can search directly from Zotero? Check out our new <a class="underline"
        href="https://github.com/inciteful-xyz/inciteful-zotero-plugin">Zotero
        plugin</a>!
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
