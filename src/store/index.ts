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
import Vuex from 'vuex'
import AppInfoStore from '@/store/AppInfo'
import DatabaseStore from '@/store/Database'
import NetworkStore from '@/store/Network'
import AccountStore from '@/store/Account'
import WalletStore from '@/store/Wallet'
import DiagnosticStore from '@/store/Diagnostic'
import NotificationStore from '@/store/Notification'
import TemporaryStore from '@/store/Temporary'
import MosaicStore from '@/store/Mosaic'
import NamespaceStore from '@/store/Namespace'
import StatisticsStore from '@/store/Statistics'
import CommunityStore from '@/store/Community'
import {onPeerConnection} from '@/store/plugins/onPeerConnection'

// use AwaitLock for initialization routines
import {AwaitLock} from '@/store/AwaitLock'
const Lock = AwaitLock.create()

Vue.use(Vuex)

/**
 * Application Store
 * 
 * This store initializes peer connection
 */
const AppStore = new Vuex.Store({
  strict: false,
  modules: {
    app: AppInfoStore,
    db: DatabaseStore,
    network: NetworkStore,
    account: AccountStore,
    wallet: WalletStore,
    diagnostic: DiagnosticStore,
    notification: NotificationStore,
    temporary: TemporaryStore,
    mosaic: MosaicStore,
    namespace: NamespaceStore,
    statistics: StatisticsStore,
    community: CommunityStore,
  },
  plugins: [
    onPeerConnection,
  ],
  actions: {
    async initialize({ dispatch, getters }) {
      const callback = async () => {
        await dispatch('app/initialize')
        await dispatch('db/initialize')
        await dispatch('diagnostic/initialize')
        await dispatch('notification/initialize')
        await dispatch('network/initialize', getters['db/feed'])
        await dispatch('mosaic/initialize', getters['db/feed'])
        await dispatch('namespace/initialize', getters['db/feed'])
      }

      // aquire async lock until initialized
      await Lock.initialize(callback, {getters})
    },
    // Uninitialize the stores (call on app destroyed).
    async uninitialize({ dispatch }) {
      await Promise.all([
        dispatch('app/uninitialize'),
        dispatch('network/uninitialize'),
        dispatch('mosaic/uninitialize'),
        dispatch('account/uninitialize'),
        dispatch('wallet/uninitialize'),
        dispatch('namespace/uninitialize'),
        dispatch('notification/uninitialize'),
        dispatch('temporary/uninitialize'),
        dispatch('diagnostic/uninitialize'),
      ])
    },
  },
})

export default AppStore
