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
import {getFakeModel, getAdapter} from '@MOCKS/Database'
import {getComponent} from '@MOCKS/Components'
import WalletStore from '@/store/Wallet'

// @ts-ignore
import WalletSelectorField from '@/components/WalletSelectorField/WalletSelectorField.vue'
import {WalletService} from '@/services/WalletService'

describe('store/WalletSelectorField ==>', () => {
  describe('getter for property "currentWalletIdentifier" should', () => {
    test('return empty string given no currentWallet', () => {
      // prepare
      const wrapper = getComponent(WalletSelectorField, {wallet: WalletStore}, {
        currentWallet: null
      })
      const component = (wrapper.vm as WalletSelectorField)

      // act
      const actual = component.currentWalletIdentifier

      // assert
      expect(actual).toBeDefined()
      expect(actual.length).toBe(0)
    })

    test('return wallet identifier given currentWallet', () => {
      // prepare
      const wallet = getFakeModel('5678')
      const wrapper = getComponent(WalletSelectorField, {wallet: WalletStore}, {
        currentWallet: wallet
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

    test('dispatch "notification/ADD_ERROR" given invalid identifier', () => {
      // prepare
      const wrapper = getComponent(WalletSelectorField, {wallet: WalletStore}, {})
      const service = new WalletService(wrapper.vm.$store, getAdapter())
      const component = (wrapper.vm as WalletSelectorField)
      component.service = service

      // act
      component.currentWalletIdentifier = '1234' // wallet identifier does not exist
      expect(component.$store.dispatch).toHaveBeenCalledWith(
        'notification/ADD_ERROR',
        'Wallet with identifier \'1234\' does not exist.'
      )
    })

    test('dispatch "SET_CURRENT_WALLET" given valid identifier', () => {
      // prepare
      const wallet = getFakeModel('abcd', [
        ['name', 'w_one'],
        ['address', 'w_addr'],
      ])
      const wrapper = getComponent(WalletSelectorField, {wallet: WalletStore}, {})
      const service = new WalletService(wrapper.vm.$store, getAdapter())
      const component = (wrapper.vm as WalletSelectorField)
      component.service = service

      // act
      component.currentWalletIdentifier = 'abcd'

      // assert
      expect(component.$store.dispatch).toHaveBeenCalledWith(
        'wallet/SET_CURRENT_WALLET',
        wallet
      )
      expect(wrapper.emitted().change).toBeTruthy()
      expect(wrapper.emitted().change.length).toBe(1)
      expect(wrapper.emitted().change[0]).toEqual(['abcd'])
    })
  })

  describe('getter for property "currentWallets" should', () => {
    test('return empty array given no knownWallets', () => {
      // prepare
      const wrapper = getComponent(WalletSelectorField, {wallet: WalletStore}, {
        knownWallets: []
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
