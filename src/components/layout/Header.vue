<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex px-2 lg:px-0">
          <div class="flex-shrink-0 flex items-center">
            <a href="/" id="logo">
              <img
                class="h-8 hidden sm:block"
                src="../../assets/images/logo-300.png"
                alt="Inciteful Logo"
              />
              <img
                class="block h-8 sm:hidden"
                src="../../assets/images/profile-transparent.png"
                alt="Inciteful Logo"
              />
            </a>
          </div>
          <div class="hidden lg:ml-6 lg:flex">
            <!-- <a href="/p"
                            class="inline-flex items-center px-1 pt-1 border-b-2 border-purple-500 text-sm font-medium leading-5 text-gray-900 focus:outline-none focus:border-purple-700 transition duration-150 ease-in-out">
                            Discovery
                        </a> -->
            <a
              href="/p"
              class="ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
            >
              Discovery
            </a>
            <a
              href="/c"
              class="ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
            >
              Connector
            </a>
            <a
              href="https://help.inciteful.xyz"
              class="ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
            >
              Help </a
            ><a
              href="https://twitter.com/Inciteful_xyz"
              target="_blank"
              class="ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 335 276"
                fill="#3ba9ee"
                class="w-5 h-5 inline mr-2"
              >
                <path
                  d="m302 70a195 195 0 0 1 -299 175 142 142 0 0 0 97 -30 70 70 0 0 1 -58 -47 70 70 0 0 0 31 -2 70 70 0 0 1 -57 -66 70 70 0 0 0 28 5 70 70 0 0 1 -18 -90 195 195 0 0 0 141 72 67 67 0 0 1 116 -62 117 117 0 0 0 43 -17 65 65 0 0 1 -31 38 117 117 0 0 0 39 -11 65 65 0 0 1 -32 35"
                />
              </svg>
              Follow
            </a>
          </div>
        </div>
        <div
          class="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end"
        >
          <graph-search
            :showImport="false"
            v-on:selected="goToPaper"
            v-on:searched="goToSearch"
          />
        </div>
        <div class="flex items-center lg:hidden">
          <button
            @click="toggleMobileMenu()"
            class=" inline-flex items-center justify-center p-2 rounded-md text-gray-400
                        hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500
                        transition duration-150 ease-in-out"
            aria-label="Main menu"
            aria-expanded="false"
          >
            <svg
              id="closedMobileMenuIcon"
              v-if="!mobileMenuExpanded"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              id="openMobileMenuIcon"
              v-if="mobileMenuExpanded"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div
      id="mobileMenu"
      class="lg:hidden"
      :class="{
        hidden: !mobileMenuExpanded,
        block: mobileMenuExpanded
      }"
    >
      <div class="pt-2 pb-3">
        <!-- <a href="/p"
                    class="block pl-3 pr-4 py-2 border-l-4 border-purple-500 text-base font-medium text-purple-700 bg-purple-50 focus:outline-none focus:text-purple-800 focus:bg-purple-100 focus:border-purple-700 transition duration-150 ease-in-out">Discovery</a> -->
        <a
          href="/p"
          class="mt-1 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
          >Discovery</a
        >
        <a
          href="/c"
          class="mt-1 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
          >Connector</a
        >
        <a
          href="https://help.inciteful.xyz"
          class="mt-1 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
          >Help</a
        >
        <a
          href="https://twitter.com/Inciteful_xyz"
          target="_blank"
          class="mt-1 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 335 276"
            fill="#3ba9ee"
            class="w-5 h-5 inline mr-2"
          >
            <path
              d="m302 70a195 195 0 0 1 -299 175 142 142 0 0 0 97 -30 70 70 0 0 1 -58 -47 70 70 0 0 0 31 -2 70 70 0 0 1 -57 -66 70 70 0 0 0 28 5 70 70 0 0 1 -18 -90 195 195 0 0 0 141 72 67 67 0 0 1 116 -62 117 117 0 0 0 43 -17 65 65 0 0 1 -31 38 117 117 0 0 0 39 -11 65 65 0 0 1 -32 35"
            />
          </svg>
          Follow</a
        >
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GraphSearch from '@/components/GraphSearch.vue'
import navigation from '../../navigation'
import { PaperID } from '@/types/inciteful'

export default defineComponent({
  name: 'Header',
  components: {
    GraphSearch
  },
  data () {
    return {
      mobileMenuExpanded: false
    }
  },
  methods: {
    goToPaper (id: PaperID) {
      this.$router.push({ path: navigation.getPaperUrl(id) })
    },
    goToSearch (query: string) {
      if (query && this.$route.query.q !== query) {
        this.$router.push({ name: 'Search', query: { q: query } })
      }
    },
    toggleMobileMenu () {
      this.mobileMenuExpanded = !this.mobileMenuExpanded
    }
  }
})
</script>
