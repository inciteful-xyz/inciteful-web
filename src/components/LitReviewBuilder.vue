<template>
  <div>
    <div
      class="fixed bottom-4 sm:bottom-20 right-4 sm:right-10"
      v-if="ids.size > 0"
    >
      <span
        v-bind:class="[
          { 'animate-bounce': doBounce },
          'relative',
          'inline-flex',
          'rounded-md',
          'shadow-sm'
        ]"
      >
        <button
          class="inline-flex items-center rounded-lg bg-purple-700 hover:bg-purple-500 focus:outline-none focus:border-purple-700 text-white p-3"
          v-on:click="toLitReview()"
        >
          Add Papers ({{ ids.size }})
          <ArrowRightIcon class="w-4 h-4 ml-2" />
        </button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { PaperID } from '@/types/incitefulTypes'
import { defineComponent } from 'vue'
import { ArrowRightIcon } from '@heroicons/vue/outline'
import { EmitEvents } from '@/utils/emitHelpers'

export default defineComponent({
  name: 'LitReviewBuilder',
  components: { ArrowRightIcon },
  data () {
    return {
      doBounce: false,
      ids: new Set<PaperID>()
    }
  },
  mounted () {
    this.emitter.on(EmitEvents.AddToLitReview, (id: PaperID) => {
      if (!this.ids.has(id)) {
        this.ids.add(id)
        this.doBounce = true
        this.$forceUpdate()
        setTimeout(() => {
          this.doBounce = false
        }, 2500)
      }
    })
  },
  methods: {
    toLitReview () {
      if (this.$route.query.ids) {
        if (Array.isArray(this.$route.query.ids)) {
          this.$route.query.ids.forEach(id => {
            if (id) this.ids.add(id)
          })
        } else {
          this.ids.add(this.$route.query.ids)
        }
      }
      if (this.$route.name === 'PaperDiscovery') {
        this.ids.add(this.$route.params.pathMatch as string)
      }
      if (this.$route.query.from !== undefined && this.$route.query.from) {
        this.ids.add(this.$route.query.from as string)
      }
      if (this.$route.query.to !== undefined && this.$route.query.to) {
        this.ids.add(this.$route.query.to as string)
      }

      this.$router.push({
        name: 'LitReview',
        query: {
          ids: Array.from(this.ids)
        }
      })

      this.ids = new Set()
    }
  }
})
</script>
