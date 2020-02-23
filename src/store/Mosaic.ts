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
import {MosaicInfo, QueryParams, Transaction, TransactionType, NamespaceRegistrationType, UInt64} from 'nem2-sdk'
import Vue from 'vue'

// internal dependencies
import {RESTService} from '@/services/RESTService'
import {MosaicService} from '@/services/MosaicService'
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
    async initialize({ commit, dispatch, getters, rootGetters }, withFeed) {
      const callback = async () => {

        // - initialize CURRENCY from database if available
        if (undefined !== withFeed && withFeed.mosaics && withFeed.mosaics.length && undefined !== withFeed.mosaics.find(m => m.values.get('isCurrencyMosaic'))) {
          await dispatch('INITIALIZE_FROM_DB', withFeed)
        }
        // - initialize CURRENCY from nemesis transactions
        else {
          await dispatch('INITIALIZE_FROM_NEMESIS', rootGetters['network/currentPeer'].url)
        }

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
    async INITIALIZE_FROM_DB({commit, dispatch, rootGetters}, withFeed) {
      const generationHash = rootGetters['network/generationHash']
      const currencyMosaic = withFeed.mosaics.find(
        m => m.values.get('isCurrencyMosaic')
          && generationHash === m.values.get('generationHash')
      )

      dispatch('diagnostic/ADD_DEBUG', 'Store action mosaic/INITIALIZE_FROM_DB dispatched with currencyMosaic: ' + currencyMosaic.values.get('name'), {root: true})

      // - set network currency mosaic
      dispatch('SET_NETWORK_CURRENCY_MOSAIC', {
        mosaic: currencyMosaic,
        name: currencyMosaic.values.get('name'),
        ticker: currencyMosaic.values.get('name').split('.').pop().toUpperCase(),
        mosaicId: currencyMosaic.objects.mosaicId,
      })

      withFeed.mosaics.forEach((model) => {
        // - populate known mosaics
        commit('addMosaicInfo', model.objects.mosaicInfo)

        // - populate known mosaic names
        const name = model.values.get('name')
        if (name !== '') commit('addMosaicName', { hex: model.getIdentifier(), name })
      })
      return {
        currencyMosaic,
        knownMosaics: withFeed.mosaics
      }
    },
    async INITIALIZE_FROM_NEMESIS({commit, dispatch, rootGetters}, nodeUrl) {
      // read first network block to identify currency mosaic

      dispatch('diagnostic/ADD_DEBUG', 'Store action mosaic/INITIALIZE_FROM_NEMESIS dispatched with nodeUrl: ' + nodeUrl, {root: true})

      const blockHttp = RESTService.create('BlockHttp', nodeUrl)
      blockHttp.getBlockTransactions(UInt64.fromUint(1), new QueryParams().setPageSize(100)).subscribe(
        async (transactions: Transaction[]) => {
          const payload = await dispatch('GET_CURRENCY_MOSAIC_FROM_NEMESIS', transactions)

          // - will dispatch REST_FETCH_INFO+REST_FETCH_NAMES
          const service = new MosaicService(this)
          const currencyMosaic = await service.getMosaic(payload.mosaicId, true)

          // - add to known mosaics
          commit('addMosaicInfo', currencyMosaic.objects.mosaicInfo)

          // - set network currency mosaic
          dispatch('SET_NETWORK_CURRENCY_MOSAIC', {
            mosaic: currencyMosaic,
            name: payload.name,
            ticker: payload.ticker,
            mosaicId: payload.mosaicId,
          })
        })
    },
    SET_NETWORK_CURRENCY_MOSAIC({commit}, payload) {
      commit('setNetworkMosaicName', payload.name)
      commit('setNetworkMosaicId', payload.mosaicId)
      commit('setNetworkMosaicTicker', payload.ticker)

      commit('addMosaicName', {
        hex: payload.mosaic.objects.mosaicId.toHex(),
        name: payload.name
      })
    },
    HIDE_MOSAIC({commit}, mosaicId) {
      commit('hideMosaic', mosaicId)
    },
    SHOW_MOSAIC({commit}, mosaicId) {
      commit('showMosaic', mosaicId)
    },
    GET_CURRENCY_MOSAIC_FROM_NEMESIS({commit, dispatch}, transactions) {
      // - read first root namespace
      const rootNamespaceTx = transactions.filter(
        tx => tx.type === TransactionType.NAMESPACE_REGISTRATION
           && tx.registrationType === NamespaceRegistrationType.RootNamespace).shift()

      // - read sub namespace
      const subNamespaceTx = transactions.filter(
        tx => tx.type === TransactionType.NAMESPACE_REGISTRATION 
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

      return {
        name: mosaicName,
        mosaicId: aliasTx.mosaicId,
        ticker: subNamespaceTx.namespaceName.toUpperCase()
      }
    },
    async REST_FETCH_INFO({commit, rootGetters}, mosaicId) {
      const nodeUrl = rootGetters['network/currentPeer'].url
      const networkType = rootGetters['network/networkType']
      const mosaicHttp = RESTService.create('MosaicHttp', nodeUrl, networkType)
      const mosaicInfo = await mosaicHttp.getMosaic(mosaicId).toPromise()

      commit('addMosaicInfo', mosaicInfo)
      return mosaicInfo
    },
    async REST_FETCH_INFOS({commit, rootGetters}, mosaicIds) {
      const nodeUrl = rootGetters['network/currentPeer'].url
      const networkType = rootGetters['network/networkType']
      const mosaicHttp = RESTService.create('MosaicHttp', nodeUrl, networkType)
      const mosaicsInfo = await mosaicHttp.getMosaics(mosaicIds).toPromise()

      mosaicsInfo.map(info => commit('addMosaicInfo', info))
      return mosaicsInfo
    },
    async REST_FETCH_NAMES({commit, rootGetters}, mosaicIds): Promise<{hex: string, name: string}[]> {
      const nodeUrl = rootGetters['network/currentPeer'].url
      const networkType = rootGetters['network/networkType']
      const namespaceHttp = RESTService.create('NamespaceHttp', nodeUrl, networkType)
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
