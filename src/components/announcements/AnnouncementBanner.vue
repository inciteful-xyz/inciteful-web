<template>
  <div v-if="showTitle || showMessage">
    <div class="rounded-md bg-indigo-500 p-4 mb-4">
      <div class="flex justify-between items-center">
        <div class="flex-shrink-0 mr-4">
          <ExclamationCircleIcon class="h-5 w-5 inline-block mb-1 text-white" />
        </div>
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-base leading-5 font-medium text-white" v-if="showTitle">
              <slot name="title"></slot>
            </h3>
            <div class="mt-2 text-sm leading-5 text-white" v-if="showMessage">
              <slot name="message"></slot>
            </div>
          </div>
        </div>
        <div class="flex-shrink-0 ml-4" v-if="showAction">
          <slot name="action"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ExclamationCircleIcon } from '@heroicons/vue/outline'

export default defineComponent({
  name: 'BetaFeatures',
  components: { ExclamationCircleIcon },
  computed: {
    showTitle() {
      return !!this.$slots.title && this.$slots.title().length > 0;
    },
    showMessage() {
      return !!this.$slots.message && this.$slots.message().length > 0;
    },
    showAction() {
      return !!this.$slots.action && this.$slots.action().length > 0;
    }
  }
})
</script>
