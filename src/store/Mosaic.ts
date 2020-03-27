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
import {
  MosaicId,
  MosaicInfo,
  NamespaceRegistrationType,
  QueryParams,
  RepositoryFactory,
  Transaction,
  TransactionType,
  UInt64,
} from 'symbol-sdk'
import Vue from 'vue'
// internal dependencies
import {MosaicService} from '@/services/MosaicService'
import {AwaitLock} from './AwaitLock'

const Lock = AwaitLock.create()

const getCurrencyMosaicFromNemesis = (transactions) => {
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

  return {
    name: mosaicName,
    mosaicId: aliasTx.mosaicId,
    ticker: subNamespaceTx.namespaceName.toUpperCase(),
  }
}

// mosaic state typing
interface MosaicState {
  initialized: boolean
  networkMosaicId: MosaicId
  networkMosaicName: string
  networkMosaicTicker: string
  nemesisTransactions: Transaction[]
  mosaicsInfoByHex: Record<string, MosaicInfo>
  mosaicsNamesByHex: Record<string, string>
  hiddenMosaics: string[]
}

// mosaic state initial definition
const mosaicState: MosaicState = {
  initialized: false,
  networkMosaicId: null,
  networkMosaicName: '',
  networkMosaicTicker: '',
  nemesisTransactions: [],
  mosaicsInfoByHex: {},
  mosaicsNamesByHex: {},
  hiddenMosaics: [],
}

export default {
  namespaced: true,
  state: mosaicState,
  getters: {
    getInitialized: (state: MosaicState) => state.initialized,
    networkMosaic: (state: MosaicState) => state.networkMosaicId,
    networkMosaicTicker: (state: MosaicState) => state.networkMosaicTicker,
    nemesisTransactions: (state: MosaicState) => state.nemesisTransactions,
    mosaicsInfo: (state: MosaicState) => state.mosaicsInfoByHex,
    mosaicsInfoList: (state: MosaicState) => Object.keys(state.mosaicsInfoByHex).map(
      hex => state.mosaicsInfoByHex[hex],
    ),
    mosaicsNames: (state: MosaicState) => state.mosaicsNamesByHex,
    hiddenMosaics: (state: MosaicState) => state.hiddenMosaics,
    networkMosaicName: (state: MosaicState) => state.networkMosaicName,
  },
  mutations: {
    setInitialized: (state: MosaicState, initialized) => { state.initialized = initialized },
    setNetworkMosaicId: (state: MosaicState, mosaic) => Vue.set(state, 'networkMosaicId', mosaic),
    setNetworkMosaicName: (state: MosaicState, name) => Vue.set(state, 'networkMosaicName', name),
    setNetworkMosaicTicker: (state: MosaicState, ticker) => Vue.set(state, 'networkMosaicTicker', ticker),
    addMosaicInfo: (state: MosaicState, mosaicInfo: MosaicInfo) => {
      Vue.set(state.mosaicsInfoByHex, mosaicInfo.id.toHex(), mosaicInfo)
    },
    addMosaicName: (state: MosaicState, payload: {hex: string, name: string}) => {
      Vue.set(state.mosaicsNamesByHex, payload.hex, payload.name)
    },  
    hideMosaic: (state: MosaicState, mosaicId) => {
      const hiddenMosaics = [...state.hiddenMosaics]

      // find the index of the mosaic to hide
      const index = hiddenMosaics.indexOf(mosaicId.toHex())

      // the mosaic is already in the list, return
      if (index > -1) return

      // update the state
      Vue.set(state, 'hiddenMosaics', [ ...hiddenMosaics, mosaicId.toHex() ])
    },
    showMosaic: (state: MosaicState, mosaicId) => {
      const hiddenMosaics = [...state.hiddenMosaics]

      // find the index of the mosaic to show
      const index = hiddenMosaics.indexOf(mosaicId.toHex())

      // the mosaic is not in the list, return
      if (index === -1) return

      // remove the mosaic from the list
      hiddenMosaics.splice(index, 1)

      // update the state
      Vue.set(state, 'hiddenMosaics', hiddenMosaics)
    },
  },
  actions: {
    async initialize({ commit, dispatch, getters, rootGetters }, withFeed) {
      const callback = async () => {
        const generationHash = rootGetters['network/generationHash']

        // - initialize CURRENCY from database if available
        if (undefined !== withFeed
            && withFeed.mosaics
            && withFeed.mosaics.length
            && undefined !== withFeed.mosaics.find(m => m.values.get('isCurrencyMosaic') && generationHash === m.values.get('generationHash'))
        ) {
          await dispatch('INITIALIZE_FROM_DB', withFeed)
        }
        // - initialize CURRENCY from nemesis transactions
        else {
          const nodeUrl = rootGetters['network/currentPeer'].url
          const repositoryFactory = rootGetters['network/repositoryFactory']
          await dispatch('INITIALIZE_FROM_NEMESIS', {nodeUrl, repositoryFactory})
        }

        // update store
        commit('setInitialized', true)
      }

      // acquire async lock until initialized
      await Lock.initialize(callback, {getters})
    },
    async uninitialize({ commit, getters }) {
      const callback = async () => {
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {getters})
    },
    /// region scoped actions
    async INITIALIZE_FROM_DB({commit, dispatch, rootGetters}, withFeed) {
      const generationHash = rootGetters['network/generationHash']
      const currencyMosaic = withFeed.mosaics.find(
        m => m.values.get('isCurrencyMosaic')
          && generationHash === m.values.get('generationHash'),
      )

      dispatch('diagnostic/ADD_DEBUG', `Store action mosaic/INITIALIZE_FROM_DB dispatched with currencyMosaic: ${currencyMosaic.values.get('name')}`, {root: true})

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

        // - set hidden state
        if (model.values.get('isHidden')) commit('hideMosaic', new MosaicId(model.getIdentifier))

        // - populate known mosaic names
        const name = model.values.get('name')
        if (name !== '') commit('addMosaicName', { hex: model.getIdentifier(), name })
      })
      return {
        currencyMosaic,
        knownMosaics: withFeed.mosaics,
      }
    },
    async INITIALIZE_FROM_NEMESIS({commit, dispatch}, {repositoryFactory, nodeUrl}) {
      // read first network block to identify currency mosaic

      dispatch('diagnostic/ADD_DEBUG', `Store action mosaic/INITIALIZE_FROM_NEMESIS dispatched with nodeUrl: ${nodeUrl}`, {root: true})

      const blockHttp = repositoryFactory.createBlockRepository()
      blockHttp.getBlockTransactions(UInt64.fromUint(1), new QueryParams({pageSize: 100})).subscribe(
        async (transactions: Transaction[]) => {
          const payload = getCurrencyMosaicFromNemesis(transactions)

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
        },
        err => dispatch(
          'diagnostic/ADD_DEBUG',
          `Store action mosaic/INITIALIZE_FROM_NEMESIS error: ${JSON.stringify(err)}`,
          {root: true},
        ))
    },
    SET_NETWORK_CURRENCY_MOSAIC({commit}, payload) {
      commit('setNetworkMosaicName', payload.name)
      commit('setNetworkMosaicId', payload.mosaicId)
      commit('setNetworkMosaicTicker', payload.ticker)

      commit('addMosaicName', {
        hex: payload.mosaic.objects.mosaicId.toHex(),
        name: payload.name,
      })
    },
    HIDE_MOSAIC({commit}, mosaicId) {
      new MosaicService().toggleHiddenState(mosaicId, true)
      commit('hideMosaic', mosaicId)
    },
    SHOW_MOSAIC({commit}, mosaicId) {
      new MosaicService().toggleHiddenState(mosaicId, false)
      commit('showMosaic', mosaicId)
    },
    async REST_FETCH_INFO({commit, rootGetters}, mosaicId): Promise<MosaicInfo> {
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
      const mosaicHttp = repositoryFactory.createMosaicRepository()
      const mosaicInfo = await mosaicHttp.getMosaic(mosaicId).toPromise()

      commit('addMosaicInfo', mosaicInfo)
      return mosaicInfo
    },
    async REST_FETCH_INFOS({commit, rootGetters}, mosaicIds): Promise<MosaicInfo[]> {
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
      const mosaicHttp = repositoryFactory.createMosaicRepository()
      const mosaicsInfo = await mosaicHttp.getMosaics(mosaicIds).toPromise()

      mosaicsInfo.forEach(info => commit('addMosaicInfo', info))
      return mosaicsInfo
    },
    async REST_FETCH_NAMES({commit, rootGetters}, mosaicIds): Promise<{hex: string, name: string}[]> {
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
      const namespaceHttp = repositoryFactory.createNamespaceRepository()
      const mosaicNames = await namespaceHttp.getMosaicsNames(mosaicIds).toPromise()

      // map by hex if names available
      const mappedNames = mosaicNames
        .filter(({names}) => names.length)
        .map(({mosaicId, names}) => ({hex: mosaicId.toHex(), name: names.shift().name}))

      // update store
      mosaicIds.forEach(id => {
        const hexId = id.toHex()
        const mappedName = mappedNames.find(({hex}) => hex === hexId)
        const name = mappedName ? mappedName.name : ''
        commit('addMosaicName', { hex: hexId, name })
      })

      return mappedNames
    },
    /// end-region scoped actions
  },
}
