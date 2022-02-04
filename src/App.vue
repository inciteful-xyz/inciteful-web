<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Header></Header>
    <main class="mb-auto">
      <router-view />
    </main>
    <Footer />
    <LitReviewBuilder />
    <PaperInfoModal />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

export default defineComponent({
  name: 'App',
  components: {
    Header,
    Footer
  }
})
</script>
