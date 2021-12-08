<template>
  <div>
    <div class="p-8" v-if="errorMsg">{{ errorMsg }}</div>
    <div v-else>
      <div class="shadow border-b border-gray-400 sm:rounded-lg mt-3">
        <div
          class="bg-white"
          :class="{
            fixed: isFullScreen,
            '2xl:w-3/4': isFullScreen && slotHasContent,
            'lg:w-2/3': isFullScreen && slotHasContent,
            'w-full': isFullScreen,
            'h-full': isFullScreen,
            'top-0': isFullScreen,
            'right-0': isFullScreen,
            relative: !isFullScreen,
            'h-96': !isFullScreen
          }"
        >
          <div class="absolute bottom-0 right-0 z-10">
            <div class="text-xs p-3">
              <div class="flex pb-1">
                <div class="flex-none">{{ Math.floor(minDate) }}</div>
                <div class="flex-grow"></div>
                <div class="flex-none">{{ Math.floor(maxDate) }}</div>
              </div>
              <div
                :style="{
                  background:
                    'linear-gradient(90deg, hsl(259, 92.7%, 80%), hsl(259, 92.7%, 20%))'
                }"
                class="w-56 h-3"
              ></div>
            </div>
          </div>
          <div class="absolute top-0 right-0 z-10 graph-controls">
            <div
              class="
                shadow
                rounded-lg
                h-12
                w-12
                border-gray-200
                mt-3
                mr-3
                border-b
                bg-white
              "
            >
              <button class="justify-center p-3" v-on:click="toggleFullScreen">
                <div :class="{ hidden: isFullScreen }">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    class="w-6 h-6"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="currentColor"
                  >
                    <path
                      d="M21.414 18.586l2.586-2.586v8h-8l2.586-2.586-5.172-5.172 2.828-2.828 5.172 5.172zm-13.656-8l2.828-2.828-5.172-5.172 2.586-2.586h-8v8l2.586-2.586 5.172 5.172zm10.828-8l-2.586-2.586h8v8l-2.586-2.586-5.172 5.172-2.828-2.828 5.172-5.172zm-8 13.656l-2.828-2.828-5.172 5.172-2.586-2.586v8h8l-2.586-2.586 5.172-5.172z"
                    />
                  </svg>
                </div>

                <div :class="{ hidden: !isFullScreen }">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="currentColor"
                  >
                    <path
                      d="M16.586 19.414l-2.586 2.586v-8h8l-2.586 2.586 4.586 4.586-2.828 2.828-4.586-4.586zm-13.758-19.414l-2.828 2.828 4.586 4.586-2.586 2.586h8v-8l-2.586 2.586-4.586-4.586zm16.586 7.414l2.586 2.586h-8v-8l2.586 2.586 4.586-4.586 2.828 2.828-4.586 4.586zm-19.414 13.758l2.828 2.828 4.586-4.586 2.586 2.586v-8h-8l2.586 2.586-4.586 4.586z"
                    />
                  </svg>
                </div>
              </button>
            </div>
            <div
              class="
                shadow
                h-12
                w-12
                rounded-lg
                border-gray-200
                mt-3
                mr-3
                border-b
                bg-white
                ml-auto
              "
            >
              <button class="justify-center p-3" v-on:click="centerGraph">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              class="
                shadow
                rounded-lg
                h-12
                w-12
                border-gray-200
                mt-3
                mr-3
                border-b
                bg-white
              "
            >
              <button class="justify-center p-3" v-on:click="zoomIn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </button>
            </div>
            <div
              class="
                shadow
                h-12
                w-12
                rounded-lg
                border-gray-200
                mt-3
                mr-3
                border-b
                bg-white
                ml-auto
              "
            >
              <button class="justify-center p-3" v-on:click="zoomOut">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div ref="graph" class="h-full"></div>
        </div>
      </div>
      <div
        class="bg-white"
        :class="{
          'lg:overflow-scroll': isFullScreen && slotHasContent,
          'lg:fixed': isFullScreen && slotHasContent,
          '2xl:w-1/4': isFullScreen && slotHasContent,
          'lg:w-1/3': isFullScreen && slotHasContent,
          'lg:h-full': isFullScreen && slotHasContent,
          'lg:top-0': isFullScreen && slotHasContent,
          'lg:left-0': isFullScreen && slotHasContent,
          'lg:pl-2': isFullScreen && slotHasContent,
          'lg:pr-2': isFullScreen && slotHasContent,
          relative: !isFullScreen && slotHasContent
        }"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import graphVis from '../utils/graphing/graph'
import bus from '../utils/bus'

export default Vue.extend({
  name: 'GraphView',
  props: {
    graphData: Object,
    errorMsg: String,
    filteredIds: {
      type: Set,
      default () {
        return new Set()
      }
    },
    highlightedIds: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      bus,
      graph: undefined,
      cyInstance: undefined,
      isFullScreen: false
    }
  },
  mounted () {
    if (this.graphData && this.graphData.papers) this.loadGraph()
  },
  computed: {
    maxDate () {
      return Math.max(
        ...Object.values(this.graphData.papers)
          .map(e => e.published_year)
          .filter(a => a)
      )
    },
    minDate () {
      return Math.min(
        ...Object.values(this.graphData.papers)
          .map(e => e.published_year)
          .filter(a => a)
      )
    },
    slotHasContent () {
      return !!this.$slots.default && !!this.$slots.default[0]
    }
  },
  watch: {
    graphData (newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        this.loadGraph()
      }
    },
    loaded (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.loadGraph()
      }
    },
    isFullScreen (newVal) {
      this.$nextTick(() => {
        if (!newVal) {
          this.cyInstance.resize()
        }
      })
    },
    filteredIds (newVal) {
      this.cyInstance.filterNodes(newVal)
    },
    highlightedIds (newVal) {
      this.cyInstance.highlightNodes(newVal)
    }
  },
  methods: {
    loadGraph () {
      if (this.graphData) {
        const cy = graphVis.loadGraph(
          this.graphData,
          this.$refs.graph,
          this.bus,
          this.minDate,
          this.maxDate
        )

        this.cyInstance = Object.freeze(cy)
      }
    },
    toggleFullScreen () {
      this.isFullScreen = !this.isFullScreen
    },
    centerGraph () {
      this.cyInstance.centerSource()
    },
    zoomIn () {
      let curZoom = this.cyInstance.zoom()

      if (curZoom > 1.35) {
        curZoom = 1.35
      }

      this.cyInstance.zoom(curZoom + 0.15)
    },
    zoomOut () {
      let curZoom = this.cyInstance.zoom()

      if (curZoom < 0.3) {
        curZoom = 0.3
      }

      this.cyInstance.zoom(curZoom - 0.15)
    },
    closeFullScreen () {
      if (this.isFullScreen) this.isFullScreen = false
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    }
  }
})
</script>
