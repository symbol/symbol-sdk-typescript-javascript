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
import Vue from 'vue'
import { BlockInfo, IListener, Listener, NetworkType, RepositoryFactory, TransactionFees } from 'symbol-sdk'
import { Subscription } from 'rxjs'
// internal dependencies
import { $eventBus } from '../events'
import { URLHelpers } from '@/core/utils/URLHelpers'
import app from '@/main'
import { AwaitLock } from './AwaitLock'
// configuration
import networkConfig from '../../config/network.conf.json'
import { UrlValidator } from '@/core/validation/validators'
import { NetworkModel } from '@/core/database/entities/NetworkModel'
import { NetworkService } from '@/services/NetworkService'
import { NodeService } from '@/services/NodeService'
import { NodeModel } from '@/core/database/entities/NodeModel'
import { URLInfo } from '@/core/utils/URLInfo'
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel'
import { ProfileModel } from '@/core/database/entities/ProfileModel'

const Lock = AwaitLock.create()

/// region custom types
/**
 * Type SubscriptionType for Wallet Store
 * @type {SubscriptionType}
 */
type SubscriptionType = {
  listener: IListener | undefined
  subscriptions: Subscription[]
}

/**
 * Type BlockRangeType for Wallet Store
 * @type {BlockRangeType}
 */
type BlockRangeType = { start: number }

/// end-region custom types

interface NetworkState {
  initialized: boolean
  currentPeer: URLInfo
  currentPeerInfo: NodeModel
  networkModel: NetworkModel
  networkConfiguration: NetworkConfigurationModel
  repositoryFactory: RepositoryFactory
  listener: Listener
  generationHash: string
  networkType: NetworkType
  isConnected: boolean
  knowNodes: NodeModel[]
  currentHeight: number
  subscriptions: Subscription[]
  transactionFees: TransactionFees
}

const defaultPeer = URLHelpers.formatUrl(networkConfig.defaultNodeUrl)

const networkState: NetworkState = {
  initialized: false,
  currentPeer: defaultPeer,
  currentPeerInfo: new NodeModel(defaultPeer.url, defaultPeer.url, true),
  networkType: networkConfig.defaultNetworkType,
  generationHash: undefined,
  networkModel: undefined,
  networkConfiguration: networkConfig.networkConfigurationDefaults,
  repositoryFactory: NetworkService.createRepositoryFactory(networkConfig.defaultNodeUrl),
  listener: undefined,
  transactionFees: undefined,
  isConnected: false,
  knowNodes: [],
  currentHeight: 0,
  subscriptions: [],
}
export default {
  namespaced: true,
  state: networkState,
  getters: {
    getInitialized: (state: NetworkState) => state.initialized,
    subscriptions: (state: NetworkState) => state.subscriptions,
    networkType: (state: NetworkState) => state.networkType,
    generationHash: (state: NetworkState) => state.generationHash,
    repositoryFactory: (state: NetworkState) => state.repositoryFactory,
    listener: (state: NetworkState) => state.listener,
    networkModel: (state: NetworkState) => state.networkModel,
    networkConfiguration: (state: NetworkState) => state.networkConfiguration,
    currentPeer: (state: NetworkState) => state.currentPeer,
    currentPeerInfo: (state: NetworkState) => state.currentPeerInfo,
    isConnected: (state: NetworkState) => state.isConnected,
    knowNodes: (state: NetworkState) => state.knowNodes,
    currentHeight: (state: NetworkState) => state.currentHeight,
    transactionFees: (state: NetworkState) => state.transactionFees,
  },
  mutations: {
    setInitialized: (state: NetworkState, initialized: boolean) => {
      state.initialized = initialized
    },
    setConnected: (state: NetworkState, connected: boolean) => {
      state.isConnected = connected
    },
    currentHeight: (state: NetworkState, currentHeight: number) => Vue.set(state, 'currentHeight', currentHeight),
    currentPeerInfo: (state: NetworkState, currentPeerInfo: NodeModel) =>
      Vue.set(state, 'currentPeerInfo', currentPeerInfo),
    repositoryFactory: (state: NetworkState, repositoryFactory: RepositoryFactory) =>
      Vue.set(state, 'repositoryFactory', repositoryFactory),
    networkConfiguration: (state: NetworkState, networkConfiguration: NetworkConfigurationModel) =>
      Vue.set(state, 'networkConfiguration', networkConfiguration),
    listener: (state: NetworkState, listener: Listener) => Vue.set(state, 'listener', listener),
    networkModel: (state: NetworkState, networkModel: NetworkModel) => Vue.set(state, 'networkModel', networkModel),
    knowNodes: (state: NetworkState, knowNodes: NodeModel[]) => Vue.set(state, 'knowNodes', knowNodes),
    generationHash: (state: NetworkState, generationHash: string) => Vue.set(state, 'generationHash', generationHash),
    networkType: (state: NetworkState, networkType: NetworkType) => Vue.set(state, 'networkType', networkType),
    currentPeer: (state: NetworkState, currentPeer: URLInfo) => Vue.set(state, 'currentPeer', currentPeer),
    transactionFees: (state: NetworkState, transactionFees: TransactionFees) => {
      state.transactionFees = transactionFees
    },

    addPeer: (state: NetworkState, peerUrl: string) => {
      const knowNodes: NodeModel[] = state.knowNodes
      const existNode = knowNodes.find((p: NodeModel) => p.url === peerUrl)
      if (existNode) {
        return
      }
      const newNodes = [...knowNodes, new NodeModel(peerUrl, '', false)]
      new NodeService().saveNodes(newNodes)
      Vue.set(state, 'knowNodes', newNodes)
    },
    removePeer: (state: NetworkState, peerUrl: string) => {
      const knowNodes: NodeModel[] = state.knowNodes
      const toBeDeleted = knowNodes.find((p: NodeModel) => p.url === peerUrl)
      if (!toBeDeleted) {
        return
      }
      const newNodes = knowNodes.filter((n) => n !== toBeDeleted)
      new NodeService().saveNodes(newNodes)
      Vue.set(state, 'knowNodes', newNodes)
    },
    subscriptions: (state: NetworkState, data) => Vue.set(state, 'subscriptions', data),
    addSubscriptions: (state: NetworkState, payload) => {
      const subscriptions = state.subscriptions
      Vue.set(state, 'subscriptions', [...subscriptions, payload])
    },
  },
  actions: {
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        // commit('knowNodes', new NodeService().getKnowNodesOnly())
        await dispatch('CONNECT')
        // update store
        commit('setInitialized', true)
      }
      // acquire async lock until initialized
      await Lock.initialize(callback, { getters })
    },
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => {
        dispatch('UNSUBSCRIBE')
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, { getters })
    },

    async CONNECT({ commit, dispatch, getters, rootGetters }, newCandidate: string | undefined) {
      const currentProfile: ProfileModel = rootGetters['profile/currentProfile']
      const networkService = new NetworkService()
      const nodeService = new NodeService()
      const networkModelResult = await networkService
        .getNetworkModel(newCandidate, (currentProfile && currentProfile.generationHash) || undefined)
        .toPromise()
      if (!networkModelResult) {
        throw new Error('Connect error, active peer cannot be found')
      }
      const { networkModel, repositoryFactory, fallback } = networkModelResult
      if (fallback) {
        throw new Error('Connection Error.')
      }
      const oldGenerationHash = getters['generationHash']
      const getNodesPromise = nodeService.getNodes(repositoryFactory, networkModel.url).toPromise()
      const getBlockchainHeightPromise = repositoryFactory.createChainRepository().getBlockchainHeight().toPromise()
      const nodes = await getNodesPromise
      const currentHeight = (await getBlockchainHeightPromise).compact()
      const listener = repositoryFactory.createListener()

      const currentPeer = URLHelpers.getNodeUrl(networkModel.url)
      commit('currentPeer', currentPeer)
      commit('networkModel', networkModel)
      commit('networkConfiguration', networkModel.networkConfiguration)
      commit('transactionFees', networkModel.transactionFees)
      commit('networkType', networkModel.networkType)
      commit('generationHash', networkModel.generationHash)
      commit('repositoryFactory', repositoryFactory)
      commit('knowNodes', nodes)
      commit('listener', listener)
      commit('currentHeight', currentHeight)
      commit(
        'currentPeerInfo',
        nodes.find((n) => n.url === networkModel.url),
      )
      commit('setConnected', true)
      $eventBus.$emit('newConnection', currentPeer)
      // subscribe to updates

      if (oldGenerationHash != networkModel.generationHash) {
        dispatch('account/NETWORK_CHANGED', {}, { root: true })
        dispatch('statistics/LOAD', {}, { root: true })
      }
      await listener.open()
      await dispatch('UNSUBSCRIBE')
      dispatch('SUBSCRIBE')
    },

    async SET_CURRENT_PEER({ dispatch }, currentPeerUrl) {
      if (!UrlValidator.validate(currentPeerUrl)) {
        throw Error('Cannot change node. URL is not valid: ' + currentPeerUrl)
      }

      // - show loading overlay
      dispatch(
        'app/SET_LOADING_OVERLAY',
        {
          show: true,
          message: `${app.$t('info_connecting_peer', {
            peerUrl: currentPeerUrl,
          })}`,
          disableCloseButton: true,
        },
        { root: true },
      )

      dispatch('diagnostic/ADD_DEBUG', 'Store action network/SET_CURRENT_PEER dispatched with: ' + currentPeerUrl, {
        root: true,
      })

      try {
        // - disconnect from previous node

        await dispatch('CONNECT', currentPeerUrl)
      } catch (e) {
        console.log(e)
        dispatch(
          'notification/ADD_ERROR',
          `${app.$t('error_peer_connection_went_wrong', {
            peerUrl: currentPeerUrl,
          })}`,
          { root: true },
        )
        dispatch('diagnostic/ADD_ERROR', 'Error with store action network/SET_CURRENT_PEER: ' + JSON.stringify(e), {
          root: true,
        })
      } finally {
        // - hide loading overlay
        dispatch('app/SET_LOADING_OVERLAY', { show: false }, { root: true })
      }
    },

    ADD_KNOWN_PEER({ commit }, peerUrl) {
      if (!UrlValidator.validate(peerUrl)) {
        throw Error('Cannot add node. URL is not valid: ' + peerUrl)
      }
      commit('addPeer', peerUrl)
    },

    REMOVE_KNOWN_PEER({ commit }, peerUrl) {
      commit('removePeer', peerUrl)
    },

    async RESET_PEERS({ dispatch, getters }) {
      const nodeService = new NodeService()
      nodeService.reset()

      const networkService = new NetworkService()
      networkService.reset(getters['generationHash'])

      dispatch('SET_CURRENT_PEER', networkService.getDefaultUrl())
    },

    /**
     * Websocket API
     */
    // Subscribe to latest account transactions.
    async SUBSCRIBE({ commit, dispatch, getters }) {
      // use RESTService to open websocket channel subscriptions
      const listener = getters['listener'] as Listener
      const subscription = listener.newBlock().subscribe((block: BlockInfo) => {
        dispatch('SET_CURRENT_HEIGHT', block.height.compact())
        dispatch('diagnostic/ADD_INFO', 'New block height: ' + block.height.compact(), { root: true })
      })
      // update state of listeners & subscriptions
      commit('addSubscriptions', subscription)
    },

    // Unsubscribe from all open websocket connections
    async UNSUBSCRIBE({ commit, getters }) {
      const subscriptions: Subscription[] = getters.subscriptions
      subscriptions.forEach((s) => s.unsubscribe())
      const listener: Listener = getters.listener
      if (listener) {
        listener.close()
      }
      // update state
      commit('subscriptions', [])
    },

    SET_CURRENT_HEIGHT({ commit }, height) {
      commit('currentHeight', height)
    },
  },
}
