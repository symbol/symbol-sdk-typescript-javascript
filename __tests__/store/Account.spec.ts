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

// MOCKS
class FakeRepository extends AccountsRepository {
  public constructor() {
    super()
    this.setAdapter(getAdapter())
    this.fetch()
  }
}

describe('store/Account ==>', () => {
  describe('action "RESET_STATE" should', () => {
    test('mutate currentAccount and isAuthenticated', () => {
      const commit = jest.fn()
      AccountStore.actions.RESET_STATE({commit})
      expect(commit).toHaveBeenCalledTimes(2)
      expect(commit).toHaveBeenNthCalledWith(1, 'currentAccount', null)
      expect(commit).toHaveBeenNthCalledWith(2, 'setAuthenticated', false)
    })
  })

  describe('action "LOG_OUT" should', () => {
    test('dispatch "RESET_STATE"', () => {
      const dispatch = jest.fn()
      AccountStore.actions.LOG_OUT({dispatch})
      expect(dispatch).toHaveBeenCalled()
      expect(dispatch).toHaveBeenCalledWith('RESET_STATE')
    })
  })

  describe('action "SET_CURRENT_ACCOUNT" should', () => {
    test('dispatch "wallet/uninitialize"', () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AccountStore.actions.SET_CURRENT_ACCOUNT(
        {commit, dispatch},
        getFakeModel('1234')
      )
      expect(dispatch).toHaveBeenNthCalledWith(1, 'wallet/uninitialize', null, {root: true})
    })

    test('mutate currentAccount and isAuthenticated', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const model = getFakeModel('1234')

      await AccountStore.actions.SET_CURRENT_ACCOUNT(
        {commit, dispatch},
        model
      )
      expect(commit).toHaveBeenCalledTimes(2)
      expect(commit).toHaveBeenNthCalledWith(1, 'currentAccount', model)
      expect(commit).toHaveBeenNthCalledWith(2, 'setAuthenticated', true)
    })

    test('dispatch "account/initialize"', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      await AccountStore.actions.SET_CURRENT_ACCOUNT(
        {commit, dispatch},
        getFakeModel('1234')
      )
      expect(dispatch).toHaveBeenNthCalledWith(2, 'initialize')
    })
  })

  describe('action "ADD_WALLET" should', () => {
    test('do nothing given no currentAccount', () => {
      const dispatch = jest.fn()

      // overwrite state for test
      AccountStore.state = Object.assign({}, AccountStore.state, {
        currentAccount: null
      })

      // act
      AccountStore.actions.ADD_WALLET(
        {dispatch, getters: AccountStore.getters, state: AccountStore.state},
        getFakeModel('1234')
      )
      expect(dispatch).not.toHaveBeenCalled()
    })

    test('dispatch "SET_CURRENT_ACCOUNT" given currentAccount', () => {
      const dispatch = jest.fn()
      const account = getFakeModel('1234', [['wallets', []]])
      const wallet = getFakeModel('5678')

      // overwrite state for test
      AccountStore.state = Object.assign({}, AccountStore.state, {
        currentAccount: account
      })

      // act
      AccountStore.actions.ADD_WALLET(
        {dispatch, getters: AccountStore.getters, state: AccountStore.state},
        wallet
      )
      expect(dispatch).toHaveBeenCalled()
      expect(dispatch).toHaveBeenCalledWith('SET_CURRENT_ACCOUNT', account)
    })

    test('update currentAccount wallets', () => {
      const dispatch = jest.fn()
      const account = getFakeModel('1234', [['wallets', []]])
      const wallet = getFakeModel('5678')

      // overwrite state for test
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
