<template>
  <single-column>
    <h1 class="pb-3">Zotero Connection Managment</h1>
    <div v-if="hasIntegration">
      <div>
        You have a working Zotero integration. We try to re-sync the integration
        periodically while you are using the site but you can force resync it
        below.
      </div>
      <div class="pt-5">
        <button @click="syncCollectionList" class="button-purple">
          Force Re-sync
        </button>
      </div>
      <div class="flex justify-center max-w-full">
        <div class="min-w-full">
          <div class="pt-4">
            <zotero-nested-collection-view :collections="nestedCollections" />
          </div>
        </div>
      </div>
      <div class="pt-10">
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <InformationCircleIcon
                class="h-5 w-5 text-blue-400"
                aria-hidden="true"
              />
            </div>
            <div class="ml-3">
              <div class="text-sm text-blue-700">
                If you are having issues syncing, please reset the connection
                below. You will not lose any of your existing settings.
                <div class="pt-3">
                  <button
                    @click="zoteroInit"
                    class="font-medium underline text-blue-700 hover:text-blue-600"
                  >
                    Reset Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pt-10">
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <ExclamationIcon
                class="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div class="ml-3">
              <div class="text-sm text-yellow-700">
                Delete your Zotero integration. By deleting your integration you
                will lose all of your sync settings. Papers and collections that
                have been synced to Zotero will not be deleted. You will need to
                do that directly in Zotero.
                <div class="pt-3">
                  <button
                    @click="clearIntegration"
                    class="font-medium underline text-yellow-700 hover:text-yellow-600"
                  >
                    Delete Integration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      You can integrate Inciteful with
      <a href="https://zotero.org/">Zotero</a>, a open source reference
      management software. The integrations will allow you to sync your favorite
      papers and collections directly with Zotero. You'll also be able to
      initiate searches using the papers in a Zotero collection as the seeds.

      <div class="pt-5">
        <button @click="zoteroInit" class="button-purple">
          Connect to Zotero
        </button>
      </div>
    </div>
  </single-column>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import api from '../../utils/api'
import { useRoute, useRouter } from 'vue-router'
import { useZoteroStore } from '@/stores/zoteroStore'
import { storeToRefs } from 'pinia'
import ZoteroNestedCollectionView from '@/components/ZoteroNestedCollectionView.vue'
import SingleColumn from '@/components/layout/SingleColumn.vue'
import { ExclamationIcon, InformationCircleIcon } from '@heroicons/vue/outline'
import { showNotificationHelper } from '@/utils/emitHelpers'

export default defineComponent({
  name: 'Zotero',
  components: {
    ZoteroNestedCollectionView,
    SingleColumn,
    ExclamationIcon,
    InformationCircleIcon
  },
  setup () {
    let router = useRouter()
    let route = useRoute()
    let id = route.query.id?.toString()
    let zotero = useZoteroStore()

    const hasIntegration = computed(() => {
      return zotero.data !== undefined
    })

    let zoteroInit = () => {
      api.getZoteroAuthUrl().then(url => {
        if (url) {
          window.location.href = url
        }
      })
    }

    if (id) {
      console.log('Found ID', id)

      api
        .getZoteroAuth(id)
        .then(token => {
          if (token) {
            zotero.saveZoteroToken(token)
          }
        })
        .finally(() => {
          router.push({
            name: 'Zotero'
          })
        })
    }

    let syncCollectionList = async () => {
      await zotero.syncCollectionList()
      showNotificationHelper({ message1: 'Collections Synced', message2: '' })
    }

    let clearIntegration = () => {
      zotero.clearZotero()
    }

    let { nestedCollections } = storeToRefs(zotero)

    return {
      zoteroInit,
      hasIntegration,
      clearIntegration,
      syncCollectionList,
      nestedCollections
    }
  }
})
</script>
