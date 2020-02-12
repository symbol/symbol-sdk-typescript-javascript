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
import {MosaicId, MosaicInfo, NamespaceId, QueryParams, Transaction, TransactionType, NamespaceRegistrationType} from 'nem2-sdk'
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
    networkMosaicTicker: '',
    nemesisTransactions: [],
    mosaicsInfoByHex: {},
    mosaicsNamesByHex: {},
    hiddenMosaics: [],
  },
  getters: {
    getInitialized: state => state.initialized,
    networkMosaic: state => state.networkMosaicId,
    networkMosaicTicker: state => state.networkMosaicTicker,
    nemesisTransactions: state => state.nemesisTransactions,
    mosaicsInfo: state => state.mosaicsInfoByHex,
    mosaicsInfoList: state => Object.keys(state.mosaicsInfoByHex).map(hex => state.mosaicsInfoByHex[hex]),
    mosaicsNames: state => state.mosaicsNamesByHex,
    hiddenMosaics: state => state.hiddenMosaics,
    networkMosaicName: state => state.networkMosaicName,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setNetworkMosaicId: (state, mosaic) => Vue.set(state, 'networkMosaicId', mosaic),
    setNetworkMosaicName: (state, name) => Vue.set(state, 'networkMosaicName', name),
    setNetworkMosaicTicker: (state, ticker) => Vue.set(state, 'networkMosaicTicker', ticker),
    setNemesisTransactions: (state, transactions) => Vue.set(state, 'nemesisTransactions', transactions),
    addMosaicInfo: (state, mosaicInfo: MosaicInfo) => {
      let info = state.mosaicsInfoByHex
      let hex = mosaicInfo.id.toHex()

      // register mosaic info
      info[hex] = mosaicInfo
      Vue.set(state, 'mosaicsInfoByHex', info)
    },
    addMosaicName: (state, payload: {hex: string, name: string}) => {
      let names = state.mosaicsNamesByHex
      let hex = payload.hex

      // register mosaic name
      names[hex] = payload.name
      Vue.set(state, 'mosaicsNamesByHex', names)
    },
    hideMosaic: (state, mosaicId) => {
      const hiddenMosaics = state.hiddenMosaics
      const iter = hiddenMosaics.findIndex(mosaicId.toHex())
      if (iter !== undefined) {
        return
      }

      hiddenMosaics.push(mosaicId.toHex())
      Vue.set(state, 'hiddenMosaics', hiddenMosaics)
    },
    showMosaic: (state, mosaicId) => {
      const hiddenMosaics = state.hiddenMosaics
      const iter = hiddenMosaics.findIndex(mosaicId.toHex())
      if (iter === undefined) {
        return
      }

      delete hiddenMosaics[iter]
      Vue.set(state, 'hiddenMosaics', hiddenMosaics)
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
    HIDE_MOSAIC({commit}, mosaicId) {
      commit('hideMosaic', mosaicId)
    },
    SHOW_MOSAIC({commit}, mosaicId) {
      commit('showMosaic', mosaicId)
    },
    SET_NEMESIS_TRANSACTIONS({commit, dispatch}, transactions) {
      // - read first root namespace
      const rootNamespaceTx = transactions.filter(
        tx => tx.type === TransactionType.REGISTER_NAMESPACE
           && tx.registrationType === NamespaceRegistrationType.RootNamespace).shift()

      // - read sub namespace
      const subNamespaceTx = transactions.filter(
        tx => tx.type === TransactionType.REGISTER_NAMESPACE 
           && tx.registrationType === NamespaceRegistrationType.SubNamespace
           && tx.parentId.equals(rootNamespaceTx.namespaceId)).shift()

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
      commit('setNetworkMosaicTicker', subNamespaceTx.namespaceName.toUpperCase())
      commit('addMosaicName', {hex: aliasTx.mosaicId.toHex(), name: mosaicName})
      dispatch('REST_FETCH_INFO', aliasTx.mosaicId)
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
    },
    async REST_FETCH_NAMES({commit, rootGetters}, mosaicIds): Promise<{hex: string, name: string}[]> {
      const nodeUrl = rootGetters['network/currentPeer'].url
      const namespaceHttp = RESTService.create('NamespaceHttp', nodeUrl)
      const mosaicNames = await namespaceHttp.getMosaicsNames(mosaicIds).toPromise()

      // map by hex if names available
      const mappedNames = mosaicNames
        .filter(({names}) => names.length)
        .map(({mosaicId, names}) => ({hex: mosaicId.toHex(), name: names.shift().name}))

      // update store
      mappedNames.forEach(mappedEntry => commit('addMosaicName', mappedEntry))

      return mappedNames
    },
/// end-region scoped actions
  },
}
