// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ZoteroPlugin from '@/views/ZoteroPlugin.vue'

const FIREFOX = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.5; rv:132.0) Gecko/20100101 Firefox/132.0'
const CHROME =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

function mountWithUserAgent(ua: string) {
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(ua)
  return mount(ZoteroPlugin)
}

describe('ZoteroPlugin Firefox hint', () => {
  afterEach(() => vi.restoreAllMocks())

  it('shows the Save Link As hint in Firefox', () => {
    const hint = mountWithUserAgent(FIREFOX).find('[data-testid="firefox-hint"]')
    expect(hint.exists()).toBe(true)
    expect(hint.text()).toBe('In Firefox, right-click the link and choose "Save Link As…"')
  })

  it('hides it in other browsers', () => {
    expect(mountWithUserAgent(CHROME).find('[data-testid="firefox-hint"]').exists()).toBe(false)
  })
})
