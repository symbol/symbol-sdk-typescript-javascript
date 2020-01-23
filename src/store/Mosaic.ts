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
import {MosaicId, MosaicInfo, NamespaceId, QueryParams, Transaction, TransactionType} from 'nem2-sdk'
import Vue from 'vue'

// internal dependencies
import {RESTService} from '@/services/RESTService'
import {AwaitLock} from './AwaitLock';
const Lock = AwaitLock.create();

// configuration
import networkConfig from '@/../config/network.conf.json'
const networkCurrencyName = networkConfig.networks['testnet-publicTest'].currencyMosaic

export default {
  namespaced: true,
  state: {
    initialized: false,
    networkMosaicId: null,
    networkMosaicName: '',
    nemesisTransactions: [],
    mosaicsInfoByHex: {},
  },
  getters: {
    getInitialized: state => state.initialized,
    networkMosaic: state => state.networkMosaicId,
    nemesisTransactions: state => state.nemesisTransactions,
    mosaicsInfo: state => state.mosaicsInfoByHex,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setNetworkMosaicId: (state, mosaic) => Vue.set(state, 'networkMosaicId', mosaic),
    setNetworkMosaicName: (state, name) => Vue.set(state, 'networkMosaicName', name),
    setNemesisTransactions: (state, transactions) => Vue.set(state, 'nemesisTransactions', transactions),
    addMosaicInfo: (state, mosaicInfo: MosaicInfo) => {
      let info = state.mosaicsInfoByHex
      let hex = info.id.toHex()

      // register mosaic info
      info[hex] = mosaicInfo
      Vue.set(state, 'mosaicsInfoByHex', info)
    }
  },
  actions: {
    async initialize({ commit, dispatch, getters, rootGetters }) {
      const callback = async () => {
        // read first network block to identify currency mosaic
        const nodeUrl = rootGetters['network/currentPeer'].url
        const blockHttp = RESTService.create('BlockHttp', nodeUrl)
        blockHttp.getBlockTransactions('1', new QueryParams(100)).subscribe(
          (transactions: Transaction[]) => {
            dispatch('SET_NEMESIS_TRANSACTIONS', transactions)
          })

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
    SET_NEMESIS_TRANSACTIONS({commit, dispatch}, transactions) {
      // - read first root namespace
      const rootNamespaceTx = transactions.filter(
        tx => tx.type === TransactionType.REGISTER_NAMESPACE).shift()

      // - read sub namespace
      const subNamespaceTx = transactions.filter(
        tx => tx.type === TransactionType.REGISTER_NAMESPACE 
           && tx.parentId === rootNamespaceTx.namespaceId).shift()

      // - read alias
      const aliasTx = transactions.filter(
        tx => tx.type === TransactionType.MOSAIC_ALIAS 
           && tx.namespaceId.equals(subNamespaceTx.namespaceId)).shift()

      // - build network mosaic name
      const mosaicName = [
        rootNamespaceTx.namespaceName,
        subNamespaceTx.namespaceName,
      ].join('.')

      commit('setNetworkMosaicName', mosaicName)
      commit('setNetworkMosaicId', aliasTx.mosaicId)
      dispatch('REST_FETCH_INFOS', [aliasTx.mosaicId])
    },
    async REST_FETCH_INFO({commit, rootGetters}, mosaicId) {
      const nodeUrl = rootGetters['network/currentPeer'].url
      const mosaicHttp = RESTService.create('MosaicHttp', nodeUrl)
      const mosaicInfo = await mosaicHttp.getMosaic(mosaicId).toPromise()

      commit('addMosaicInfo', mosaicInfo)
      return mosaicInfo
    },
    async REST_FETCH_INFOS({commit, rootGetters}, mosaicIds) {
      const nodeUrl = rootGetters['network/currentPeer'].url
      const mosaicHttp = RESTService.create('MosaicHttp', nodeUrl)
      const mosaicsInfo = await mosaicHttp.getMosaics(mosaicIds).toPromise()
      
      mosaicsInfo.map(info => commit('addMosaicInfo', info))
      return mosaicsInfo
    }
/// end-region scoped actions
  }
}
