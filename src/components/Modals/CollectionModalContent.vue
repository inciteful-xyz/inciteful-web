<template>
  <div v-if="options && options.action">
    <save-collection-modal
      v-if="isSaveCollectionAction"
      :action="(options.action as SaveCollectionAction)"
      @back="$emit('back')"
    /><sync-zotero-collection-modal
      v-if="isSyncZoteroCollectionAction"
      :action="(options.action as SyncZoteroCollectionAction)"
      @back="$emit('back')"
    />
    <sync-inciteful-collection-modal
      v-if="isSyncIncitefulCollectionAction"
      :action="(options.action as SyncIncitefulCollectionAction)"
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
  isSaveCollectionAction,
  isSyncZoteroCollectionAction,
  isSyncIncitefulCollectionAction,
  isValidCollectectionModalAction,
  SaveCollectionAction,
  SyncZoteroCollectionAction,
  SyncIncitefulCollectionAction
} from '@/types/modalTypes'
import SaveCollectionModal from './SaveCollectionModal.vue'
import SyncZoteroCollectionModal from './SyncZoteroCollectionModal.vue'
import SyncIncitefulCollectionModal from './SyncIncitefulCollectionModal.vue'

export default defineComponent({
  name: 'CollectionModalContent',
  components: {
    SaveCollectionModal,
    SyncZoteroCollectionModal,
    SyncIncitefulCollectionModal
  },
  props: {
    options: Object() as PropType<CollectionModalOptions>
  },
  emits: ['back'],
  data() {
    return {}
  },
  computed: {
    validState(): boolean {
      return this.options
        ? isValidCollectectionModalAction(this.options.action)
        : false
    },
    isSaveCollectionAction(): boolean {
      return this.options ? isSaveCollectionAction(this.options?.action) : false
    },
    isSyncZoteroCollectionAction(): boolean {
      return this.options
        ? isSyncZoteroCollectionAction(this.options?.action)
        : false
    },
    isSyncIncitefulCollectionAction(): boolean {
      return this.options
        ? isSyncIncitefulCollectionAction(this.options?.action)
        : false
    }
  },
  methods: {}
})
</script>
