<template>
  <div
    v-if="validState"
    class="fixed inset-0 overflow-y-auto z-40"
    @keydown.esc="clearModal"
  >
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
          It's a modal!
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ModalOptions, PaperID } from '@/types/inciteful'

export default defineComponent({
  name: 'CollectionManagerModal',
  components: {},
  data () {
    return {
      options: undefined as ModalOptions | undefined,
      ids: undefined as PaperID[] | undefined
    }
  },
  mounted () {
    this.emitter.on('save_collection', (ids: PaperID[]) => {
      console.log('received')
      if (ids) {
        this.ids = ids
      }
    })
  },
  computed: {
    validState (): boolean {
      return this.ids !== undefined && this.ids.length > 0
    }
  },
  methods: {
    clearModal (): void {
      this.ids = undefined
    },
    backButton (): void {
      if (this.options && this.options.previousScreen) {
        this.options = this.options.previousScreen
      } else {
        this.clearModal()
      }
    }
  }
})
</script>
