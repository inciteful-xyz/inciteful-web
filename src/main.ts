import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'
import router from './router'
import store from './store'

import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import VueTour from 'v3-tour'

import './assets/tailwind.css'

const emitter = mitt()
const app = createApp(App)
app.config.globalProperties.emitter = emitter

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    app,
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

require('v3-tour/dist/vue-tour.css')
app
  .use(router)
  .use(store)
  .use(VueTour)

app.directive('click-outside', {
  beforeMount (el, binding) {
    el.clickOutsideEvent = function (event: Event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
})

app.mount('#app')
