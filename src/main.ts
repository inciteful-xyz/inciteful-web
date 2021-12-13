import Vue, { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import VueTour from 'vue-tour'

import './assets/tailwind.css'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    Vue: Vue,
    dsn:
      'https://e0f9638a22234f65b69a22a10537ab95@o415910.ingest.sentry.io/5512736',
    integrations: [new Integrations.BrowserTracing()],
    release: 'inciteful-js@' + process.env.__COMMIT_HASH__,
    environment: process.env.NODE_ENV,
    tracingOptions: {
      trackComponents: true
    },
    tracesSampleRate: 1.0
  })
}

createApp(App).use(router).use(store).mount('#app')

require('vue-tour/dist/vue-tour.css')
Vue.use(VueTour)
