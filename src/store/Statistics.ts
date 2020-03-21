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
import {RepositoryFactory, StorageInfo} from 'symbol-sdk'
import Vue from 'vue'
import axios from 'axios'
// internal dependencies
import {AwaitLock} from './AwaitLock';

const Lock = AwaitLock.create();

/// region protected helpers
/**
 * Request REST data
 * @internal
 * @return {Promise<any[]>}
 */
const REST_request = async (queryUrl: string): Promise<any[]> => {
  // execute request
  try {
    const response = await axios.get(queryUrl, { params: {pageSize: 100} })
    if (response.status !== 200) {
      return []
    }

    const items = JSON.parse(response.data)
    return items
  }
  catch(e) { return [] }
}
/// end-region protected helpers

export default {
  namespaced: true,
  state: {
    initialized: false,
    countBlocks: 0,
    countTransactions: 0,
    countAccounts: 0,
    countNodes: 0,
  },
  getters: {
    getInitialized: state => state.initialized,
    countBlocks: state => state.countBlocks,
    countTransactions: state => state.countTransactions,
    countAccounts: state => state.countAccounts,
    countNodes: state => state.countNodes,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    countBlocks: (state, cnt) => Vue.set(state, 'countBlocks', cnt),
    countTransactions: (state, cnt) => Vue.set(state, 'countTransactions', cnt),
    countAccounts: (state, cnt) => Vue.set(state, 'countAccounts', cnt),
    countNodes: (state, cnt) => Vue.set(state, 'countNodes', cnt),
  },
  actions: {
    async initialize({ commit, dispatch, getters, rootGetters }) {
      const callback = async () => {
        const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory;
        const nodeHttp = repositoryFactory.createNodeRepository();
        const diagnostic: StorageInfo = await nodeHttp.getStorageInfo().toPromise()

        commit('countTransactions', diagnostic.numTransactions)
        commit('countBlocks', diagnostic.numBlocks)
        commit('countAccounts', diagnostic.numAccounts)
        
        // - fetch nodes (not yet in SDK)
        const nodes = await nodeHttp.getNodePeers().toPromise()
        commit('countNodes', nodes.length)

        // update store
        commit('setInitialized', true)
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

/// end-region scoped actions
  }
}
