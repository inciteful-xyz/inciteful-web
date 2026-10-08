import posthog from 'posthog-js'

export type MedLinkPlacement = 'header' | 'mobile_menu' | 'hero' | 'footer'

/**
 * Record a click on a link from Academic to the Inciteful Med homepage.
 * Sent immediately by beacon, because the click navigates away from the page.
 */
export function trackMedLinkClick(placement: MedLinkPlacement) {
  posthog.capture(
    'academic_med_link_clicked',
    { placement },
    { send_instantly: true, transport: 'sendBeacon' }
  )
}
