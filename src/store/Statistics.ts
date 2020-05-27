/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { RepositoryFactory, StorageInfo } from 'symbol-sdk'
import Vue from 'vue'
// internal dependencies

export default {
  namespaced: true,
  state: {
    countBlocks: 0,
    countTransactions: 0,
    countAccounts: 0,
    countNodes: 0,
  },
  getters: {
    countBlocks: (state) => state.countBlocks,
    countTransactions: (state) => state.countTransactions,
    countAccounts: (state) => state.countAccounts,
    countNodes: (state) => state.countNodes,
  },
  mutations: {
    countBlocks: (state, cnt) => Vue.set(state, 'countBlocks', cnt),
    countTransactions: (state, cnt) => Vue.set(state, 'countTransactions', cnt),
    countAccounts: (state, cnt) => Vue.set(state, 'countAccounts', cnt),
    countNodes: (state, cnt) => Vue.set(state, 'countNodes', cnt),
  },
  actions: {
    async LOAD({ commit, rootGetters }) {
      commit('countTransactions', 0)
      commit('countBlocks', 0)
      commit('countAccounts', 0)
      commit('countNodes', 0)

      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
      const nodeHttp = repositoryFactory.createNodeRepository()
      const storageInfoPromise = nodeHttp.getStorageInfo().toPromise()
      const nodePeersPromise = nodeHttp.getNodePeers().toPromise()

      const diagnostic: StorageInfo = await storageInfoPromise
      const nodes = await nodePeersPromise

      commit('countTransactions', diagnostic.numTransactions)
      commit('countBlocks', diagnostic.numBlocks)
      commit('countAccounts', diagnostic.numAccounts)
      commit('countNodes', nodes.length)
    },
  },
}
