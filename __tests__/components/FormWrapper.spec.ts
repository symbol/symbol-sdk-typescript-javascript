/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import i18n from 'vue-i18n'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper'
// @ts-ignore
import DisabledFormOverlay from '@/components/DisabledFormOverlay/DisabledFormOverlay'
const localVue = createLocalVue()
localVue.use(i18n)

describe('FormWrapper', () => {
  test('default slot should be load', () => {
    const defaultSlot = '<div>this is a test slot</div>'
    const wrapper = shallowMount(FormWrapper, {
      slots: {
        default: defaultSlot,
      },
    })
    expect(wrapper.vm.$el.textContent).toMatch('this is a test slot')
    wrapper.destroy()
  })

  test('DisabledFormOverlay should be laod when whitelisted is true', () => {
    const wrapper = shallowMount(FormWrapper, {
      localVue,
      propsData: {
        whitelisted: true,
      },
      slots: {
        DisabledFormOverlay,
      },
    })
    expect(wrapper.find('whitelisted').selector).toBe('whitelisted')
    wrapper.destroy()
  })
})
