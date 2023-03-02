import * as Sentry from '@sentry/browser'
import { AxiosError } from 'axios'

export function logError(err: AxiosError) {
  Sentry.setExtra('error', err)
  Sentry.captureException(err)
}

export function logInfo(message: string, obj: unknown) {
  Sentry.withScope(scope => {
    Sentry.setExtra('obj', obj)
    Sentry.captureMessage(message, scope)
  })
}
