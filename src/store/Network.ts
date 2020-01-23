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
import Vue from 'vue';
import {NetworkType} from 'nem2-sdk';

// internal dependencies
import {RESTService} from '@/services/RESTService'
import {URLHelpers} from '@/core/utils/URLHelpers';
import {$eventBus} from '../main'
import {AwaitLock} from './AwaitLock';
const Lock = AwaitLock.create();

import networkConfig from '../../config/network.conf.json';

export default {
  namespaced: true,
  state: {
    initialized: false,
    wsEndpoint: '',
    config: networkConfig,
    defaultPeer: URLHelpers.formatUrl(networkConfig.defaultNode.url),
    currentPeer: URLHelpers.formatUrl(networkConfig.defaultNode.url),
    explorerUrl: networkConfig.explorerUrl,
    networkType: NetworkType.MIJIN_TEST,
    isConnected: false,
    nemesisTransactions: [],
  },
  getters: {
    getInitialized: state => state.initialized,
    wsEndpoint: state => state.wsEndpoint,
    networkType: state => state.networkType,
    currentPeer: state => state.currentPeer,
    explorerUrl: state => state.explorerUrl,
    isConnected: state => state.isConnected,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setConnected: (state, connected) => { state.isConnected = connected },
    currentPeer: (state, payload) => {
      if (undefined !== payload) {
        let currentPeer = URLHelpers.formatUrl(payload)
        let wsEndpoint = URLHelpers.httpToWsUrl(currentPeer.url)
        Vue.set(state, 'currentPeer', currentPeer)
        Vue.set(state, 'wsEndpoint', wsEndpoint)
      }
    },
    networkType: (state, type) => {
      switch (type) {
        case NetworkType.MIJIN_TEST:
        case NetworkType.MIJIN:
        case NetworkType.TEST_NET:
        case NetworkType.MAIN_NET:
          Vue.set(state, 'networkType', type)
          break;

        default:
          Vue.set(state, 'networkType', NetworkType.MIJIN_TEST)
          break;
      }
    },
    setNemesisTransactions: (state, transactions) => Vue.set(state, 'nemesisTransactions', transactions),
  },
  actions: {
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        const nodeUrl = getters.currentPeer.url
        try {
          // read network type ("connect")
          const networkHttp = RESTService.create('NetworkHttp', nodeUrl)
          const networkType = await networkHttp.getNetworkType().toPromise()

          // update connection state
          commit('setConnected', true)
          $eventBus.$emit('newConnection', nodeUrl);

          // update store
          commit('networkType', networkType)
          commit('setInitialized', true)
        }
        catch (e) {
          console.log("Error in Store network/initialize: ", e)
        }
      }

      // aquire async lock until initialized
      await Lock.initialize(callback, {commit, dispatch, getters})
    },
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => {
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {commit, dispatch, getters})
    },
/// region scoped actions
    async SET_CURRENT_PEER({ commit, dispatch }, currentPeerUrl) {
      if (!URLHelpers.isValidURL(currentPeerUrl)) {
        throw Error('Cannot change node. URL is not valid: ' + currentPeerUrl)
      }

      // update state pre-connection
      commit('currentPeer', currentPeerUrl)
      commit('setConnected', false)
      commit('setInitialized', false)

      // reset store + re-initialize
      await dispatch('uninitialize', null, {root: true})
      await dispatch('initialize')
    },
/// end-region scoped actions
  }
};
