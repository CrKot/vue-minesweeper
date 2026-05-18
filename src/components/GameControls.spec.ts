import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GameControls from './GameControls.vue'

describe('GameControls', () => {
  it('marks the current difficulty as active', () => {
    const wrapper = mount(GameControls, {
      props: {
        difficulty: 'medium',
      },
    })

    expect(wrapper.find('button.active').text()).toBe('Средний')
  })

  it('emits selected difficulty', async () => {
    const wrapper = mount(GameControls, {
      props: {
        difficulty: 'easy',
      },
    })

    await wrapper.findAll('button').find((button) => button.text() === 'Сложный')?.trigger('click')

    expect(wrapper.emitted('change-difficulty')).toEqual([['hard']])
  })

  it('emits reset on new game click', async () => {
    const wrapper = mount(GameControls, {
      props: {
        difficulty: 'easy',
      },
    })

    await wrapper.find('.reset-btn').trigger('click')

    expect(wrapper.emitted('reset')).toHaveLength(1)
  })
})
