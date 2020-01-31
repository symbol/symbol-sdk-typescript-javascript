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
import {$eventBus} from '../main'
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {WalletsRepository} from '@/repositories/WalletsRepository'
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {AwaitLock} from './AwaitLock';

/// region globals
const Lock = AwaitLock.create();
const accountsRepository = new AccountsRepository()
const walletsRepository = new WalletsRepository()
/// end-region globals

/**
 * Internal helper used to maintain updated snapshot
 * of database storage backend.
 * @return {void}
 */
const fetchDatabase = () => {
  accountsRepository.fetch()
  walletsRepository.fetch()
}

export default {
  namespaced: true,
  state: {
    initialized: false,
    currentAccount: null,
    isAuthenticated: false,
  },
  getters: {
    getInitialized: state => state.initialized,
    currentAccount: state => state.currentAccount,
    isAuthenticated: state => state.isAuthenticated,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    currentAccount: (state, accountModel) => Vue.set(state, 'currentAccount', accountModel),
    setAuthenticated: (state, authState) => Vue.set(state, 'isAuthenticated', authState === true),
  },
  actions: {
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        commit('setInitialized', true)
      }

      // aquire async lock until initialized
      await Lock.initialize(callback, {commit, dispatch, getters})
    },
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => {
        await dispatch('RESET_STATE')
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {commit, dispatch, getters})
    },
/// region scoped actions
    RESET_STATE({commit}) {
      commit('currentAccount', null)
      commit('setAuthenticated', false)
    },
    LOG_OUT({dispatch}) {
      return dispatch('RESET_STATE')
    },
    async SET_CURRENT_ACCOUNT({commit, dispatch}, accountName) {
      fetchDatabase()

      // validate account exists
      const currentAccount = accountsRepository.read(accountName)

      // changing active account, must unitialize wallet!
      await dispatch('wallet/uninitialize', null, {root: true})

      // update state
      commit('currentAccount', currentAccount)
      commit('setAuthenticated', true)

      // set knownWallets
      const knownWallets = accountsRepository.fetchRelations(walletsRepository, currentAccount, 'wallets')
      if (knownWallets.size) {
        const known = Array.from(knownWallets.values())
        const firstWalletId = known.shift().getIdentifier()
        dispatch('wallet/SET_CURRENT_WALLET', firstWalletId, {root: true})
        dispatch('wallet/SET_KNOWN_WALLETS', known, {root: true})
      }

      // reset store + re-initialize
      await dispatch('initialize')
      $eventBus.$emit('onAccountChange', accountName)
    },
    ADD_WALLET({commit, dispatch, getters}, walletId) {
      fetchDatabase()

      const currentAccount = getters['currentAccount']
      if (! currentAccount) {
        return
      }

      // validate wallet exists
      const wallet = walletsRepository.read(walletId)
      const wallets = currentAccount.values.get("wallets")
      wallets.push(wallet.getIdentifier())

      // update account and return
      currentAccount.values.set("wallets", wallets)
      accountsRepository.update(currentAccount.getIdentifier(), currentAccount.values)

      return dispatch('SET_CURRENT_ACCOUNT', currentAccount.getIdentifier())
    }
/// end-region scoped actions
  }
}
