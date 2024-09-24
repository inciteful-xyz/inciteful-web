<template>
  <AnnouncementBanner>
    <template v-slot:title>
      We'd like your input! Please complete a <a class="underline" href="https://3u1u7jitzp4.typeform.com/to/U1RKMFpr">3
        minute survey</a>
      on how you use Inciteful.
    </template>
  </AnnouncementBanner>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import AnnouncementBanner from '@/components/announcements/AnnouncementBanner.vue'

export default defineComponent({
  name: 'MedSurveyAnnouncement',
  components: {
    AnnouncementBanner
  }
})
</script>
