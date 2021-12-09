<template>
  <div v-if="anySet">
    <div class="rounded-md bg-blue-50 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <!-- Heroicon name: x-circle -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-5 w-5 text-blue-400"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            ></path>
          </svg>
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
import Vue from 'vue'
import options from '../utils/options'

export default Vue.extend({
  name: 'BetaFeatures',
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
