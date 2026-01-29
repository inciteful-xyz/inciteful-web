import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as Sentry from '@sentry/vue'
import VueTour from 'v3-tour'
import VueClickAway from 'vue3-click-away'
import Vue3TouchEvents from 'vue3-touch-events'

import './assets/tailwind.css'
import 'v3-tour/dist/vue-tour.css'
import { emitter } from './utils/emitHelpers'
import { createHead } from "@unhead/vue/client"
import { initWebVitals } from './utils/webVitals'

const app = createApp(App)

// For options API
app.config.globalProperties.emitter = emitter
// For composition API
app.provide('emitter', emitter)

if (import.meta.env.PROD) {
  Sentry.init({
    app,
    dsn:
      'https://e0f9638a22234f65b69a22a10537ab95@o415910.ingest.sentry.io/5512736',
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.vueIntegration({ app })
    ],
    release: 'inciteful-js@' + __COMMIT_HASH__,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0
  })
}

const head = createHead()

app
  .use(router)
  .use(VueTour)
  .use(VueClickAway)
  .use(Vue3TouchEvents as any)
  .use(head)

app.mount('#app')

// Initialize web vitals measurement
initWebVitals()
