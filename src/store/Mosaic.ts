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
import { AccountInfo, Address, MosaicId, RepositoryFactory } from 'symbol-sdk'
import Vue from 'vue'
// internal dependencies
import { AwaitLock } from './AwaitLock'
import { MosaicService } from '@/services/MosaicService'
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel'
import { MosaicModel } from '@/core/database/entities/MosaicModel'
import { MosaicConfigurationModel } from '@/core/database/entities/MosaicConfigurationModel'
import { first, tap } from 'rxjs/operators'
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel'

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
    setInitialized: (state: MosaicState, initialized: boolean) => {
      state.initialized = initialized
    },
    networkCurrency: (state: MosaicState, networkCurrency: NetworkCurrencyModel) => {
      Vue.set(state, 'networkCurrency', networkCurrency)
      Vue.set(state, 'networkMosaicId', new MosaicId(networkCurrency.mosaicIdHex))
      Vue.set(state, 'networkMosaicName', networkCurrency.namespaceIdFullname)
      Vue.set(state, 'networkMosaicTicker', networkCurrency.ticker)
    },
    mosaics: (
      state: MosaicState,
      {
        mosaics,
        currentSignerAddress,
        networkCurrency,
      }: {
        mosaics: MosaicModel[]
        currentSignerAddress: Address
        networkCurrency: NetworkCurrencyModel
      },
    ) => {
      const ownedMosaics = mosaics.filter(
        (m) => m.ownerRawPlain === currentSignerAddress.plain() && m.addressRawPlain === currentSignerAddress.plain(),
      )

      const holdMosaics = mosaics
        .filter((m) => m.addressRawPlain === currentSignerAddress.plain())
        .sort((m1, m2) => {
          const owner1 = m1.ownerRawPlain === currentSignerAddress.plain()
          const owner2 = m2.ownerRawPlain === currentSignerAddress.plain()
          return Number(owner1) - Number(owner2)
        })

      const noMosaic = networkCurrency && !holdMosaics.find((m) => m.isCurrencyMosaic)

      const balanceMosaics = (noMosaic
        ? [
            ...holdMosaics,
            {
              mosaicIdHex: networkCurrency.mosaicIdHex,
              divisibility: networkCurrency.divisibility,
              name: networkCurrency.namespaceIdFullname,
              isCurrencyMosaic: true,
              balance: 0,
            } as MosaicModel,
          ]
        : [...holdMosaics]
      ).filter((m) => m.isCurrencyMosaic || m.balance > 0)

      Vue.set(state, 'mosaics', mosaics)
      Vue.set(state, 'balanceMosaics', balanceMosaics)
      Vue.set(state, 'ownedMosaics', ownedMosaics)
      Vue.set(
        state,
        'holdMosaics',
        holdMosaics.filter((m) => m.ownerRawPlain === currentSignerAddress.plain() || m.balance > 0),
      )
    },
    mosaicConfigurations: (state: MosaicState, mosaicConfigurations: Record<string, MosaicConfigurationModel>) =>
      Vue.set(state, 'mosaicConfigurations', mosaicConfigurations),
  },
  actions: {
    async initialize({ commit, getters }) {
      const callback = async () => {
        const mosaicService = new MosaicService()
        commit('mosaicConfigurations', mosaicService.getMosaicConfigurations())
        commit('setInitialized', true)
      }
      // acquire async lock until initialized
      await Lock.initialize(callback, { getters })
    },
    async uninitialize({ commit, getters }) {
      const callback = async () => {
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, { getters })
    },

    async LOAD_NETWORK_CURRENCIES({ commit, rootGetters }) {
      const mosaicService = new MosaicService()
      const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory']
      const networkConfig: NetworkConfigurationModel = rootGetters['network/networkConfiguration']
      const generationHash: string = rootGetters['network/generationHash']
      await mosaicService
        .getNetworkCurrencies(repositoryFactory, generationHash, networkConfig)
        .pipe(
          tap((networkCurrencies) => {
            commit('networkCurrency', networkCurrencies.networkCurrency)
          }),
          first(),
        )
        .toPromise()
    },

    LOAD_MOSAICS({ commit, rootGetters }) {
      const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory']
      const networkCurrency: NetworkCurrencyModel = rootGetters['mosaic/networkCurrency']
      const accountsInfo: AccountInfo[] = rootGetters['account/accountsInfo'] || []
      const generationHash = rootGetters['network/generationHash']

      new MosaicService()
        .getMosaics(repositoryFactory, generationHash, networkCurrency, accountsInfo)
        .subscribe((mosaics) => {
          const currentSignerAddress: Address = rootGetters['account/currentSignerAddress']
          if (!currentSignerAddress) return
          commit('mosaics', {
            mosaics: mosaics,
            currentSignerAddress,
            networkCurrency,
          })
        })
    },

    RESET_MOSAICS({ commit, rootGetters }) {
      const networkCurrency: NetworkCurrencyModel = rootGetters['mosaic/networkCurrency']
      commit('mosaics', { mosaics: [], undefined, networkCurrency })
    },

    SIGNER_CHANGED({ commit, rootGetters, getters }) {
      const currentSignerAddress: Address = rootGetters['account/currentSignerAddress']
      const networkCurrency: NetworkCurrencyModel = rootGetters['mosaic/networkCurrency']
      if (!currentSignerAddress) {
        return
      }
      commit('mosaics', {
        mosaics: getters['mosaics'],
        currentSignerAddress,
        networkCurrency,
      })
    },

    HIDE_MOSAIC({ commit }, mosaicId) {
      commit(
        'mosaicConfigurations',
        new MosaicService().changeMosaicConfiguration(mosaicId, {
          hidden: true,
        }),
      )
    },
    SHOW_MOSAIC({ commit }, mosaicId) {
      commit(
        'mosaicConfigurations',
        new MosaicService().changeMosaicConfiguration(mosaicId, {
          hidden: false,
        }),
      )
    },
  },
}
