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
                  <ArrowsExpandIcon class="h-6 w-6" />
                </div>

                <div :class="{ hidden: !isFullScreen }">
                  <XCircleIcon class="h-6 w-6" />
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
                <LocationMarkerIcon class="h-6 w-6" />
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
                <ZoomInIcon class="h-6 w-6" />
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
                <ZoomOutIcon class="h-6 w-6" />
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

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import graphVis from '../utils/graphing/graph'
import { PaperID } from '@/types/incitefulTypes'
import {
  ArrowsExpandIcon,
  LocationMarkerIcon,
  ZoomInIcon,
  ZoomOutIcon,
  XCircleIcon
} from '@heroicons/vue/outline'
import { GraphData, IncitefulGraph } from '@/types/graphTypes'

export default defineComponent({
  name: 'GraphView',
  props: {
    graphData: {} as PropType<GraphData | undefined>,
    errorMsg: String,
    filteredIds: {} as PropType<Set<PaperID>>,
    highlightedIds: {} as PropType<Set<PaperID>>
  },
  components: {
    ArrowsExpandIcon,
    LocationMarkerIcon,
    ZoomInIcon,
    ZoomOutIcon,
    XCircleIcon
  },
  data () {
    return {
      cyInstance: {} as IncitefulGraph,
      isFullScreen: false
    }
  },
  mounted (): void {
    if (this.graphData && this.graphData.papers) this.loadGraph()
  },
  computed: {
    maxDate (): number {
      if (this.graphData) {
        return Math.max(
          ...Object.values(this.graphData.papers ?? {})
            .map(e => e.published_year)
            .filter(a => a)
        )
      }

      return 0
    },
    minDate (): number {
      if (this.graphData) {
        return Math.min(
          ...Object.values(this.graphData.papers ?? {})
            .map(e => e.published_year)
            .filter(a => a)
        )
      }
      return 0
    },
    slotHasContent (): boolean {
      return !!this.$slots.default && !!this.$slots.default
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
    loadGraph (): void {
      if (this.graphData) {
        const cy = graphVis.loadGraph(
          this.graphData,
          this.$refs.graph as HTMLElement,
          this.emitter,
          this.minDate,
          this.maxDate
        )

        this.cyInstance = Object.freeze(cy)
      }
    },
    toggleFullScreen (): void {
      this.isFullScreen = !this.isFullScreen
    },
    centerGraph (): void {
      this.cyInstance.centerSource()
    },
    zoomIn (): void {
      let curZoom = this.cyInstance.curZoom()

      if (curZoom > 1.35) {
        curZoom = 1.35
      }

      this.cyInstance.zoom(curZoom + 0.15)
    },
    zoomOut (): void {
      let curZoom = this.cyInstance.curZoom()

      if (curZoom < 0.3) {
        curZoom = 0.3
      }

      this.cyInstance.zoom(curZoom - 0.15)
    },
    closeFullScreen (): void {
      if (this.isFullScreen) this.isFullScreen = false
    }
  }
})
</script>
