<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <Menu as="div" class="relative inline-block text-left z-10">
    <div>
      <MenuButton
        class="inline-flex justify-center px-4 py-2 bg-white hover:bg-gray-50 focus:outline-none "
      >
        <DocumentDownloadIcon class="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
        Save
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="origin-top-right absolute right-0 mt-2 w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
      >
        <div class="py-1">
          <MenuItem v-slot="{ active }" v-if="user.enabled">
            <button
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex items-center px-4 py-2 text-sm'
              ]"
            >
              Save to Collection
            </button> </MenuItem
          ><MenuItem v-slot="{ active }">
            <button
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex items-center px-4 py-2 text-sm'
              ]"
            >
              BibTex
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex items-center px-4 py-2 text-sm'
              ]"
            >
              RIS
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { DocumentDownloadIcon } from '@heroicons/vue/outline'
import { useUserStore } from '@/stores/user'
export default defineComponent({
  name: 'SaveModal',
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    DocumentDownloadIcon
  },
  setup () {
    let user = useUserStore()
    return {
      user
    }
  }
})
</script>
