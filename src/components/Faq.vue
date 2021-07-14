<template>
  <div v-if="faqs" class="bg-white">
    <div class="max-w-screen-xl mx-auto py-3 px-4 sm:py-6 sm:px-6 lg:px-8">
      <h2 class="text-xl md:text-3xl leading-9 font-extrabold text-gray-900">
        Frequently asked questions
      </h2>

      <div class="mt-6 border-t border-gray-200 pt-10">
        <dl
          class="
            space-y-10
            md:space-y-0
            md:grid md:grid-cols-2 md:grid-rows-2
            md:gap-x-4 md:gap-y-6
          "
        >
          <div v-for="(faq, index) in faqs" :key="index" class="space-y-2">
            <dt
              class="text-base md:text-lg leading-6 font-medium text-gray-900"
            >
              <span v-html="faq.question"></span>
            </dt>
            <dd class="text-sm md:text-base leading-6 text-gray-500">
              <span v-html="faq.answer"></span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Faq',
  props: {
    faqs: Array
  }
}
</script>
