import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals'

interface WebVitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

const metricsCollected: WebVitalsMetric[] = []

function reportMetric(metric: Metric) {
  const vitalsMetric: WebVitalsMetric = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id
  }

  metricsCollected.push(vitalsMetric)

  // Log to console in development
  if (import.meta.env.DEV) {
    const ratingEmoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌'
    console.log(
      `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)}ms ${ratingEmoji} (${metric.rating})`,
      `color: ${metric.rating === 'good' ? 'green' : metric.rating === 'needs-improvement' ? 'orange' : 'red'}`
    )
  }
}

export function initWebVitals() {
  // Largest Contentful Paint - measures loading performance
  // Good: <=2.5s, Needs improvement: <=4s, Poor: >4s
  onLCP(reportMetric)

  // First Contentful Paint - measures when first content appears
  // Good: <=1.8s, Needs improvement: <=3s, Poor: >3s
  onFCP(reportMetric)

  // Cumulative Layout Shift - measures visual stability
  // Good: <=0.1, Needs improvement: <=0.25, Poor: >0.25
  onCLS(reportMetric)

  // Interaction to Next Paint - measures responsiveness
  // Good: <=200ms, Needs improvement: <=500ms, Poor: >500ms
  onINP(reportMetric)

  // Time to First Byte - measures server response time
  // Good: <=800ms, Needs improvement: <=1800ms, Poor: >1800ms
  onTTFB(reportMetric)
}

export function getCollectedMetrics(): WebVitalsMetric[] {
  return [...metricsCollected]
}

// Expose globally for testing from browser console
if (typeof window !== 'undefined') {
  (window as any).getWebVitals = getCollectedMetrics
}
