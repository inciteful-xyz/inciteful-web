<template>
  <div class="w-full">
    <div class="whitespace-nowrap text-right">
      <div class="flex">
        <div class="flex-none pt-2 w-11">From:</div>
        <div class="flex-grow pl-2">
          <Autosuggest ref="fromAutosuggest" :defaultPaperId="toId" />
        </div>
      </div>
      <div class="flex pt-3">
        <div class="flex-none pt-2 w-11">To:</div>
        <div class="flex-grow pl-2">
          <Autosuggest ref="toAutosuggest" :defaultPaperId="fromId" />
        </div>
      </div>
      <div class="pt-3">
        <span class="rounded-md shadow-sm">
          <button
            type="button"
            class="
              px-3
              py-2
              border border-transparent
              text-sm
              leading-5
              font-medium
              rounded-md
              text-white
              bg-purple-600
              hover:bg-purple-500
              focus:outline-none
              focus:border-purple-700
              focus:ring-purple
              active:bg-purple-700
              transition
              ease-in-out
              duration-150
            "
            v-on:click="searchClick"
          >
            <SearchIcon class="h-5 w-5 text-white" />
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Autosuggest from './Autosuggest.vue'
import { SearchIcon } from '@heroicons/vue/outline'

export default defineComponent({
  name: 'ConnectorSearch',
  components: {
    Autosuggest,
    SearchIcon
  },
  props: {
    showImport: {
      type: Boolean,
      default: false
    },
    clearOnSelect: {
      type: Boolean,
      default: false
    },
    fromId: {
      type: Number,
      default: undefined
    },
    toId: {
      type: Number,
      default: undefined
    }
  },
  methods: {
    searchClick () {
      // @ts-ignore
      const toParam = this.$refs.toAutosuggest.getValue()
      // @ts-ignore
      const fromParam = this.$refs.fromAutosuggest.getValue()
      this.$router.push({
        name: 'LitConnector',
        query: { to: toParam, from: fromParam }
      })
    }
  }
})
</script>
