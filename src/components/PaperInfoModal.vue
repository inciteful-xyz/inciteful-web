<template>
  <div
    v-if="validState"
    class="fixed inset-0 overflow-y-auto z-40"
    @keydown.esc="clearPaper"
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
            v-on:click="clearPaper()"
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
              v-on:click="clearPaper()"
            >
              X
            </button>
          </div>
          <div class="text-sm">
            <paper-modal-content
              v-if="hasPaper"
              :paperId="options.paperId"
              :connectTo="options.connectTo"
              :options="options"
              :graphIds="options.graphIds"
              @clearModal="clearPaper"
            />
            <author-modal-content
              v-if="hasAuthor"
              :author="options.author"
              :ids="options.graphIds"
              :options="options"
            />
            <div class="flex whitespace-nowrap pt-6">
              <div class="sm:flex-1 hidden sm:flex">
                <span class="inline-flex rounded-md shadow-sm">
                  <button
                    v-on:click="backButton()"
                    class="
                      inline-flex
                      items-center
                      px-4
                      py-2
                      border border-transparent
                      text-sm
                      leading-5
                      font-medium
                      rounded-md
                      text-white
                      bg-gray-500
                      hover:bg-gray-400
                      focus:outline-none
                      focus:border-gray-600
                      focus:ring-gray
                      active:bg-gray-600
                      transition
                      ease-in-out
                      duration-150
                    "
                  >
                    Back
                  </button>
                </span>
              </div>
              <div class="flex-1 sm:text-center">
                <span class="inline-flex rounded-md shadow-sm">
                  <button
                    v-if="hasPaper"
                    v-on:click="goToPaper"
                    class="
                      inline-flex
                      items-center
                      px-4
                      py-2
                      border border-transparent
                      text-sm
                      leading-5
                      font-medium
                      rounded-md
                      text-white
                      bg-purple-400
                      hover:bg-purple-300
                      focus:outline-none
                      focus:border-purple-500
                      focus:ring-purple
                      active:bg-purple-500
                      transition
                      ease-in-out
                      duration-150
                    "
                  >
                    Go to Graph
                  </button>
                </span>
              </div>
              <div class="flex-1 text-right">
                <span class="inline-flex rounded-md shadow-sm">
                  <button
                    v-on:click="addToLitReview()"
                    class="
                      inline-flex
                      items-center
                      px-4
                      py-2
                      border border-transparent
                      text-sm
                      leading-5
                      font-medium
                      rounded-md
                      text-white
                      bg-purple-600
                      hover:bg-purple-500
                      focus:outline-none
                      focus:border-purple-700
                      focus:ring-purple
                      active:bg-purple-700
                      transition
                      ease-in-out
                      duration-150
                    "
                  >
                    Add to Lit Review
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import navigation from '../navigation'
import PaperModalContent from './PaperModalContent.vue'
import AuthorModalContent from './AuthorModalContent.vue'
import { ModalOptions } from '@/types/inciteful'

export default defineComponent({
  name: 'PaperInfoModal',
  components: {
    PaperModalContent,
    AuthorModalContent
  },
  data () {
    return {
      options: undefined as ModalOptions | undefined
    }
  },
  mounted () {
    this.emitter.on('show_paper_modal', (options: ModalOptions) => {
      if (options) {
        if (this.options !== undefined) {
          options.previousScreen = this.options
        }

        this.options = options
      }
    })
  },
  computed: {
    hasPaper (): boolean {
      return !!(this.options && this.options.paperId)
    },
    hasAuthor (): boolean {
      return !!(this.options && this.options.author && this.options.graphIds)
    },
    validState (): boolean {
      return this.hasPaper || this.hasAuthor
    }
  },
  methods: {
    addToLitReview (): void {
      this.emitter.emit('add_to_lit_review', this.options!.paperId!)
      this.backButton()
    },
    clearPaper (): void {
      this.options = undefined
    },
    goToPaper (): void {
      this.$router.push({
        path: navigation.getPaperUrl(this.options!.paperId!)
      })

      this.clearPaper()
    },
    backButton (): void {
      if (this.options && this.options.previousScreen) {
        this.options = this.options.previousScreen
      } else {
        this.clearPaper()
      }
    }
  }
})
</script>
