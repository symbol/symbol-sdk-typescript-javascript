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
import { shallowMount } from '@vue/test-utils'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow'

describe('FormRow', () => {
  test('default slot should be load', () => {
    const defaultSlot = '<div>this is a test label</div>'
    const wrapper = shallowMount(FormRow, {
      slots: {
        label: defaultSlot,
      },
    })
    expect(wrapper.vm.$el.textContent).toMatch('this is a test label')
    wrapper.destroy()
  })

  test('inputs slot should be laod', () => {
    const inputs = '<input type="text" name="name" value ="1" />'
    const wrapper = shallowMount(FormRow, {
      propsData: {
        whitelisted: true,
      },
      slots: {
        inputs: inputs,
      },
    })
    expect(wrapper.vm.$el.querySelector('input').value).toBe('1')
    wrapper.destroy()
  })
})
