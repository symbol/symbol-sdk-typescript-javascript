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
import Vue from 'vue'
// internal dependencies
import {$eventBus} from '../events'
import {AwaitLock} from './AwaitLock'
import {SettingService} from '@/services/SettingService'
import {AccountModel} from '@/core/database/entities/AccountModel'
import {WalletModel} from '@/core/database/entities/WalletModel'
import {AccountService} from '@/services/AccountService'

/// region globals
const Lock = AwaitLock.create()

/// end-region globals

interface AccountState {
  initialized: boolean
  currentAccount: AccountModel
  isAuthenticated: boolean
}

const accountState: AccountState = {
  initialized: false,
  currentAccount: null,
  isAuthenticated: false,
}
export default {
  namespaced: true,
  state: accountState,
  getters: {
    getInitialized: (state: AccountState) => state.initialized,
    currentAccount: (state: AccountState) => state.currentAccount,
    isAuthenticated: (state: AccountState) => state.isAuthenticated,
  },
  mutations: {
    setInitialized: (state: AccountState, initialized: boolean) => { state.initialized = initialized },
    currentAccount: (state: AccountState, currentAccount: AccountModel) => Vue.set(state,
      'currentAccount', currentAccount),
    setAuthenticated: (state: AccountState, isAuthenticated: boolean) => Vue.set(state,
      'isAuthenticated', isAuthenticated),
  },
  actions: {
    async initialize({commit, getters}) {
      const callback = async () => {
        commit('setInitialized', true)
      }

      // aquire async lock until initialized
      await Lock.initialize(callback, {getters})
    },
    async uninitialize({commit, dispatch, getters}) {
      const callback = async () => {
        await dispatch('RESET_STATE')
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {getters})
    },
    /// region scoped actions
    RESET_STATE({commit}) {
      commit('currentAccount', null)
      commit('setAuthenticated', false)
    },
    async LOG_OUT({dispatch, rootGetters}): Promise<void> {
      const currentWallet = rootGetters['wallet/currentWallet']
      await dispatch('wallet/uninitialize', {address: currentWallet.address}, {root: true})
      await dispatch('wallet/SET_KNOWN_WALLETS', [], {root: true})
      await dispatch('wallet/RESET_CURRENT_WALLET', undefined, {root: true})
      await dispatch('RESET_STATE')
    },
    async SET_CURRENT_ACCOUNT({commit, dispatch}, currentAccount: AccountModel) {

      // update state
      commit('currentAccount', currentAccount)
      commit('setAuthenticated', true)

      dispatch('diagnostic/ADD_DEBUG', 'Changing current account to ' + currentAccount.accountName,
        {root: true})

      const settings = new SettingService().getAccountSettings(currentAccount.accountName)
      dispatch('app/SET_SETTINGS', settings, {root: true})

      dispatch('diagnostic/ADD_DEBUG', 'Using account settings ' + Object.values(settings),
        {root: true})

      // reset store + re-initialize
      await dispatch('initialize')
      $eventBus.$emit('onAccountChange', currentAccount.accountName)
    },

    ADD_WALLET({dispatch, getters}, walletModel: WalletModel) {
      const currentAccount: AccountModel = getters['currentAccount']
      if (!currentAccount) {
        return
      }
      dispatch('diagnostic/ADD_DEBUG',
        'Adding wallet to account: ' + currentAccount.accountName + ' with: ' + walletModel.address,
        {root: true})
      if (!currentAccount.wallets.includes(walletModel.id)) {
        new AccountService().updateWallets(currentAccount,
          [ ...currentAccount.wallets, walletModel.id ])
      }
      return dispatch('SET_CURRENT_ACCOUNT', currentAccount)
    },
    /// end-region scoped actions
  },
}
