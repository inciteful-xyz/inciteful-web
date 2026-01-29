<template>
  <div id="app" class="flex flex-col min-h-screen">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-violet-600 focus:text-white">
      Skip to main content
    </a>
    <Header></Header>
    <main id="main-content" class="mb-auto" role="main">
      <router-view />
    </main>
    <Footer />
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
  },
})
</script>
