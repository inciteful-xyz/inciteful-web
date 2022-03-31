<template>
  <div>
    <h1 class="pb-5">
      I want to sync the Zotero collection "{{ action.zoteroName }}" to...
    </h1>
    <div class="lg:flex">
      <div
        class="lg:flex-none border-b pb-5 mb-5 lg:border-b-0 lg:mb-0 lg:pb-0"
      >
        <h2 class="mb-4">A new collection</h2>
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
        <h2 class="mb-4">An existing unsynced collection</h2>
        <div class="shadow-box" v-if="unsyncedCollections.length > 0">
          <table class="base-table max-w-xl">
            <thead>
              <tr>
                <th>Name</th>
                <th>Count</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="collection in unsyncedCollections"
                :key="collection.id"
              >
                <td>{{ collection.name }}</td>
                <td>{{ collection.papers.length }} papers</td>
                <td>
                  {{ collection.dateCreated.toDate().toLocaleDateString() }}
                </td>
                <td>
                  <button
                    @click="syncCollection(collection.id)"
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
            collection.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { SyncCollectionAction } from '@/types/modalTypes'
import { usePaperCollectionStore } from '@/stores/paperCollectionStore'
import { useZoteroStore } from '@/stores/zoteroStore'

export default defineComponent({
  name: 'SyncCollectionModal',
  props: {
    action: Object() as PropType<SyncCollectionAction>
  },
  emits: ['back'],
  data () {
    let newCollectionName = ref('')
    let db = usePaperCollectionStore()
    let zotero = useZoteroStore()

    let createCollection = async () => {
      let zoteroKey = this.action?.zoteroKey
      if (!zoteroKey) return
      db.savePaperCollection(newCollectionName.value, []).then(id => {
        if (id && zoteroKey) {
          zotero.setCollectionSync(id, zoteroKey)
        }
      })

      this.$emit('back')
    }

    let syncCollection = (id: string) => {
      if (this.action) {
        zotero.setCollectionSync(id, this.action?.zoteroKey)
      }

      this.$emit('back')
    }

    let unsyncedCollections = computed(() => {
      return db.paperCollections?.filter(
        collection =>
          collection.id && !zotero.isSyncedByIncitefulKey(collection.id)
      )
    })

    return {
      unsyncedCollections,
      newCollectionName,
      createCollection,
      syncCollection
    }
  },
  methods: {}
})
</script>
