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
import {AwaitLock} from './AwaitLock'
import {MosaicService} from '@/services/MosaicService'
import {NamespaceService} from '@/services/NamespaceService'
import {AccountService} from '@/services/AccountService'
import {WalletService} from '@/services/WalletService'
import {SettingService} from '@/services/SettingService'
import {PeerService} from '@/services/PeerService'

/// region globals
const Lock = AwaitLock.create()
const mosaicService = new MosaicService()
const namespaceService = new NamespaceService()
const accountService = new AccountService()
const walletService = new WalletService()
const settingService = new SettingService()
const peerService = new PeerService()
/// end-region globals

export default {
  namespaced: true,
  state: {
    initialized: false,
    hasFeed: false,
    dataFeed: {
      accounts: [],
      mosaics: [],
      namespaces: [],
      wallets: [],
      settings: [],
      endpoints: [],
    },
  },
  getters: {
    getInitialized: state => state.initialized,
    hasFeed: state => state.canFeed,
    feed: state => state.dataFeed,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setHasFeed: (state, f) => Vue.set(state, 'hasFeed', f),
    setFeed: (state, feed) => Vue.set(state, 'dataFeed', feed),
  },
  actions: {
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        // - synchronize database data
        await dispatch('SYNCHRONIZE')
        commit('setInitialized', true)
      }

      // aquire async lock until initialized
      await Lock.initialize(callback, {getters})
    },
    async uninitialize({ commit, getters }) {
      const callback = async () => {
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {getters})
    },
    async SYNCHRONIZE({commit}) {
      // - sync with database (this will run migrations if needed)
      const accounts = accountService.getAccounts()
      const mosaics = mosaicService.getMosaics()
      const namespaces = namespaceService.getNamespaces()
      const wallets = walletService.getWallets()
      const settings = settingService.allSettings()
      const endpoints = peerService.getEndpoints()

      commit('setHasFeed', accounts && accounts.length > 0)
      commit('setFeed', {
        accounts,
        mosaics,
        namespaces,
        wallets,
        endpoints,
        settings,
      })
    },
    /// region scoped actions
    /// end-region scoped actions
  },
}
