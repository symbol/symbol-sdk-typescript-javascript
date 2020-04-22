/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// internal dependencies
import {getComponent} from '@MOCKS/Components'
import WalletStore from '@/store/Wallet'
// @ts-ignore
import WalletSelectorField from '@/components/WalletSelectorField/WalletSelectorField.vue'
import {WalletModel} from '@/core/database/entities/WalletModel'

describe('components/WalletSelectorField', () => {
  describe('getter for property "currentWalletIdentifier" should', () => {
    test('return empty string given no currentWallet and no value', () => {
      // prepare
      const wrapper = getComponent(WalletSelectorField, {wallet: WalletStore}, {
        currentWallet: null,
      })
      const component = (wrapper.vm as WalletSelectorField)

      // act
      const actual = component.currentWalletIdentifier

      // assert
      expect(actual).toBeDefined()
      expect(actual.length).toBe(0)
    })

    test('return wallet identifier given value', () => {
      // prepare
      const wallet = {id: '5678'} as WalletModel
      const wrapper = getComponent(WalletSelectorField, {wallet: WalletStore}, {}, {
        value: wallet.id,
      })
      const component = (wrapper.vm as WalletSelectorField)

      // act
      const actual = component.currentWalletIdentifier

      // assert
      expect(actual).toBeDefined()
      expect(actual.length).toBe(4)
      expect(actual).toBe('5678')
    })
  })

  describe('setter for property "currentWalletIdentifier" should', () => {
    test('do nothing given empty identifier', () => {
      // prepare
      const wrapper = getComponent(WalletSelectorField, {wallet: WalletStore}, {})
      const component = (wrapper.vm as WalletSelectorField)

      // act
      component.currentWalletIdentifier = ''
      expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled()
    })

  })

  describe('getter for property "currentWallets" should', () => {
    test('return empty array given no knownWallets', () => {
      // prepare
      const wrapper = getComponent(WalletSelectorField, {wallet: WalletStore}, {
        knownWallets: [],
      })
      const component = (wrapper.vm as WalletSelectorField)

      // act
      const actual = component.currentWallets

      // assert
      expect(actual).toBeDefined()
      expect(actual.length).toBe(0)
    })
  })
})
