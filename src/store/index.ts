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
import AccountStore from '@/store/Account'
import NetworkStore from '@/store/Network'
import AppInfoStore from '@/store/AppInfo'

// use AwaitLock for initialization routines
import {AwaitLock} from '@/store/AwaitLock'
const Lock = AwaitLock.create();

Vue.use(Vuex);

export default new Vuex.Store({
  strict: false,
  modules: {
    app: AppInfoStore,
    network: NetworkStore,
    account: AccountStore,
  },
  actions: {
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        await dispatch('network/initialize')
        await dispatch('chain/initialize')
      }
      await Lock.initialize(callback, {commit, dispatch, getters})
    },
    // Uninitialize the stores (call on app destroyed).
    async uninitialize({ dispatch }) {
      await Promise.all([
        dispatch('network/uninitialize'),
        dispatch('account/uninitialize'),
        dispatch('wallet/uninitialize'),
      ])
    }
  }
});
