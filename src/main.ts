import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'
import router from './router'
import { createPinia } from 'pinia'

import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import VueTour from 'v3-tour'
import VueClickAway from 'vue3-click-away'
import Vue3TouchEvents from 'vue3-touch-events'

import './assets/tailwind.css'
import { useUserStore } from './stores/user'
require('v3-tour/dist/vue-tour.css')


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


(async () => {
  app
    .use(createPinia())

  app.use(createPinia());
  const { bindUser } = useUserStore();
  await bindUser();

  app.use(router)
    .use(VueTour)
    .use(VueClickAway)
    .use(Vue3TouchEvents)

  app.mount('#app')

})();
