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
// internal dependencies
import { getComponent } from '@MOCKS/Components'
import AccountStore from '@/store/Account'
// @ts-ignore
import AccountSelectorField from '@/components/AccountSelectorField/AccountSelectorField.vue'
import { AccountModel } from '@/core/database/entities/AccountModel'

describe('components/AccountSelectorField', () => {
  describe('getter for property "currentAccountIdentifier" should', () => {
    test('return empty string given no currentAccount and no value', () => {
      // prepare
      const wrapper = getComponent(
        AccountSelectorField,
        { account: AccountStore },
        {
          currentAccount: null,
        },
      )
      const component = wrapper.vm as AccountSelectorField

      // act
      const actual = component.currentAccountIdentifier

      // assert
      expect(actual).toBeDefined()
      expect(actual.length).toBe(0)
    })

    test('return account identifier given value', () => {
      // prepare
      const account = { id: '5678' } as AccountModel
      const wrapper = getComponent(
        AccountSelectorField,
        { account: AccountStore },
        {},
        {
          value: account.id,
        },
      )
      const component = wrapper.vm as AccountSelectorField

      // act
      const actual = component.currentAccountIdentifier

      // assert
      expect(actual).toBeDefined()
      expect(actual.length).toBe(4)
      expect(actual).toBe('5678')
    })
  })

  describe('setter for property "currentAccountIdentifier" should', () => {
    test('do nothing given empty identifier', () => {
      // prepare
      const wrapper = getComponent(AccountSelectorField, { account: AccountStore }, {})
      const component = wrapper.vm as AccountSelectorField

      // act
      component.currentAccountIdentifier = ''
      expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled()
    })
  })

  describe('getter for property "currentAccounts" should', () => {
    test('return empty array given no knownAccounts', () => {
      // prepare
      const wrapper = getComponent(
        AccountSelectorField,
        { account: AccountStore },
        {
          knownAccounts: [],
        },
      )
      const component = wrapper.vm as AccountSelectorField

      // act
      const actual = component.currentAccounts

      // assert
      expect(actual).toBeDefined()
      expect(actual.length).toBe(0)
    })
  })
})
