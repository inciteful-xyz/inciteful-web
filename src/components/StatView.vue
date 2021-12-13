<template>
  <span
    ><span class="text-gray-300" v-if="loading">-</span
    ><span v-else>{{ getValue() }}</span></span
  >
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import numeral from 'numeral'
export default defineComponent({
  name: 'StatView',
  props: {
    results: {} as PropType<{ value: any }[]>,
    loading: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  methods: {
    getValue (): any {
      if (this.results && this.results.length > 0) {
        return this.format(this.results[0].value)
      }
    },
    format (val: any): string {
      const parseVal = +val
      return !isNaN(parseVal) ? numeral(val).format('0,0.[000000]') : val
    }
  }
})
</script>
