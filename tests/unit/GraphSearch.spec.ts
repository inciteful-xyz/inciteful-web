// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, VueWrapper } from '@vue/test-utils'
import GraphSearch from '@/components/GraphSearch.vue'
import api from '@/utils/incitefulApi'

vi.mock('@/utils/incitefulApi', () => ({ default: { getPaperIds: vi.fn(), getPaper: vi.fn() } }))
vi.mock('@/utils/openalexApi', () => ({ searchOpenAlex: vi.fn(() => Promise.resolve([])) }))

describe('GraphSearch', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(api.getPaperIds).mockResolvedValue([])
    wrapper = mount(GraphSearch)
  })

  async function type(text: string) {
    await wrapper.find('input[type="text"]').setValue(text)
  }

  async function clickSearch() {
    await wrapper.find('button[aria-label="Search"]').trigger('click')
    await flushPromises()
  }

  it('searches a title with a comma without looking up IDs', async () => {
    await type('Global cancer statistics, 2018'); await clickSearch()
    expect(api.getPaperIds).not.toHaveBeenCalled()
    expect(wrapper.emitted('searched')).toEqual([['Global cancer statistics, 2018']])
  })
  it('looks up a typed number as a PMID', async () => {
    vi.mocked(api.getPaperIds).mockResolvedValue(['W2919115771'])
    await type('26017442'); await clickSearch()
    expect(api.getPaperIds).toHaveBeenCalledWith(['pmid:26017442'])
    expect(wrapper.emitted('selected')).toEqual([[['W2919115771']]])
  })
  it('falls back to search when nothing resolves', async () => {
    await type('99999999'); await clickSearch()
    expect(wrapper.emitted('searched')).toEqual([['99999999']])
  })
})
