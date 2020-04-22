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
import {AccountInfo, Address, MosaicId, RepositoryFactory} from 'symbol-sdk'
import Vue from 'vue'
// internal dependencies
import {AwaitLock} from './AwaitLock'
import {MosaicService} from '@/services/MosaicService'
import {NetworkCurrencyModel} from '@/core/database/entities/NetworkCurrencyModel'
import {MosaicModel} from '@/core/database/entities/MosaicModel'
import {MosaicConfigurationModel} from '@/core/database/entities/MosaicConfigurationModel'

const Lock = AwaitLock.create()

// mosaic state typing
interface MosaicState {
  initialized: boolean
  networkCurrency: NetworkCurrencyModel
  mosaics: MosaicModel[]
  balanceMosaics: MosaicModel[]
  holdMosaics: MosaicModel[]
  ownedMosaics: MosaicModel[]
  networkMosaicId: MosaicId
  networkMosaicName: string
  networkMosaicTicker: string
  mosaicConfigurations: Record<string, MosaicConfigurationModel>
}

// mosaic state initial definition
const mosaicState: MosaicState = {
  initialized: false,
  networkMosaicId: null,
  mosaics: [],
  balanceMosaics: [],
  holdMosaics: [],
  ownedMosaics: [],
  networkCurrency: null,
  networkMosaicName: '',
  networkMosaicTicker: '',
  mosaicConfigurations: {},
}

export default {
  namespaced: true,
  state: mosaicState,
  getters: {
    getInitialized: (state: MosaicState) => state.initialized,
    networkCurrency: (state: MosaicState) => state.networkCurrency,
    mosaics: (state: MosaicState) => state.mosaics,
    ownedMosaics: (state: MosaicState) => state.ownedMosaics,
    holdMosaics: (state: MosaicState) => state.holdMosaics,
    balanceMosaics: (state: MosaicState) => state.balanceMosaics,
    networkMosaic: (state: MosaicState) => state.networkMosaicId,
    networkMosaicTicker: (state: MosaicState) => state.networkMosaicTicker,
    mosaicConfigurations: (state: MosaicState) => state.mosaicConfigurations,
    networkMosaicName: (state: MosaicState) => state.networkMosaicName,
  },
  mutations: {
    setInitialized: (state: MosaicState,
      initialized: boolean) => { state.initialized = initialized },
    networkCurrency: (state: MosaicState, networkCurrency: NetworkCurrencyModel) => {
      Vue.set(state, 'networkCurrency', networkCurrency)
      Vue.set(state, 'networkMosaicId', new MosaicId(networkCurrency.mosaicIdHex))
      Vue.set(state, 'networkMosaicName', networkCurrency.namespaceIdFullname)
      Vue.set(state, 'networkMosaicTicker', networkCurrency.ticker)
    },
    mosaics: (state: MosaicState, {mosaics, currentSignerAddress, networkCurrency}:
    { mosaics: MosaicModel[], currentSignerAddress: Address, networkCurrency: NetworkCurrencyModel }) => {

      const ownedMosaics = mosaics.filter(
        m => m.ownerRawPlain === currentSignerAddress.plain() && m.addressRawPlain === currentSignerAddress.plain())

      const holdMosaics = mosaics.filter(m => m.addressRawPlain === currentSignerAddress.plain()).sort((m1, m2)=>{
        const owner1 = m1.ownerRawPlain === currentSignerAddress.plain()
        const owner2 = m2.ownerRawPlain === currentSignerAddress.plain()
        return Number(owner1) - Number(owner2)
      })

      const noMosaic = networkCurrency && !holdMosaics.find(
        m => m.isCurrencyMosaic)

      const balanceMosaics = (noMosaic ? [ ...holdMosaics, {
        mosaicIdHex: networkCurrency.mosaicIdHex,
        divisibility: networkCurrency.divisibility,
        name: networkCurrency.namespaceIdFullname,
        isCurrencyMosaic: true,
        balance: 0,
      } as MosaicModel ] : [...holdMosaics]).filter(m => m.isCurrencyMosaic || m.balance > 0)


      Vue.set(state, 'mosaics', mosaics)
      Vue.set(state, 'balanceMosaics', balanceMosaics)
      Vue.set(state, 'ownedMosaics', ownedMosaics)
      Vue.set(state, 'holdMosaics', holdMosaics.filter(m => m.ownerRawPlain === currentSignerAddress.plain() || m.balance > 0))
    },
    mosaicConfigurations: (state: MosaicState,
      mosaicConfigurations: Record<string, MosaicConfigurationModel>) => Vue.set(
      state, 'mosaicConfigurations', mosaicConfigurations),

  },
  actions: {
    async initialize({commit, getters, rootGetters}) {
      const callback = () => {
        const repositoryFactory = rootGetters['network/repositoryFactory']
        const mosaicService = new MosaicService()
        mosaicService.getNetworkCurrencies(repositoryFactory).subscribe(networkCurrencies => {
          commit('networkCurrency', networkCurrencies.find(i => i))
          commit('setInitialized', true)
        })
        commit('mosaicConfigurations', mosaicService.getMosaicConfigurations())
      }
      // acquire async lock until initialized
      await Lock.initialize(callback, {getters})
    },
    async uninitialize({commit, getters}) {
      const callback = async () => {
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {getters})
    },

    LOAD_MOSAICS({commit, rootGetters}) {
      const currentSignerAddress: Address = rootGetters['wallet/currentSignerAddress']
      if (!currentSignerAddress) {
        return
      }
      const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory']
      const networkCurrency: NetworkCurrencyModel = rootGetters['mosaic/networkCurrency']
      const mosaicService = new MosaicService()
      const accountsInfo: AccountInfo[] = rootGetters['wallet/accountsInfo'] || []

      mosaicService.getMosaics(repositoryFactory, networkCurrency ? [networkCurrency] : [],
        accountsInfo).subscribe((mosaics) => {
        commit('mosaics', {mosaics: mosaics, currentSignerAddress, networkCurrency})
      })
    },

    SIGNER_CHANGED({dispatch}) {
      dispatch('LOAD_MOSAICS')
    },

    HIDE_MOSAIC({commit}, mosaicId) {
      commit('mosaicConfigurations',
        new MosaicService().changeMosaicConfiguration(mosaicId, {hidden: true}))
    },
    SHOW_MOSAIC({commit}, mosaicId) {
      commit('mosaicConfigurations',
        new MosaicService().changeMosaicConfiguration(mosaicId, {hidden: false}))
    },
  },
}
