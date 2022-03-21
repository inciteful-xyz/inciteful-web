<template>
  <div>
    <h1 class="pb-5">
      {{ options.contextIds.length }} paper{{
        options.contextIds.length > 1 ? 's' : ''
      }}
      selected to be saved.
    </h1>
    <h2 class="pb-4">
      I want to save the top
      <input
        v-model="numToSave"
        class="px-2 py-2 mr-2 border w-10 border-gray-300 rounded-md leading-5 bg-white
transition duration-150 ease-in-out focus:outline-none focus:border-blue-300"
        type="text"
        placeholder="50"
      />
      papers to...
    </h2>
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
        <h2 class="mb-4">An existing collection</h2>
        <div class="shadow-box" v-if="db.paperCollections.length > 0">
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
                v-for="collection in db.paperCollections"
                :key="collection.id"
              >
                <td>{{ collection.name }}</td>
                <td>{{ collection.papers.length }} papers</td>
                <td>
                  {{ collection.dateCreated.toDate().toLocaleDateString() }}
                </td>
                <td>
                  <button
                    @click="addToCollection(collection.id)"
                    class="text-purple-500"
                  >
                    Add >>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>
            You currently have no collections, save these papers to a new
            collection.
          </p>
        </div>
      </div>
    </div>

    <button v-on:click="$emit('back')" class="button-gray mt-8">
      Back
    </button>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, PropType, ref } from 'vue'
import { CollectionModalOptions } from '@/types/modalTypes'
import { useDBStore } from '@/stores/db'
import { PaperID } from '@/types/incitefulTypes'

export default defineComponent({
  name: 'CollectionModalContent',
  props: {
    options: Object() as PropType<CollectionModalOptions>
  },
  emits: ['back'],
  data () {
    let newCollectionName = ref('')
    let numToSave = ref(this.options?.contextIds.length)
    let db = useDBStore()

    const idsToSave: ComputedRef<PaperID[] | undefined> = computed(():
      | PaperID[]
      | undefined => this.options?.contextIds.slice(0, numToSave.value))

    let createCollection = () => {
      if (this.newCollectionName.length > 0 && idsToSave.value) {
        db.savePaperCollection(newCollectionName.value, idsToSave.value)
        this.$emit('back')
      }
    }
    let addToCollection = (id: string) => {
      if (idsToSave.value) {
        db.addPapersToCollection(id, idsToSave.value)
        this.$emit('back')
      }
    }
    return {
      db,
      numToSave,
      newCollectionName,
      createCollection,
      addToCollection
    }
  },
  computed: {
    validState (): boolean {
      return this.options !== undefined && this.options.contextIds.length > 0
    }
  },
  methods: {}
})
</script>
