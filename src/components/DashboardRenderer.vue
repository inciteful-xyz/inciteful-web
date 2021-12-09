<template>
  <div :class="template.id">
    <div v-if="template.title" class="text-gray-800 font-bold text-xl">
      {{ template.title }}
    </div>
    <div v-if="template.subtext" class="text-gray-700 font-normal">
      {{ template.subtext }}
    </div>
    <div v-if="template.sql">
      <SqlView
        :view="template.type"
        :sql="template.sql"
        :ids="ids"
        :emptyMessage="template.emptyMessage"
      />
    </div>
    <div
      v-if="template.content"
      :class="[
        'pb-8',
        { 'lg:flex': template.renderColumns },
        { 'flex-wrap': template.renderColumns }
      ]"
    >
      <div
        v-for="(content, index) in template.content"
        :key="index"
        :class="[
          'pt-5',
          { 'flex-none': template.renderColumns },
          { 'lg:flex-1': template.renderColumns },
          { 'lg:pr-5': template.renderColumns }
        ]"
      >
        <DashboardRenderer :template="content" :ids="ids" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PaperID } from '@/types/inciteful'
import Vue, { PropType } from 'vue'
import SqlView from './SqlView.vue'

export default Vue.extend({
  name: 'DashboardRenderer',
  components: { SqlView },
  props: {
    ids: {} as PropType<PaperID[]>,
    template: Object
  }
})
</script>
