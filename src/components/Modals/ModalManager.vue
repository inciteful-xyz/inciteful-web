<template>
  <div v-if="validState" class="fixed inset-0 overflow-y-auto z-40">
    <div
      class="
        flex
        items-end
        justify-center
        sm:min-h-screen
        pt-4
        px-4
        pb-20
        text-center
        sm:block
        sm:p-0
      "
    >
      <transition
        enter-active-class="transition ease-out duration-300"
        enter-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-in duration-200"
        leave-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-show="validState" class="fixed inset-0 transition-opacity">
          <div
            class="absolute inset-0 bg-gray-500 opacity-75"
            v-on:click="clearModal()"
          ></div>
        </div>
      </transition>
      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
      <transition
        enter-active-class="ease-out duration-300"
        enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="ease-in duration-200"
        leave-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div
          class="
            inline-block
            align-bottom
            bg-white
            rounded-lg
            px-4
            pt-5
            pb-4
            text-left
            overflow-hidden
            shadow-xl
            transform
            transition-all
            sm:my-8
            sm:align-middle
            sm:max-w-4xl
            sm:w-full
            sm:p-6
          "
          role="dialog"
          aria-modal="true"
          v-show="validState"
          aria-labelledby="modal-headline"
        >
          <div class="fixed top-2 right-2">
            <button
              class="
                font-extrabold
                text-sm
                rounded-full
                h-5
                w-5
                bg-purple-500
                text-white
                justify-center
              "
              v-on:click="clearModal()"
            >
              X
            </button>
          </div>
          <div class="text-sm">
            <paper-modal-content
              v-if="isPaper"
              :options="(options as PaperModalOptions)"
              @clearModal="clearModal"
              @back="back"
            />
            <author-modal-content
              v-if="isAuthor"
              :options="(options as AuthorModalOptions)"
              @clearModal="clearModal"
              @back="back"
            />
            <collection-modal-content
              v-if="isCollection"
              :options="(options as CollectionModalOptions)"
              @back="back"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PaperModalContent from './PaperModalContent.vue'
import AuthorModalContent from './AuthorModalContent.vue'
import CollectionModalContent from './CollectionModalContent.vue'

import {
  AuthorModalOptions,
  CollectionModalOptions,
  isAuthorModalOptions,
  isCollectionModalOptions,
  isPaperModalOptons,
  ModalOptions,
  PaperModalOptions
} from '@/types/modalTypes'
import { EmitEvents } from '@/utils/emitHelpers'

export default defineComponent({
  name: 'Modal',
  components: {
    PaperModalContent,
    AuthorModalContent,
    CollectionModalContent
  },
  data() {
    return {
      options: undefined as ModalOptions | undefined
    }
  },
  mounted() {
    this.emitter.on(EmitEvents.ShowModal, (options: ModalOptions) => {
      if (this.options !== undefined) {
        options.previousScreen = this.options
      }
      this.options = options
    })
  },
  computed: {
    isPaper(): boolean {
      return this.options !== undefined && isPaperModalOptons(this.options)
    },
    isAuthor(): boolean {
      return this.options !== undefined && isAuthorModalOptions(this.options)
    },
    isCollection(): boolean {
      return (
        this.options !== undefined && isCollectionModalOptions(this.options)
      )
    },

    validState(): boolean {
      return this.isPaper || this.isAuthor || this.isCollection
    }
  },
  methods: {
    clearModal(): void {
      this.options = undefined
    },
    back(): void {
      if (this.options && this.options.previousScreen) {
        this.options = this.options.previousScreen
      } else {
        this.clearModal()
      }
    }
  }
})
</script>
