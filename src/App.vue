<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Header></Header>
    <main class="mb-auto">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>
