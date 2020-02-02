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
import {FakeModel, getAdapter, getFakeModel} from '@MOCKS/Database'
import AccountStore from '@/store/Account'
import {AccountsRepository} from '@/repositories/AccountsRepository'

describe('store/Account ==>', () => {
  describe('action "RESET_STATE" should', () => {
    test('mutate currentAccount and isAuthenticated', () => {
      // prepare
      const commit = jest.fn()

      // act
      AccountStore.actions.RESET_STATE({commit})

      // assert
      expect(commit).toHaveBeenCalledTimes(2)
      expect(commit).toHaveBeenNthCalledWith(1, 'currentAccount', null)
      expect(commit).toHaveBeenNthCalledWith(2, 'setAuthenticated', false)
    })
  })

  describe('action "LOG_OUT" should', () => {
    test('dispatch "RESET_STATE"', () => {
      // prepare
      const dispatch = jest.fn()

      // act
      AccountStore.actions.LOG_OUT({dispatch})

      // assert
      expect(dispatch).toHaveBeenCalled()
      expect(dispatch).toHaveBeenCalledWith('RESET_STATE')
    })
  })

  describe('action "SET_CURRENT_ACCOUNT" should', () => {
    test('dispatch "wallet/uninitialize"', () => {
      // prepare
      const commit = jest.fn()
      const dispatch = jest.fn()

      // act
      AccountStore.actions.SET_CURRENT_ACCOUNT(
        {commit, dispatch},
        getFakeModel('1234')
      )

      // assert
      expect(dispatch).toHaveBeenNthCalledWith(1, 'wallet/uninitialize', null, {root: true})
    })

    test('mutate currentAccount and isAuthenticated', async () => {
      // prepare
      const commit = jest.fn()
      const dispatch = jest.fn()
      const model = getFakeModel('1234')

      // act
      await AccountStore.actions.SET_CURRENT_ACCOUNT(
        {commit, dispatch},
        model
      )

      // assert
      expect(commit).toHaveBeenCalledTimes(2)
      expect(commit).toHaveBeenNthCalledWith(1, 'currentAccount', model)
      expect(commit).toHaveBeenNthCalledWith(2, 'setAuthenticated', true)
    })

    test('dispatch "account/initialize"', async () => {
      // prepare
      const commit = jest.fn()
      const dispatch = jest.fn()

      // act
      await AccountStore.actions.SET_CURRENT_ACCOUNT(
        {commit, dispatch},
        getFakeModel('1234')
      )

      // assert
      expect(dispatch).toHaveBeenNthCalledWith(2, 'initialize')
    })
  })

  describe('action "ADD_WALLET" should', () => {
    test('do nothing given no currentAccount', () => {
      // prepare
      const dispatch = jest.fn()
      AccountStore.state = Object.assign({}, AccountStore.state, {
        currentAccount: null
      })

      // act
      AccountStore.actions.ADD_WALLET(
        {dispatch, getters: AccountStore.getters, state: AccountStore.state},
        getFakeModel('1234')
      )

      // assert
      expect(dispatch).not.toHaveBeenCalled()
    })

    test('dispatch "SET_CURRENT_ACCOUNT" given currentAccount', () => {
      // prepare
      const dispatch = jest.fn()
      const account = getFakeModel('1234', [['wallets', []]])
      const wallet = getFakeModel('5678')
      AccountStore.state = Object.assign({}, AccountStore.state, {
        currentAccount: account
      })

      // act
      AccountStore.actions.ADD_WALLET(
        {dispatch, getters: AccountStore.getters, state: AccountStore.state},
        wallet
      )

      // assert
      expect(dispatch).toHaveBeenCalled()
      expect(dispatch).toHaveBeenCalledWith('SET_CURRENT_ACCOUNT', account)
    })

    test('update currentAccount wallets', () => {
      // prepare
      const dispatch = jest.fn()
      const account = getFakeModel('1234', [['wallets', []]])
      const wallet = getFakeModel('5678')
      AccountStore.state = Object.assign({}, AccountStore.state, {
        currentAccount: account
      })

      // act
      AccountStore.actions.ADD_WALLET(
        {dispatch, getters: AccountStore.getters, state: AccountStore.state},
        wallet
      )

      // assert
      const actualWallets = AccountStore.state.currentAccount.values.get('wallets')
      expect(actualWallets.length).toBe(1)
      expect(actualWallets).toMatchObject(['5678'])
    })
  })
})
