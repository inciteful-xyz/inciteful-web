import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import * as Sentry from "@sentry/vue";
import VueTour from "v3-tour";
import VueClickAway from "vue3-click-away";
import Vue3TouchEvents from "vue3-touch-events";
import posthog from "posthog-js";

import "./assets/tailwind.css";
import "v3-tour/dist/vue-tour.css";
import { emitter } from "./utils/emitHelpers";
import { head } from "./utils/head";

posthog.init(import.meta.env.VITE_POSTHOG_PROJECT_TOKEN || "", {
  api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  autocapture: false,
});

const app = createApp(App);

// For options API
app.config.globalProperties.emitter = emitter;
// For composition API
app.provide("emitter", emitter);

if (import.meta.env.PROD) {
  Sentry.init({
    app,
    dsn: "https://e0f9638a22234f65b69a22a10537ab95@o415910.ingest.sentry.io/5512736",
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.vueIntegration({ app }),
    ],
    release: "inciteful-js@" + __COMMIT_HASH__,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0,
    ignoreErrors: [
      // Network errors — user connectivity or transient API issues
      "Network Error",
      "Failed to fetch",
      "NetworkError when attempting to fetch resource",
      "Load failed",
      "Request aborted",
      "timeout exceeded",
      // Browser extensions
      "Zotero Connector",
      "runtime.sendMessage",
      "Error invoking post",
      "Error invoking postMessage",
      // Stale assets after deploy
      "Failed to fetch dynamically imported module",
      "Loading CSS chunk",
      "Unable to preload CSS",
      "Importing a module script failed",
      // localStorage unavailable
      "Failed to read the 'localStorage' property from 'Window'",
      // Max call stack — no actionable stack trace
      "Maximum call stack size exceeded",
    ],
    denyUrls: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
      /webkit-masked-url/,
    ],
    beforeSend(event, hint) {
      const error = hint?.originalException;
      // Drop Axios errors for 4xx/5xx and network failures
      if (error && typeof error === "object" && "isAxiosError" in error) {
        return null;
      }
      // Drop non-Error promise rejections (e.g. undefined)
      if (event.exception?.values?.[0]?.type === "UnhandledRejection") {
        const value = event.exception.values[0].value;
        if (value === "undefined" || value === "null" || value === "") {
          return null;
        }
      }
      return event;
    },
  });
}

app.config.errorHandler = (err) => {
  posthog.captureException(err);
};

app
  .use(router)
  .use(VueTour)
  .use(VueClickAway)
  .use(Vue3TouchEvents as any)
  .use(head);

app.mount("#app");
