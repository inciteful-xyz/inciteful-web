<template>
  <single-column>
    <h1>Beta Features</h1>
    <p class="py-2 text-sm">
      Below you will find a list of the current features we are beta testing. I
      cannot promise these will be supported for any significant period of time
      or that they will ever see the light of day. I try to ensure that state is
      preserved in the url for a page, that means if you share the url, the
      person you share it with should see the exact same page as you. These
      features break that promise. Use at your own risk.
      <a
        class="text-purple-700 cursor-pointer hover:text-purple-500"
        href="mailto:feedback@inciteful.xyz"
        >Feedback</a
      >
      on these features is greatly appreciated.
    </p>
    <h2 class="text-lg pt-5 pb-3 font-medium">Graph Pruning</h2>
    <p class="pb-2 text-sm">
      In most fields there are papers which are considered "canonical" or are
      methods/tools papers. These papers tend to be cited by everyone in the
      field and their presence doesn't provide useful information to the graph.
      In fact, in many instances these papers create their own gravity and most
      graphs in the field end up centering around them, making the graph less
      useful.
    </p>
    <p class="pb-2 text-sm">
      When you use this feature, if a paper has more than the specified number
      of citations, then the graph builder will not pull in papers which cite
      that paper. The paper will still be present in the graph and it will still
      get citations if other papers in the graph cite it. The net effect is to
      dampen the papers impact on the overall graph. Please feel free to
      experiment with different levels. I reccomend starting high (5,000 or so)
      and working your way down to what feels right.
    </p>
    <p class="pb-2 text-sm">
      When giving feedback about what works for you, please specify the prune
      level, your field of study, and some example urls.
    </p>
    <div>
      <label for="pruneLevel" class="block text-base leading-5 text-gray-700"
        >Prune Level</label
      >
      <div class="mt-1 relative rounded-md shadow-sm w-40">
        <input
          id="pruneLevel"
          class="form-input block w-40
px-4 py-2 border border-gray-300 rounded-md leading-5 bg-white
transition duration-150 ease-in-out focus:outline-none focus:border-blue-300"
          v-model="pruneLevel"
        />
      </div>
    </div>
    <div class="py-4">
      <span class="inline-flex rounded-md shadow-sm">
        <button type="button" v-on:click="saveSettings" class="button-purple">
          Save
        </button>
      </span>
    </div>
    <div :class="{ hidden: !saved }">
      <div class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-5 w-5 text-green-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm leading-5 font-medium text-green-800">
              Preferences Successfully Saved
            </p>
          </div>
        </div>
      </div>
    </div>
  </single-column>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import options from '../utils/options'
import { CheckCircleIcon } from '@heroicons/vue/solid'
import SingleColumn from '@/components/layout/SingleColumn.vue'

export default defineComponent({
  name: 'BetaPage',
  components: {
    CheckCircleIcon,
    SingleColumn
  },
  data () {
    return {
      pruneLevel: options.getPruneLevel(),
      saved: false
    }
  },
  computed: {
    anySet () {
      if (this.pruneLevel) return true
      else return false
    }
  },
  methods: {
    saveSettings (): void {
      options.setPruneLevel(this.pruneLevel)
      this.saved = true
      setTimeout(() => {
        this.saved = false
      }, 2000)
    }
  }
})
</script>
