<template>
  <footer class="border-t shadow bg-gray-800 text-gray-100 pt-6">
    <div
      class="max-w-screen-xl mx-auto py-8 px-4 overflow-hidden sm:px-6 lg:px-8"
    >
      <nav class="-mx-5 -my-2 flex flex-wrap justify-center">
        <div class="px-5 py-2">
          <router-link to="/p" class="text-base leading-6 hover:text-gray-300">
            Paper Discovery
          </router-link>
        </div>
        <div class="px-5 py-2">
          <router-link to="/c" class="text-base leading-6 hover:text-gray-300">
            Literature Connector
          </router-link>
        </div>
        <div class="px-5 py-2">
          <router-link
            to="/einstein"
            class="text-base leading-6 hover:text-gray-300"
          >
            6° of Einstein
          </router-link>
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
        <div class="px-1 py-2">
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
          </a>
        </div>
        <div class="px-1 py-2">
          <a
            href="https://github.com/inciteful-xyz/inciteful-web"
            target="_blank"
            class="text-base leading-6 hover:text-gray-300"
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path
                d="M12 0.75c-6.213 0-11.25 5.037-11.25 11.25s5.037 11.25 11.25 11.25 11.25-5.037 11.25-11.25-5.037-11.25-11.25-11.25zM21.75 12c0 0.001 0 0.002 0 0.004 0 4.454-2.986 8.21-7.066 9.375l-0.069 0.017v-3.648q0-1.298-0.696-1.9c0.516-0.052 0.983-0.137 1.435-0.255l-0.064 0.014c0.479-0.134 0.897-0.312 1.284-0.536l-0.026 0.014c0.425-0.234 0.784-0.531 1.080-0.884l0.005-0.006q0.435-0.529 0.709-1.405t0.274-2.014q0-1.619-1.057-2.757 0.495-1.218-0.107-2.73-0.375-0.121-1.084 0.147c-0.475 0.176-0.88 0.374-1.263 0.607l0.032-0.018-0.509 0.321c-0.77-0.221-1.655-0.348-2.57-0.348s-1.799 0.127-2.638 0.364l0.068-0.016c-0.59-1.127-2.086-1.199-2.837-1.057-0.5 0.797-0.44 2.054-0.094 2.73q-1.057 1.138-1.057 2.757 0 1.138 0.274 2.007t0.703 1.405c0.296 0.363 0.653 0.663 1.059 0.887l0.019 0.009c0.361 0.21 0.779 0.389 1.219 0.513l0.038 0.009c0.389 0.105 0.856 0.189 1.333 0.238l0.039 0.003q-0.535 0.482-0.656 1.379c-0.173 0.084-0.374 0.153-0.585 0.198l-0.017 0.003c-0.214 0.043-0.46 0.067-0.711 0.067-0.018 0-0.036-0-0.054-0l0.003 0q-0.442 0-0.877-0.288t-0.743-0.837c-0.166-0.281-0.383-0.513-0.642-0.691l-0.007-0.005q-0.395-0.268-0.662-0.321l-0.121-0.027c-0.020-0.005-0.044-0.008-0.068-0.008-0.12 0-0.224 0.068-0.275 0.167l-0.001 0.002-0.016 0.031c-0.022 0.041-0.034 0.090-0.034 0.142 0 0.125 0.073 0.232 0.179 0.281l0.002 0.001q0.294 0.134 0.582 0.509c0.159 0.198 0.3 0.422 0.413 0.662l0.009 0.020 0.134 0.308c0.113 0.336 0.318 0.617 0.585 0.82l0.004 0.003c0.25 0.196 0.553 0.337 0.884 0.399l0.013 0.002c0.276 0.054 0.597 0.088 0.925 0.094l0.005 0c0.037 0.001 0.081 0.002 0.125 0.002 0.218 0 0.432-0.018 0.64-0.052l-0.023 0.003 0.308-0.053q0 0.508 0.007 1.191c0.003 0.276 0.005 1.027 0.006 1.582-4.213-1.141-7.262-4.93-7.262-9.431 0-4.014 2.424-7.462 5.889-8.959l0.063-0.024c1.121-0.487 2.426-0.77 3.798-0.77 5.383 0 9.747 4.364 9.747 9.747 0 0.003 0 0.006 0 0.009v-0z"
              ></path>
            </svg>
          </a>
        </div>
      </nav>
      <div class="mt-6">
        <p class="text-center text-sm leading-6">
          Help support free open source tools for academics. If you found this
          site helpful, please cite it:
        </p>
        <p class="mt-1 text-center text-sm leading-6">
          Weishuhn, M. ({{ new Date().getFullYear() }}). Inciteful: Citation
          network exploration. Retrieved from https://inciteful.xyz
        </p>
      </div>
      <div class="mt-6">
        <p class="text-center text-sm leading-6 ">
          &copy; {{ year }} Inciteful. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Footer',
  setup () {
    return {
      year: new Date().getFullYear()
    }
  }
})
</script>
