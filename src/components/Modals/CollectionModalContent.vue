<template>
  <div>
    <save-collection-modal
      v-if="isSaveCollectionAction"
      :action="this.options.action"
      @back="$emit('back')"
    />
    <sync-collection-modal
      v-if="isSyncCollectionAction"
      :action="this.options.action"
      @back="$emit('back')"
    />

    <button v-on:click="$emit('back')" class="button-gray mt-8">
      Back
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  CollectionModalOptions,
  isValidCollectectionModalAction,
  isSaveCollectionAction,
  isSyncCollectionAction
} from '@/types/modalTypes'
import SaveCollectionModal from './SaveCollectionModal.vue'
import SyncCollectionModal from './SyncCollectionModal.vue'

export default defineComponent({
  name: 'CollectionModalContent',
  components: {
    SaveCollectionModal,
    SyncCollectionModal
  },
  props: {
    options: Object() as PropType<CollectionModalOptions>
  },
  emits: ['back'],
  data () {
    return {}
  },
  computed: {
    validState (): boolean {
      return this.options
        ? isValidCollectectionModalAction(this.options.action)
        : false
    },
    isSaveCollectionAction (): boolean {
      return this.options ? isSaveCollectionAction(this.options?.action) : false
    },
    isSyncCollectionAction (): boolean {
      return this.options ? isSyncCollectionAction(this.options?.action) : false
    }
  },
  methods: {}
})
</script>
