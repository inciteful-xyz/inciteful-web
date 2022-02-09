<template>
  <Tour :name="name" :steps="steps" :ready="ready" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tour from './Tour.vue'

export default defineComponent({
  name: 'LitConnectorTour',
  components: { Tour },
  props: {
    ready: Boolean
  },
  data () {
    return {
      name: 'litConnectorTour',
      startedTour: false,
      steps: [
        {
          target: '#logo',
          content: "Let's take a tour of our Literature Connector",
          params: {
            placement: 'bottom',
            highlight: false
          },
          offset: -200
        },
        {
          target: '#connected-papers',
          content: 'We have basic info about the papers we are connecting',
          params: {
            placement: 'bottom'
          },
          offset: -100
        },
        {
          target: '#connection-stats',
          content: 'General stats about how they are connected',
          params: {
            placement: 'bottom'
          },
          offset: -100
        },
        {
          target: '#graph-view',
          content: 'The visualization of how the papers are connected.',
          params: {
            placement: 'top'
          },
          offset: -200
        },
        {
          target: '#graph-filters',
          content: 'Filters allowing you to search for narrow down the papers.',
          params: {
            placement: 'top'
          },
          offset: -200
        },
        {
          target: '#connector-table',
          content: 'A table view of all of the papers in the above graph.',
          params: {
            placement: 'top'
          },
          offset: -200
        },
        {
          target: '.add-paper-button',
          content:
            'Use the + buttons to start adding papers to a custom graph.',
          params: {
            placement: 'right'
          },
          offset: -100
        },
        {
          target: '.graph-lock',
          content:
            'Use the lock to narrow the graph down to only paths which contain this paper.',
          params: {
            placement: 'left'
          },
          offset: -100
        },
        {
          target: '.save-export',
          content:
            'You can also export the whole table into your reference manager',
          offset: -200,
          params: {
            placement: 'left'
          }
        }
      ]
    }
  }
})
</script>
