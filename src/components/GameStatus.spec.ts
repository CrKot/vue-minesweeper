import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GameStatus from './GameStatus.vue'

describe('GameStatus', () => {
  it('renders flags, time and current status emoji', () => {
    const wrapper = mount(GameStatus, {
      props: {
        status: 'won',
        flagsLeft: 7,
        time: 42,
      },
    })

    expect(wrapper.text()).toContain('7')
    expect(wrapper.text()).toContain('42')
    expect(wrapper.text()).toContain('😎')
    expect(wrapper.find('.status-bar').attributes('aria-live')).toBe('polite')
  })

  it('updates status emoji when status changes', async () => {
    const wrapper = mount(GameStatus, {
      props: {
        status: 'playing',
        flagsLeft: 10,
        time: 0,
      },
    })

    await wrapper.setProps({ status: 'lost' })

    expect(wrapper.find('.emoji').text()).toBe('😵')
    expect(wrapper.find('.emoji').attributes('aria-label')).toContain('lost')
  })
})
