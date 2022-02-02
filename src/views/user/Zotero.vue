<template>
  <div class="py-3">
    <div class="flex justify-center">
      <div class="flex-auto  max-w-2xl">
        <h1 class="text-xl">Zotero</h1>
        <p class="py-2">
          <button @click.prevent="zoteroInit">Start Zotero</button>
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import api from '../../utils/api'
import { useRoute } from 'vue-router'
import { useDBStore } from '../../stores/db'

export default defineComponent({
  name: 'Dashboard',
  setup () {
    let route = useRoute()
    let id = route.query.id?.toString()
    let db = useDBStore()
    // db.store.
    // if (id) {
    //   api.getZoteroAuth(id).then(token => {
    //     if (token) {
    //       console.log(token)
    //     }
    //   })
    // }

    let zoteroInit = () => {
      api.getZoteroAuthUrl().then(url => {
        if (url) {
          window.location.href = url
        }
      })
    }
    return { zoteroInit }
  }
})
</script>
