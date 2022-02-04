<template>
  <div v-if="anySet">
    <div class="rounded-md bg-blue-50 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <XCircleIcon class="h-5 w-5 inline-block" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm leading-5 font-medium text-blue-800">
            You have the following
            <a class="underline cursor-pointer hover:text-blue-400" href="/beta"
              >beta features</a
            >
            enabled.
          </h3>
          <div class="mt-2 text-sm leading-5 text-blue-700">
            <ul class="list-disc pl-5">
              <li v-if="pruneLevel">Prune Level: {{ pruneLevel }}</li>
              <!-- <li v-if="showGraph">Graph Visualizations</li> -->
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import options from '../utils/options'
import { XCircleIcon } from '@heroicons/vue/outline'

export default defineComponent({
  name: 'BetaFeatures',
  components: { XCircleIcon },
  data () {
    return {
      pruneLevel: options.getPruneLevel()
    }
  },
  computed: {
    anySet (): boolean {
      if (this.pruneLevel) return true
      else return false
    }
  }
})
</script>
