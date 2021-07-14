
import * as Sentry from '@sentry/browser'

function logError (err) {
  Sentry.setExtra('error', err)
  Sentry.captureException(err)
}

function logInfo (message, obj) {
  Sentry.withScope((scope) => {
    Sentry.setExtra('obj', obj)
    Sentry.captureMessage(message, scope)
  })
}

export default {
  logError,
  logInfo
}
