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
            <svg
              class="h-5 w-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Autosuggest from './Autosuggest'

export default Vue.extend({
  name: 'ConnectorSearch',
  components: {
    Autosuggest
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
  data () {
    return {
      results: [],
      timeout: null,
      selected: null,
      suggestions: [],
      selectIsValid: true,
      to: undefined,
      from: undefined
    }
  },
  methods: {
    searchClick () {
      const toParam = this.$refs.toAutosuggest.getValue()
      const fromParam = this.$refs.fromAutosuggest.getValue()
      this.$router.push({
        name: 'LitConnector',
        query: { to: toParam, from: fromParam }
      })
    }
  }
})
</script>
