<template>
  <div>
    <h1>Save to a collection</h1>
    <table>
      <thead>
        <tr>
          <th>Collection</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="collection in db.paperCollections" :key="collection.id">
          <td>{{ collection.name }}</td>
        </tr>
      </tbody>
    </table>
    <button v-on:click="$emit('back')" class="button-gray mt-4">
      Back
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { CollectionModalOptions } from '@/types/modalTypes'
import { useDBStore } from '@/stores/db'

export default defineComponent({
  name: 'CollectionModalContent',
  props: {
    options: Object() as PropType<CollectionModalOptions>
  },
  emits: ['back'],
  data () {
    return {
      db: useDBStore()
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
