<template>
  <nav class="bg-white shadow" role="navigation" aria-label="Main navigation">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex px-2 lg:px-0">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" id="logo" aria-label="Inciteful Home">
              <img class="h-8 hidden sm:block" src="../../assets/images/logo-300.png" alt="Inciteful Logo" width="196" height="32" />
              <img class="block h-8 sm:hidden" src="../../assets/images/profile-64.png" alt="Inciteful Logo" width="32" height="32" />
            </router-link>
          </div>
          <div class="hidden lg:flex">
            <a href="https://help.inciteful.xyz"
              class="ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out">
              Help </a><a href="https://twitter.com/Inciteful_xyz" target="_blank"
              class="ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 335 276" fill="#3ba9ee" class="w-5 h-5 inline mr-2">
                <path
                  d="m302 70a195 195 0 0 1 -299 175 142 142 0 0 0 97 -30 70 70 0 0 1 -58 -47 70 70 0 0 0 31 -2 70 70 0 0 1 -57 -66 70 70 0 0 0 28 5 70 70 0 0 1 -18 -90 195 195 0 0 0 141 72 67 67 0 0 1 116 -62 117 117 0 0 0 43 -17 65 65 0 0 1 -31 38 117 117 0 0 0 39 -11 65 65 0 0 1 -32 35" />
              </svg>
              Follow
            </a>
          </div>
        </div>
        <div v-if="!isHomePage" class="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
          <SearchBar
            compact
            placeholder="Search papers..."
            @selected="goToPaper"
            @searched="goToSearch"
          />
        </div>
        <div class="flex flex-shrink items-center lg:hidden">
          <button @click="toggleMobileMenu()" class=" inline-flex items-center justify-center p-2 rounded-md text-gray-400
                              hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 focus:ring-2 focus:ring-violet-500
                              transition duration-150 ease-in-out" aria-label="Toggle mobile menu" :aria-expanded="mobileMenuExpanded" aria-controls="mobileMenu">
            <Bars3Icon v-if="!mobileMenuExpanded" class="h-6 w-6" />
            <XMarkIcon v-if="mobileMenuExpanded" class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
    <div id="mobileMenu" class="lg:hidden" :class="{
      hidden: !mobileMenuExpanded,
      block: mobileMenuExpanded
    }">
      <div class="pt-2 pb-3">
        <router-link to="/c"
          class="mt-1 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">Connector</router-link>
        <a href="https://help.inciteful.xyz"
          class="mt-1 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">Help</a>
        <a href="https://twitter.com/Inciteful_xyz" target="_blank"
          class="mt-1 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"><svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 335 276" fill="#3ba9ee" class="w-5 h-5 inline mr-2">
            <path
              d="m302 70a195 195 0 0 1 -299 175 142 142 0 0 0 97 -30 70 70 0 0 1 -58 -47 70 70 0 0 0 31 -2 70 70 0 0 1 -57 -66 70 70 0 0 0 28 5 70 70 0 0 1 -18 -90 195 195 0 0 0 141 72 67 67 0 0 1 116 -62 117 117 0 0 0 43 -17 65 65 0 0 1 -31 38 117 117 0 0 0 39 -11 65 65 0 0 1 -32 35" />
          </svg>
          Follow</a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import navigation from '../../navigation'
import { PaperID } from '@/types/incitefulTypes'
import { useRouter, useRoute } from 'vue-router'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const mobileMenuExpanded = ref(false)

const isHomePage = computed(() => route.name === 'Home')

function toggleMobileMenu() {
  mobileMenuExpanded.value = !mobileMenuExpanded.value
}

function goToPaper(ids: PaperID[]) {
  if (ids.length > 0) {
    router.push({ path: navigation.getPaperUrl(ids[0]) })
  }
}

function goToSearch(query: string) {
  if (query && route.query.q !== query) {
    router.push({ name: 'Search', query: { q: query } })
  }
}
</script>
