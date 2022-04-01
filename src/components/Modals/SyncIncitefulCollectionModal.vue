<template>
  <div>
    <h1 class="pb-5">
      I want to sync my collection "{{ action.incitefulName }}" to...
    </h1>
    <div class="lg:flex">
      <div
        class="lg:flex-none border-b pb-5 mb-5 lg:border-b-0 lg:mb-0 lg:pb-0"
      >
        <h2 class="mb-4">A new Zotero collection</h2>
        <div>
          <input
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md leading-5
    bg-white transition duration-150 ease-in-out focus:outline-none focus:border-blue-300"
            ref="searchBox"
            type="text"
            placeholder="New collection name"
            v-model="newCollectionName"
          />
        </div>

        <div class="pt-3">
          <button class="button-purple" @click="createCollection">
            Create Collection
          </button>
        </div>
      </div>

      <div class="lg:flex-1 pl-0 ml-0 lg:pl-5 lg:ml-5 lg:border-l">
        <h2 class="mb-4">An existing unsynced Zotero collection</h2>
        <div class="shadow-box" v-if="zotero.unsyncedCollections.length > 0">
          <table class="base-table max-w-xl">
            <thead>
              <tr>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="collection in zotero.unsyncedCollections"
                :key="collection.key"
              >
                <td>{{ collection.name }}</td>
                <td>
                  <button
                    @click="syncCollection(collection)"
                    class="text-purple-500"
                  >
                    Sync >>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>
            You currently have no unsynced collections, please sync to a new
            Zotero collection.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { SyncIncitefulCollectionAction } from '@/types/modalTypes'
import { useZoteroStore } from '@/stores/zoteroStore'
import { ZoteroCollection, ZoteroKey } from '@/types/zoteroTypes'
import { showNotificationHelper } from '@/utils/emitHelpers'
import { PaperCollection } from '@/types/userTypes'

export default defineComponent({
  name: 'SyncCollectionModal',
  props: {
    action: Object() as PropType<SyncIncitefulCollectionAction>
  },
  emits: ['back'],
  data () {
    let newCollectionName = ref('')
    let zotero = useZoteroStore()

    let createCollection = async () => {
      let incitefulKey = this.action?.incitefulKey
      if (!incitefulKey) return

      //create zotero collection
      zotero.createCollection(newCollectionName.value, async collection => {
        if (incitefulKey) {
          await zotero.setCollectionSync(incitefulKey, collection.key)
          showNotificationHelper({
            message1: `"${newCollectionName.value}" was created in Zotero.`,
            message2: `The Zotero collection "${newCollectionName.value}" is now synced to "${this.action?.incitefulName}".`
          })
        }
      })

      this.$emit('back')
    }

    let syncCollection = async (collection: ZoteroCollection) => {
      if (this.action) {
        zotero.setCollectionSync(this.action?.incitefulKey, collection.key)

        showNotificationHelper({
          message1: `The Zotero collection "${collection.name}" is now synced to "${this.action?.incitefulName}".`,
          message2: ''
        })
      }
      this.$emit('back')
    }

    return {
      zotero,
      newCollectionName,
      createCollection,
      syncCollection
    }
  },
  methods: {}
})
</script>
