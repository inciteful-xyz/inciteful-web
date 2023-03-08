<template>
  <div v-if="showTitle || showMessage">
    <div class="rounded-md bg-blue-50 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <NewspaperIcon class="h-5 w-5 inline-block mb-1" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm leading-5 font-medium text-blue-800" v-if="showTitle">
            <slot name="title"></slot>
          </h3>
          <div class="mt-2 text-sm leading-5 text-blue-700" v-if="showMessage">
            <slot name="message"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NewspaperIcon } from '@heroicons/vue/outline'

export default defineComponent({
  name: 'BetaFeatures',
  components: { NewspaperIcon },
  computed: {
    showTitle() {
      return !!this.$slots.title;
    },
    showMessage() {
      return !!this.$slots.message;
    }
  }
})
</script>
