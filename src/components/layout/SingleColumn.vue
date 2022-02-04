<template>
  <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 px-2 py-2 sm:py-5">
    <slot></slot>
  </div>
  <LitReviewBuilder />
  <PaperInfoModal />
  <CollectionManagerModal />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LitReviewBuilder from '../LitReviewBuilder.vue'
import PaperInfoModal from '../PaperInfoModal.vue'
import CollectionManagerModal from '../CollectionManagerModal.vue'

export default defineComponent({
  name: 'SingleColumn',
  components: { LitReviewBuilder, PaperInfoModal, CollectionManagerModal }
})
</script>

45 The Strand, Attenborough, Beeston, Nottingham NG9 6AU
