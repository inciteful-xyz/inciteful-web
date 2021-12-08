<template>
  <div class="flex flex-col flex-1 mx-2 mt-2">
    <dt
      class="order-2 mt-2 leading-6 font-medium text-gray-400 whitespace-nowrap"
    >
      <slot name="name"></slot>
    </dt>
    <dd
      class="
        order-1
        text-xl
        sm:text-4xl
        leading-none
        font-extrabold
        text-gray-600
      "
    >
      <slot name="value"></slot>
    </dd>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'Stat'
})
</script>
