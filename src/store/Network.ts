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
import Vue from 'vue'
import {BlockInfo, IListener, NetworkType, RepositoryFactory, UInt64} from 'symbol-sdk'
import {Subscription} from 'rxjs'
// internal dependencies
import {$eventBus} from '../events'
import {RESTService} from '@/services/RESTService'
import {PeersModel} from '@/core/database/entities/PeersModel'
import {URLHelpers} from '@/core/utils/URLHelpers'
import app from '@/main'
import {AwaitLock} from './AwaitLock'
// configuration
import networkConfig from '../../config/network.conf.json'
import {PeersRepository} from '@/repositories/PeersRepository'
import {UrlValidator} from '@/core/validation/validators'
import {PeerService} from '@/services/PeerService'

const Lock = AwaitLock.create()

/// region internal helpers
/**
 * Recursive function helper to determine block ranges
 * needed to fetch data about all block \a heights
 * @param {number[]} heights
 * @return {BlockRangeType[]}
 */
const getBlockRanges = (heights: number[], ranges: BlockRangeType[] = []): BlockRangeType[] => {
  const pageSize: number = 100
  const min: number = Math.min(...heights)

  // - register first range
  ranges.push({start: min})

  // - take remaining block heights and run again
  heights = heights.filter(height => height > min + pageSize)
  if (heights.length) {
    return getBlockRanges(heights, ranges)
  }
  return ranges
}
/// end-region internal helpers

/// region custom types
/**
 * Type SubscriptionType for Wallet Store
 * @type {SubscriptionType}
 */
type SubscriptionType = {listener: IListener, subscriptions: Subscription[]}

/**
 * Type BlockRangeType for Wallet Store
 * @type {BlockRangeType}
 */
type BlockRangeType = {start: number}
/// end-region custom types

export default {
  namespaced: true,
  state: {
    initialized: false,
    config: networkConfig,
    defaultPeer: URLHelpers.formatUrl(networkConfig.defaultNode.url),
    currentPeer: URLHelpers.formatUrl(networkConfig.defaultNode.url),
    explorerUrl: networkConfig.explorerUrl,
    networkType: NetworkType.TEST_NET,
    generationHash: networkConfig.networks['testnet-publicTest'].generationHash,
    properties: networkConfig.networks['testnet-publicTest'].properties,
    repositoryFactory: RESTService.createRepositoryFactory(networkConfig.defaultNode.url),
    isConnected: false,
    nemesisTransactions: [],
    knownPeers: [],
    currentHeight: 0,
    knownBlocks: {},
    // Subscriptions to websocket channels.
    subscriptions: [],
  },
  getters: {
    getInitialized: state => state.initialized,
    getSubscriptions: state => state.subscriptions,
    networkType: state => state.networkType,
    generationHash: state => state.generationHash,
    repositoryFactory: state => state.repositoryFactory,
    properties: state => state.properties,
    defaultPeer: state => state.defaultPeer,
    currentPeer: state => state.currentPeer,
    currentPeerInfo: state => state.currentPeerInfo,
    explorerUrl: state => state.explorerUrl,
    isConnected: state => state.isConnected,
    knownPeers: state => state.knownPeers,
    currentHeight: state => state.currentHeight,
    knownBlocks: state => state.knownBlocks,
    config: state => state.config,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setConnected: (state, connected) => { state.isConnected = connected },
    currentHeight: (state, height) => Vue.set(state, 'currentHeight', height),
    currentPeerInfo: (state, info) => Vue.set(state, 'currentPeerInfo', info),
    repositoryFactory: (state, repositoryFactory) => Vue.set(state, 'repositoryFactory', repositoryFactory),
    currentPeer: (state, payload) => {
      if (undefined !== payload) {
        const currentPeer = URLHelpers.formatUrl(payload)
        Vue.set(state, 'currentPeer', currentPeer)
        Vue.set(state, 'repositoryFactory', RESTService.createRepositoryFactory(currentPeer.url))
      }
    },
    addPeer: (state, peerUrl) => {
      const knownPeers = state.knownPeers
      knownPeers.push(peerUrl)
      Vue.set(state, 'knownPeers', knownPeers)
    },
    removePeer: (state, peerUrl) => {
      const idx = state.knownPeers.findIndex(p => p === peerUrl)
      if (idx === undefined) {
        return 
      }

      const leftPeers = state.knownPeers.splice(0, idx)
      const rightPeers = state.knownPeers.splice(idx + 1, state.knownPeers.length - idx - 1)
      const knownPeers = leftPeers.concat(rightPeers)
      Vue.set(state, 'knownPeers', knownPeers)
    },
    resetPeers: (state) => {
      Vue.set(state, 'knownPeers', [])
    },
    addBlock: (state, block: BlockInfo) => {
      const knownBlocks = state.knownBlocks
      knownBlocks[block.height.compact()] = block
      Vue.set(state, 'knownBlocks', knownBlocks)
    },
    networkType: (state, type) => {
      Vue.set(state, 'networkType', type || NetworkType.TEST_NET)
    },
    setSubscriptions: (state, data) => Vue.set(state, 'subscriptions', data),
    addSubscriptions: (state, payload) => {
      const subscriptions = state.subscriptions
      subscriptions.push(payload)

      Vue.set(state, 'subscriptions', subscriptions)
    },
    generationHash: (state, hash) => Vue.set(state, 'generationHash', hash),
  },
  actions: {
    async initialize({ commit, dispatch, getters }, withFeed) {
      const callback = async () => {

        let initPayload: {
          knownPeers: PeersModel[]
          nodeUrl: string
        }

        // - initialize current peer from database if available
        if (undefined !== withFeed && withFeed.endpoints && withFeed.endpoints.length) {
          initPayload = await dispatch('INITIALIZE_FROM_DB', withFeed)
        }
        // - initialize current peer from config and REST
        else {
          initPayload = await dispatch('INITIALIZE_FROM_CONFIG', getters.defaultPeer.url)
        }

        const knownPeers: PeersModel[] = initPayload.knownPeers
        const nodeUrl: string = initPayload.nodeUrl

        dispatch('diagnostic/ADD_DEBUG', `Store action network/initialize selected peer: ${nodeUrl}`, {root: true})

        // - populate known peers
        knownPeers.map(peer => commit('addPeer', peer.values.get('rest_url')))

        // update store
        commit('setInitialized', true)
      }

      // acquire async lock until initialized
      await Lock.initialize(callback, {getters})
    },
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => {
        dispatch('UNSUBSCRIBE')
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {getters})
    },
    /// region scoped actions
    async INITIALIZE_FROM_DB({dispatch}, withFeed) {
      const defaultPeer = withFeed.endpoints.find(m => m.values.get('is_default'))
      const nodeUrl = defaultPeer.values.get('rest_url')
      const repositoryFactory: RepositoryFactory = RESTService.createRepositoryFactory(nodeUrl)

      // - height always from network
      const chainHttp = repositoryFactory.createChainRepository()
      const currentHeight = await chainHttp.getBlockchainHeight().toPromise()

      // - set current peer connection
      dispatch('OPEN_PEER_CONNECTION', {
        repositoryFactory: repositoryFactory,
        url: nodeUrl,
        networkType: defaultPeer.values.get('networkType'),
        generationHash: defaultPeer.values.get('generationHash'),
        currentHeight: currentHeight,
        peerInfo: defaultPeer.objects.info,
      })

      // - populate known peers
      return {
        knownPeers: withFeed.endpoints,
        nodeUrl: nodeUrl,
      }
    },
    async INITIALIZE_FROM_CONFIG({dispatch}, nodeUrl) {
      try {
        const payload = await dispatch('REST_FETCH_PEER_INFO', nodeUrl)

        // @OFFLINE: value should be defaulted to config data when REST_FETCH_PEER_INFO throws
        // - set current peer connection
        dispatch('OPEN_PEER_CONNECTION', {...payload})

        // - initialize from config must populate DB
        const repository = new PeersRepository()
        const knownPeers: PeersModel[] = repository.repopulateFromConfig(payload.generationHash)
        return {
          knownPeers: knownPeers,
          nodeUrl: nodeUrl,
        }
      }
      catch (e) {
        dispatch('diagnostic/ADD_ERROR', `Store action network/initialize default peer unreachable: ${e.toString()}`, {root: true})
      }
    },
    async OPEN_PEER_CONNECTION({commit, dispatch}, payload) {
      commit('currentPeer', payload.url)
      commit('networkType', payload.networkType)
      commit('setConnected', true)
      $eventBus.$emit('newConnection', payload.url)

      commit('currentHeight', payload.currentHeight.compact())
      commit('currentPeerInfo', payload.peerInfo)

      // subscribe to updates
      dispatch('SUBSCRIBE')
    },
    async SET_CURRENT_PEER({ dispatch, rootGetters }, currentPeerUrl) {
      if (!UrlValidator.validate(currentPeerUrl)) {
        throw Error(`Cannot change node. URL is not valid: ${currentPeerUrl}`)
      }

      // - show loading overlay
      dispatch('app/SET_LOADING_OVERLAY', {
        show: true,
        message: `${app.$t('info_connecting_peer', {peerUrl: currentPeerUrl})}`,
        disableCloseButton: true,
      }, {root: true})

      dispatch('diagnostic/ADD_DEBUG', `Store action network/SET_CURRENT_PEER dispatched with: ${currentPeerUrl}`, {root: true})

      try {
        // - disconnect from previous node
        await dispatch('UNSUBSCRIBE')

        // - fetch info / connect to new node
        const payload = await dispatch('REST_FETCH_PEER_INFO', currentPeerUrl)

        dispatch('OPEN_PEER_CONNECTION', {...payload})

        const currentWallet = rootGetters['wallet/currentWallet']

        // - clear wallet balances
        await dispatch('wallet/uninitialize', {
          address: currentWallet.values.get('address'),
          which: 'currentWalletMosaics',
        }, {root: true})

        // - re-open listeners
        dispatch('wallet/initialize', {address: currentWallet.values.get('address')}, {root: true})

        // - set chosen endpoint as the new default in the database
        new PeerService().setDefaultNode(currentPeerUrl)
      } catch (e) {
        dispatch(
          'notification/ADD_ERROR',
          `${app.$t('error_peer_connection_went_wrong', {peerUrl: currentPeerUrl})}`,
          {root: true},
        )
        dispatch('diagnostic/ADD_ERROR', `Error with store action network/SET_CURRENT_PEER: ${JSON.stringify(e)}`, {root: true})
      } finally {
        // - hide loading overlay
        dispatch('app/SET_LOADING_OVERLAY', {show: false}, {root: true})
      }
    },
    ADD_KNOWN_PEER({commit}, peerUrl) {
      if (!UrlValidator.validate(peerUrl)) {
        throw Error(`Cannot add node. URL is not valid: ${peerUrl}`)
      }

      commit('addPeer', peerUrl)
    },
    REMOVE_KNOWN_PEER({commit}, peerUrl) {
      commit('removePeer', peerUrl)
    },
    RESET_PEERS({commit, getters, dispatch}) {
      commit('resetPeers')

      // - re-populate known peers from config
      const repository = new PeersRepository()
      const knownPeers = repository.repopulateFromConfig(getters.generationHash)

      // - populate known peers
      knownPeers.map(peer => commit('addPeer', peer.values.get('rest_url')))

      dispatch('SET_CURRENT_PEER', knownPeers.shift().values.get('rest_url'))
    },
    RESET_SUBSCRIPTIONS({commit}) {
      commit('setSubscriptions', [])
    },
    ADD_BLOCK({commit}, block: BlockInfo) {
      commit('addBlock', block)
    },
    /**
 * Websocket API
 */
    // Subscribe to latest account transactions.
    async SUBSCRIBE({ commit, dispatch, getters }) {
      // use RESTService to open websocket channel subscriptions
      const repositoryFactory = getters['repositoryFactory'] as RepositoryFactory
      const subscriptions: SubscriptionType = await RESTService.subscribeBlocks(
        {commit, dispatch},
        repositoryFactory,
      )

      // update state of listeners & subscriptions
      commit('addSubscriptions', subscriptions)
    },

    // Unsubscribe from all open websocket connections
    async UNSUBSCRIBE({ dispatch, getters }) {
      const subscriptions = getters.getSubscriptions

      for (let i = 0, m = subscriptions.length; i < m; i ++) {
        const subscription = subscriptions[i]

        // subscribers
        for (let j = 0, n = subscription.subscriptions; j < n; j ++) {
          await subscription.subscriptions[j].unsubscribe()
        }

        await subscription.listener.close()
      }

      // update state
      dispatch('RESET_SUBSCRIPTIONS')
    },
    SET_CURRENT_HEIGHT({commit}, height) {
      commit('currentHeight', height)
    },
    async REST_FETCH_BLOCKS({commit, dispatch, getters, rootGetters}, blockHeights: number[]) {

      // - filter out known blocks
      const knownBlocks: {[h: number]: BlockInfo} = getters['knownBlocks']
      const unknownHeights = blockHeights.filter(height => !knownBlocks || !knownBlocks[height])
      const knownHeights = blockHeights.filter(height => knownBlocks && knownBlocks[height])

      // - initialize blocks list with known blocks
      let blocks: BlockInfo[] = knownHeights.map(known => knownBlocks[known])
      if (!unknownHeights.length) {
        return blocks
      }

      // - use block ranges helper to minimize number of requests (recent blocks first)
      const ranges: {start: number}[] = getBlockRanges(unknownHeights).reverse()

      try {
        // - prepare REST gateway connection
        const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
        const blockHttp = repositoryFactory.createBlockRepository()

        // - fetch blocks information per-range (wait 3 seconds every 4th block)
        ranges.slice(0, 3).map(({start}) => {
          blockHttp.getBlocksByHeightWithLimit(UInt64.fromUint(start), 100).subscribe(
            (infos: BlockInfo[]) => {
              infos.map(b => commit('addBlock', b))
              blocks = blocks.concat(infos)
            })
        })

        const nextHeights = ranges.slice(3).map(r => r.start)
        if (nextHeights.length) {
          setTimeout(() => {
            dispatch('diagnostic/ADD_DEBUG', `Store action network/REST_FETCH_BLOCKS delaying heights discovery for 2 seconds: ${JSON.stringify(nextHeights)}`, {root: true})
            return dispatch('REST_FETCH_BLOCKS', nextHeights)
          }, 2000)
        }
      }
      catch (e) {
        dispatch('diagnostic/ADD_ERROR', `An error happened while trying to fetch blocks information: ${e}`, {root: true})
        return false
      }
    },
    async REST_FETCH_PEER_INFO({dispatch}, nodeUrl: string) {
      dispatch('diagnostic/ADD_DEBUG', `Store action network/REST_FETCH_PEER_INFO dispatched with: ${nodeUrl}`, {root: true})

      try {
        const repositoryFactory: RepositoryFactory = RESTService.createRepositoryFactory(nodeUrl)
        const chainHttp = repositoryFactory.createChainRepository()
        const nodeHttp = repositoryFactory.createNodeRepository()

        // - read nemesis from REST
        const generationHash = await repositoryFactory.getGenerationHash().toPromise()
        const networkType = await repositoryFactory.getNetworkType().toPromise()

        // - read peer info from REST
        const peerInfo = await nodeHttp.getNodeInfo().toPromise()

        // - read chain height from REST
        const currentHeight = await chainHttp.getBlockchainHeight().toPromise()

        return {
          url: nodeUrl,
          repositoryFactory,
          networkType,
          generationHash,
          currentHeight,
          peerInfo,
        }
      }
      catch(e) {
        throw new Error(e)
      }
    },
    /// end-region scoped actions
  },
}
