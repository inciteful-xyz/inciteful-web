<template>
  <footer class="border-t shadow bg-gray-800 text-gray-100 pt-6">
    <div
      class="max-w-screen-xl mx-auto py-8 px-4 overflow-hidden sm:px-6 lg:px-8"
    >
      <nav class="-mx-5 -my-2 flex flex-wrap justify-center">
        <div class="px-5 py-2">
          <a href="/p" class="text-base leading-6 hover:text-gray-300">
            Paper Discovery
          </a>
        </div>
        <div class="px-5 py-2">
          <a href="/c" class="text-base leading-6 hover:text-gray-300">
            Literature Connector
          </a>
        </div>
        <div class="px-5 py-2">
          <a href="/einstein" class="text-base leading-6 hover:text-gray-300">
            6° of Einstein
          </a>
        </div>
        <div class="px-5 py-2">
          <a
            href="https://help.inciteful.xyz"
            class="text-base leading-6 hover:text-gray-300"
          >
            Documentation
          </a>
        </div>
        <div class="px-5 py-2">
          <router-link
            to="/about"
            class="text-base leading-6 hover:text-gray-300"
          >
            About
          </router-link>
        </div>
        <div class="px-5 py-2">
          <router-link
            to="/data"
            class="text-base leading-6 hover:text-gray-300"
          >
            Data Sources
          </router-link>
        </div>
        <div class="px-5 py-2">
          <a
            href="https://twitter.com/Inciteful_xyz"
            target="_blank"
            class="text-base leading-6 hover:text-gray-300"
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
      </nav>
      <div class="mt-8">
        <p class="text-center text-base leading-6 ">
          &copy; 2020 Inciteful. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Footer'
})
</script>
