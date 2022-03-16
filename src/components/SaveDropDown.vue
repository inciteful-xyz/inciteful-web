<template>
  <Menu as="div" class="relative inline-block text-right z-10 save-export">
    <div>
      <MenuButton
        class="inline-flex justify-center px-4 py-2 mx-2 bg-white hover:bg-gray-50 focus:outline-none "
      >
        <DocumentDownloadIcon class="h-4 w-4" />
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
          <MenuItem v-slot="{ active }" v-if="user.enabled && user.isSignedIn">
            <button
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex items-center px-4 py-2 text-sm text-right'
              ]"
              @click="saveCollection"
            >
              Save to Collection
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }" v-if="user.enabled && user.isSignedIn">
            <button
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex items-center px-4 py-2 text-sm text-right'
              ]"
              @click="saveToFavorites"
            >
              Save to Favorites
            </button>
          </MenuItem>

          <MenuItem v-slot="{ active }">
            <button
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex items-center px-4 py-2 text-sm w-full text-right'
              ]"
              @click="downloadBibFile"
            >
              BibTex
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex items-center px-4 py-2 text-sm w-full text-right'
              ]"
              @click="downloadRisFile"
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
import { defineComponent, inject, PropType } from 'vue'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { DocumentDownloadIcon } from '@heroicons/vue/outline'
import { useUserStore } from '@/stores/user'
import { IncitefulEmitter, PaperID } from '@/types/incitefulTypes'
import api from '@/utils/api'
import { useDBStore } from '@/stores/db'
import { CollectionModalOptions } from '@/types/modalTypes'

export default defineComponent({
  name: 'SaveDropDown',
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    DocumentDownloadIcon
  },
  props: {
    ids: {} as PropType<PaperID[]>
  },
  setup (props) {
    const emitter = inject('emitter') as IncitefulEmitter
    let db = useDBStore()

    let user = useUserStore()
    const saveCollection = () => {
      if (props.ids !== undefined) {
        const options: CollectionModalOptions = {
          collectionAction: 'save',
          contextIds: props.ids
        }

        emitter.emit('show_paper_modal', options)
      }
    }

    const saveToFavorites = () => {
      if (props.ids !== undefined) {
        db.addFavorites(props.ids)
      }
    }
    const downloadBibFile = () => {
      if (props.ids !== undefined) api.downloadBibFile(props.ids)
    }
    const downloadRisFile = () => {
      if (props.ids !== undefined) api.downloadRisFile(props.ids)
    }

    return {
      user,
      downloadBibFile,
      downloadRisFile,
      saveCollection,
      saveToFavorites
    }
  }
})
</script>
