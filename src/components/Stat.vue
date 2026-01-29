<template>
  <div class="flex flex-col flex-1 mx-2 mt-2">
    <div
      class="order-2 mt-2 leading-6 font-medium text-gray-400 whitespace-nowrap"
      aria-hidden="true"
    >
      <slot name="name"></slot>
    </div>
    <div
      class="
        order-1
        text-xl
        sm:text-4xl
        leading-none
        font-extrabold
        text-gray-600
      "
      role="status"
      :aria-label="$slots.name ? undefined : undefined"
    >
      <slot name="value"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Stat'
})
</script>
