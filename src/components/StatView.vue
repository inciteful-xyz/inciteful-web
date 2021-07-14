<template>
  <span
    ><span class="text-gray-300" v-if="loading">-</span
    ><span v-else>{{ getValue() }}</span></span
  >
</template>

<script>
import numeral from 'numeral'
export default {
  name: 'StatView',
  props: {
    results: Array,
    errorMsg: undefined,
    loading: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  methods: {
    getValue () {
      if (this.results && this.results.length > 0) {
        return this.format(this.results[0].value)
      }
    },
    format (val) {
      const parseVal = +val
      return !isNaN(parseVal) ? numeral(val).format('0,0.[000000]') : val
    }
  }
}
</script>
