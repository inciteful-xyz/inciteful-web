<template>
  <AnnouncementBanner>
    <template v-slot:title>
      Did you know you can search directly from Zotero? Check out our new <a class="underline"
        href="https://github.com/inciteful-xyz/inciteful-zotero-plugin" target="_blank">Zotero
        plugin</a> and see the <a class="underline" href="https://twitter.com/Inciteful_xyz/status/1633447883994193920"
        target="_blank">Twitter
        thread</a> on how to use it.
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
