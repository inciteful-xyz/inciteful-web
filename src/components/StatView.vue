<template>
  <span
    ><span class="text-gray-300" v-if="loading">-</span
    ><span v-else>{{ getValue() }}</span></span
  >
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import numeral from 'numeral'
import { QueryResults, QueryValue } from '../types/incitefulTypes'
export default defineComponent({
  name: 'StatView',
  props: {
    results: {} as PropType<QueryResults>,
    loading: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  methods: {
    getValue(): QueryValue | undefined {
      if (this.results && this.results.length > 0) {
        return this.format(this.results[0].value)
      }
    },
    format(val: QueryValue): string {
      const parseVal = +val

      if (typeof val === 'string' && !isNaN(parseVal)) {
        return numeral(val).format('0,0.[000000]')
      }

      return val.toString()
    }
  }
})
</script>
