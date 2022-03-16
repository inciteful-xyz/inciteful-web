<template>
  <div class="shadow border-b border-gray-200 sm:rounded-lg">
    <table class="base-table" :class="$props.class">
      <thead>
        <tr>
          <slot name="header"></slot>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <slot name="row" :item="item" :index="index"></slot>
        </tr>
      </tbody>
      <tfoot v-if="$slots.footer">
        <slot name="footer"></slot>
      </tfoot>
    </table>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'TableBase',
  props: {
    items: {} as PropType<any[]>
  },
  data () {
    return {}
  }
})
</script>
