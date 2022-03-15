<template>
  <div class="pt-3" :class="$props.class">
    <div class="flex flex-col">
      <div class="-my-2 sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow border-b border-gray-200 sm:rounded-lg">
            <div>
              <table class="base-table">
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
              </table>
              <div
                v-if="$slots.footer"
                class="flex text-sm border-t border-gray-200"
              >
                <slot name="footer"></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
