<template>
  <div class="py-3">
    <div class="flex justify-center">
      <div class="flex-auto  max-w-2xl">
        <h1 class="pb-3">Zotero Managment</h1>
        <div v-if="hasIntegration">
          You have a working Zotero integration. Reset it by clearing the
          integration below.

          <div class="pt-3">
            <button @click="clearIntegration" class="button-purple">
              Clear Integration
            </button>
          </div>
        </div>
        <div v-else>
          You can integrate Inciteful with
          <a href="https://zotero.org/">Zotero</a>, a open source reference
          management software. The integrations will allow you to sync your
          favorite papers and collections directly with Zotero. You'll also be
          able to initiate searches using the papers in a Zotero collection as
          the seeds.

          <div class="pt-5">
            <button @click="zoteroInit" class="button-purple">
              Connect to Zotero
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import api from '../../utils/api'
import { useRoute } from 'vue-router'
import { useDBStore } from '../../stores/db'

export default defineComponent({
  name: 'Zotero',
  setup () {
    let route = useRoute()
    let id = route.query.id?.toString()
    let db = useDBStore()

    let zoteroInit = () => {
      api.getZoteroAuthUrl().then(url => {
        if (url) {
          window.location.href = url
        }
      })
    }

    if (id) {
      console.log('Found ID', id)

      api.getZoteroAuth(id).then(token => {
        if (token) {
          db.awaitUserDataLoad(() => db.saveZoteroToken(token))
        }
      })
    }

    let clearIntegration = () => {
      if (db.userData) {
        db.clearZoteroToken()
      }
    }

    const hasIntegration = computed(() => {
      return !!db.userData?.zoteroToken
    })

    return {
      zoteroInit,
      hasIntegration,
      clearIntegration
    }
  }
})
</script>
