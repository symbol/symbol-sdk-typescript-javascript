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
import {
  Account,
  AccountInfo,
  Address,
  AggregateTransaction,
  CosignatureSignedTransaction,
  IListener,
  Mosaic,
  MosaicInfo,
  MultisigAccountInfo,
  NamespaceInfo,
  NetworkType,
  Order,
  PublicAccount,
  QueryParams,
  RepositoryFactory,
  SignedTransaction,
  Transaction,
  TransactionType,
  UInt64,
} from 'symbol-sdk'
import {Subscription} from 'rxjs'
// internal dependencies
import {$eventBus} from '../events'
import {RESTService} from '@/services/RESTService'
import {AwaitLock} from './AwaitLock'
import {BroadcastResult} from '@/core/transactions/BroadcastResult'
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {RESTDispatcher} from '@/core/utils/RESTDispatcher'
import {NamespaceService} from '@/services/NamespaceService'
import {MultisigService} from '@/services/MultisigService'
import {WalletService} from '@/services/WalletService'

/**
 * Helper to format transaction group in name of state variable.
 *
 * @internal
 * @param {string} group
 * @return {string} One of 'confirmedTransactions', 'unconfirmedTransactions' or 'partialTransactions'
 */
const transactionGroupToStateVariable = (
  group: string,
): string => {
  let transactionGroup = group.toLowerCase()
  if (transactionGroup === 'unconfirmed'
      || transactionGroup === 'confirmed'
      || transactionGroup === 'partial') {
    transactionGroup = `${transactionGroup}Transactions`
  }
  else {
    throw new Error(`Unknown transaction group '${group}'.`)
  }

  return transactionGroup
}

/**
 * Create an sdk address object by payload
 * @param payload
 */
const getAddressByPayload = (
  payload: WalletPayloadType,
): Address => {
  if (payload instanceof WalletsModel) {
    return Address.createFromRawAddress(payload.values.get('address'))
  }
  else if (payload instanceof PublicAccount
        || payload instanceof Account) {
    return payload.address
  }
  else if (payload instanceof Address) {
    return payload
  }

  // - finally from payload
  const publicAccount = PublicAccount.createFromPublicKey(
    payload.publicKey,
    payload.networkType,
  )
  return publicAccount.address
}

/**
 * Create a wallet entity by payload
 * @param payload
 */
const getWalletByPayload = (
  payload: WalletPayloadType,
): WalletsModel => {
  if (payload instanceof WalletsModel) {
    return payload
  }
  else if (payload instanceof Address) {
    return new WalletsModel(new Map<string, any>([
      [ 'name', payload.pretty() ],
      [ 'address', payload.plain() ],
      [ 'publicKey', payload.plain() ],
      [ 'isMultisig', true ],
    ]))
  }
  else if (payload instanceof PublicAccount || payload instanceof Account) {
    return new WalletsModel(new Map<string, any>([
      [ 'name', payload.address.pretty() ],
      [ 'address', payload.address.plain() ],
      [ 'publicKey', payload.publicKey ],
      [ 'isMultisig', true ],
    ]))
  }
  else if (payload && payload.networkType && payload.publicKey) {
    const publicAccount = PublicAccount.createFromPublicKey(payload.publicKey, payload.networkType)
    const walletName = payload.name && payload.name.length ? payload.name : publicAccount.address.pretty()
    return new WalletsModel(new Map<string, any>([
      [ 'name', walletName ],
      [ 'address', publicAccount.address.plain() ],
      [ 'publicKey', publicAccount.publicKey ],
      [ 'isMultisig', true ],
    ]))
  }
  else return undefined
}

/// region globals
const Lock = AwaitLock.create()
/// end-region globals

/**
 * Type SubscriptionType for Wallet Store
 * @type {SubscriptionType}
 */
type SubscriptionType = {
  listener: IListener
  subscriptions: Subscription[]
}

type WalletPayloadType = WalletsModel | Account | PublicAccount | Address | {
  networkType: NetworkType
  publicKey?: string
  name?: string
}

// wallet state typing
interface WalletState {
  initialized: boolean
  currentWallet: WalletsModel
  currentWalletAddress: Address
  currentWalletMosaics: Mosaic[]
  currentWalletOwnedMosaics: MosaicInfo[]
  currentWalletOwnedNamespaces: NamespaceInfo[]
  isCosignatoryMode: boolean
  currentSigner: {networkType: NetworkType, publicKey: string}
  currentSignerAddress: Address
  currentSignerMosaics: Mosaic[]
  currentSignerOwnedMosaics: MosaicInfo[]
  currentSignerOwnedNamespaces: NamespaceInfo[]
  // Known wallet database identifiers
  knownWallets: string[]
  knownWalletsInfo: Record<string, AccountInfo>
  knownMultisigsInfo: Record<string, MultisigAccountInfo>
  transactionHashes: string[]
  confirmedTransactions: Transaction[]
  unconfirmedTransactions: Transaction[]
  partialTransactions: Transaction[]
  stageOptions: { isAggregate: boolean, isMultisig: boolean }
  stagedTransactions: Transaction[]
  signedTransactions: SignedTransaction[]
  transactionCache: Record<string, Transaction[]>
  // Subscriptions to webSocket channels
  subscriptions: Record<string, SubscriptionType[][]>
}

// Wallet state initial definition
const walletState: WalletState = {
  initialized: false,
  currentWallet: null,
  currentWalletAddress: null,
  currentWalletMosaics: [],
  currentWalletOwnedMosaics: [],
  currentWalletOwnedNamespaces: [],
  isCosignatoryMode: false,
  currentSigner: null,
  currentSignerAddress: null,
  currentSignerMosaics: [],
  currentSignerOwnedMosaics: [],
  currentSignerOwnedNamespaces: [],
  knownWallets: [],
  knownWalletsInfo: {},
  knownMultisigsInfo: {},
  transactionHashes: [],
  confirmedTransactions: [],
  unconfirmedTransactions: [],
  partialTransactions: [],
  stageOptions: {
    isAggregate: false,
    isMultisig: false,
  },
  stagedTransactions: [],
  signedTransactions: [],
  transactionCache: {},
  // Subscriptions to websocket channels.
  subscriptions: {},
}

/**
 * Wallet Store
 */
export default {
  namespaced: true,
  state: walletState,
  getters: {
    getInitialized: (state: WalletState) => state.initialized,
    currentWallet: (state: WalletState) => {
      // - in case of a WalletsModel, the currentWallet instance is simply returned
      // - in case of Address/Account or other, a fake model will be created
      return getWalletByPayload(state.currentWallet)
    },
    currentSigner: (state: WalletState) => {
      // - in case of a WalletsModel, the currentWallet instance is simply returned
      // - in case of Address/Account or other, a fake model will be created
      return getWalletByPayload(state.currentSigner)
    },
    currentWalletAddress: (state: WalletState) => state.currentWalletAddress,
    currentWalletInfo: (state: WalletState): AccountInfo | null => {
      const plainAddress = state.currentWalletAddress ? state.currentWalletAddress.plain() : null
      if(!plainAddress) return null
      if(!state.knownWalletsInfo || !state.knownWalletsInfo[plainAddress]) return null
      return state.knownWalletsInfo[plainAddress]
    },
    currentWalletMosaics: (state: WalletState) => state.currentWalletMosaics,
    currentWalletOwnedMosaics: (state: WalletState) => state.currentWalletOwnedMosaics,
    currentWalletOwnedNamespaces: (state: WalletState) => state.currentWalletOwnedNamespaces,
    currentWalletMultisigInfo: (state: WalletState) => {
      const plainAddress = state.currentWalletAddress ? state.currentWalletAddress.plain() : null
      if(!plainAddress) return null
      if(!state.knownMultisigsInfo || !state.knownMultisigsInfo[plainAddress]) return null
      return state.knownMultisigsInfo[plainAddress]
    },
    isCosignatoryMode: (state: WalletState) => state.isCosignatoryMode,
    currentSignerAddress: (state: WalletState) => state.currentSignerAddress,
    currentSignerInfo: (state: WalletState): AccountInfo | null => {
      const plainAddress = state.currentSignerAddress ? state.currentSignerAddress.plain() : null
      if(!plainAddress) return null
      if(!state.knownWalletsInfo || !state.knownWalletsInfo[plainAddress]) return null
      return state.knownWalletsInfo[plainAddress]
    },
    currentSignerMultisigInfo: (state: WalletState) => {
      const plainAddress = state.currentSignerAddress ? state.currentSignerAddress.plain() : null
      if(!plainAddress) return null
      if(!state.knownMultisigsInfo || !state.knownMultisigsInfo[plainAddress]) return null
      return state.knownMultisigsInfo[plainAddress]
    },
    currentSignerMosaics: (state: WalletState) => state.currentSignerMosaics,
    currentSignerOwnedMosaics: (state: WalletState) => state.currentSignerOwnedMosaics,
    currentSignerOwnedNamespaces: (state: WalletState) => state.currentSignerOwnedNamespaces,
    knownWallets: (state: WalletState) => state.knownWallets,
    knownWalletsInfo: (state: WalletState) => state.knownWalletsInfo,
    currentWallets:(state: WalletState)=>{
      const knownWallets = state.knownWallets
      if(!knownWallets || !knownWallets.length) return []
      const currentWallets = new WalletService().getWallets(
        (e) => knownWallets.includes(e.getIdentifier()),
      )
      return currentWallets.map(
        ({identifier, values}) => ({
          identifier,
          address: values.get('address'),
          name: values.get('name'),
          type: values.get('type'),
          isMultisig: values.get('isMultisig'),
          path: values.get('path'),
        }),
      )
    },
    knownMultisigsInfo: (state: WalletState) => state.knownMultisigsInfo,
    getSubscriptions: (state: WalletState) => state.subscriptions,
    transactionHashes: (state: WalletState) => state.transactionHashes,
    confirmedTransactions: (state: WalletState) => {
      return state.confirmedTransactions.sort((t1, t2) => {
        const info1 = t1.transactionInfo
        const info2 = t2.transactionInfo

        // - confirmed sorted by height then index
        const diffHeight = info1.height.compact() - info2.height.compact()
        const diffIndex = info1.index - info2.index
        return diffHeight !== 0 ? diffHeight : diffIndex
      })
    },
    unconfirmedTransactions: (state: WalletState) => {
      return state.unconfirmedTransactions.sort((t1, t2) => {
        // - unconfirmed/partial sorted by index
        return t1.transactionInfo.index - t2.transactionInfo.index
      })
    },
    partialTransactions: (state: WalletState) => {
      return state.partialTransactions.sort((t1, t2) => {
        // - unconfirmed/partial sorted by index
        return t1.transactionInfo.index - t2.transactionInfo.index
      })
    },
    stageOptions: (state: WalletState) => state.stageOptions,
    stagedTransactions: (state: WalletState) => state.stagedTransactions,
    signedTransactions: (state: WalletState) => state.signedTransactions,
    transactionCache: (state: WalletState) => state.transactionCache,
    allTransactions: (state, getters) => {
      return [].concat(
        getters.partialTransactions,
        getters.unconfirmedTransactions,
        getters.confirmedTransactions,
      )
    },
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    currentWallet: (state, walletModel) => Vue.set(state, 'currentWallet', walletModel),
    isCosignatoryMode: (state, mode) => Vue.set(state, 'isCosignatoryMode', mode),
    currentWalletAddress: (state, walletAddress) => Vue.set(state, 'currentWalletAddress', walletAddress),
    currentWalletMosaics: (state, currentWalletMosaics) => Vue.set(state, 'currentWalletMosaics', currentWalletMosaics),
    currentWalletOwnedMosaics: (state, currentWalletOwnedMosaics) => Vue.set(state, 'currentWalletOwnedMosaics', currentWalletOwnedMosaics),
    currentWalletOwnedNamespaces: (state, currentWalletOwnedNamespaces) => Vue.set(state, 'currentWalletOwnedNamespaces', currentWalletOwnedNamespaces),
    currentSigner: (state, signerPayload) => Vue.set(state, 'currentSigner', signerPayload),
    currentSignerAddress: (state, signerAddress) => Vue.set(state, 'currentSignerAddress', signerAddress),
    currentSignerMosaics: (state, currentSignerMosaics) => Vue.set(state, 'currentSignerMosaics', currentSignerMosaics),
    currentSignerOwnedMosaics: (state, currentSignerOwnedMosaics) => Vue.set(state, 'currentSignerOwnedMosaics', currentSignerOwnedMosaics),
    currentSignerOwnedNamespaces: (state, currentSignerOwnedNamespaces) => Vue.set(state, 'currentSignerOwnedNamespaces', currentSignerOwnedNamespaces),
    setKnownWallets: (state, wallets) => Vue.set(state, 'knownWallets', wallets),
    addKnownWalletsInfo: (state, walletInfo) => {
      Vue.set(state.knownWalletsInfo, walletInfo.address.plain(), walletInfo)
    },
    addKnownMultisigInfo: (state, multisigInfo: MultisigAccountInfo) => {
      Vue.set(state.knownMultisigsInfo, multisigInfo.account.address.plain(), multisigInfo)
    },
    setKnownMultisigInfo: (state, payload) => Vue.set(state, 'knownMultisigsInfo', payload),
    transactionHashes: (state, hashes) => Vue.set(state, 'transactionHashes', hashes),
    confirmedTransactions: (state, transactions) => Vue.set(state, 'confirmedTransactions', transactions),
    unconfirmedTransactions: (state, transactions) => Vue.set(state, 'unconfirmedTransactions', transactions),
    partialTransactions: (state, transactions) => Vue.set(state, 'partialTransactions', transactions),
    setSubscriptions: (state, data) => Vue.set(state, 'subscriptions', data),
    addSubscriptions: (state, payload: {address: string, subscriptions: SubscriptionType}) => {
      const {address, subscriptions} = payload
      // skip when subscriptions is an empty array
      if (!subscriptions.subscriptions.length) return
      // get current subscriptions from state
      const oldSubscriptions = state.subscriptions[address] || []
      // update subscriptions
      const newSubscriptions = [ ...oldSubscriptions, subscriptions ]
      // update state
      Vue.set(state.subscriptions, address, newSubscriptions)
    },
    addTransactionToCache: (state, payload): Record<string, Transaction[]> => {
      if (payload === undefined) return
      const {transaction, hash, cacheKey} = payload
      // Get existing cached transactions with the same cache key
      const cachedTransactions = state.transactionCache[cacheKey] || []
      // update state
      Vue.set(state.cachedTransactions, cacheKey, [ ...cachedTransactions, {hash, transaction}])
      // update state
      return state.transactionCache
    },
    stageOptions: (state, options) => Vue.set(state, 'stageOptions', options),
    setStagedTransactions: (state, transactions: Transaction[]) => Vue.set(state, 'stagedTransactions', transactions),
    addStagedTransaction: (state, transaction: Transaction) => {
      // - get previously staged transactions
      const staged = state.stagedTransactions

      // - push transaction on stage (order matters)
      staged.push(transaction)

      // - update state
      return Vue.set(state, 'stagedTransactions', staged)
    },
    clearStagedTransaction: (state) => Vue.set(state, 'stagedTransactions', []),
    addSignedTransaction: (state, transaction: SignedTransaction) => {
      // - get previously signed transactions
      const signed = state.signedTransactions

      // - update state
      signed.push(transaction)
      return Vue.set(state, 'signedTransactions', signed)
    },
    removeSignedTransaction: (state, transaction: SignedTransaction) => {
      // - get previously signed transactions
      const signed = state.signedTransactions

      // - find transaction by hash and delete
      const idx = signed.findIndex(tx => tx.hash === transaction.hash)
      if (undefined === idx) {
        return 
      }

      // skip `idx`
      const remaining = signed.splice(0, idx).concat(
        signed.splice(idx + 1, signed.length - idx - 1),
      )

      // - use Array.from to reset indexes
      return Vue.set(state, 'signedTransactions', Array.from(remaining))
    },
  },
  actions: {
    /**
     * Possible `options` values include:
     * @type {
     *    skipTransactions: boolean,
     *    skipOwnedAssets: boolean,
     *    skipMultisig: boolean,
     * }
     */
    async initialize({ commit, dispatch, getters }, {address, options}) {
      const callback = async () => {
        if (!address || !address.length) {
          return 
        }

        // fetch account info
        await dispatch('REST_FETCH_WALLET_DETAILS', {address, options})

        // open websocket connections
        dispatch('SUBSCRIBE', address)
        commit('setInitialized', true)
      }
      await Lock.initialize(callback, {getters})
    },
    async uninitialize({ commit, dispatch, getters }, {address, which}) {
      const callback = async () => {
        // close websocket connections
        await dispatch('UNSUBSCRIBE', address)
        await dispatch('RESET_BALANCES', which)
        await dispatch('RESET_MULTISIG')
        await dispatch('RESET_TRANSACTIONS')
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {getters})
    },
    /// region scoped actions
    async REST_FETCH_WALLET_DETAILS({dispatch}, {address, options}) {
      const dispatcher = new RESTDispatcher(dispatch)

      // - blocking first action
      dispatcher.add('REST_FETCH_INFO', address, null, true)

      // - other actions are all optional and can be disabled
      if (!options || !options.skipMultisig) {
        dispatcher.add('REST_FETCH_MULTISIG', address)
      }

      if (!options || !options.skipTransactions) {
        dispatch('GET_ALL_TRANSACTIONS',{
          group: 'all',
          pageSize: 100,
          address: address,
        })
      }

      if (!options || !options.skipOwnedAssets) {
        dispatcher.add('REST_FETCH_OWNED_MOSAICS', address)
        dispatcher.add('REST_FETCH_OWNED_NAMESPACES', address)
      }

      // - delays of 1000ms will be added every second request
      dispatcher.throttle_dispatch()
    },
    /**
     * Possible `options` values include:
     * @type {
      *    isCosignatoryMode: boolean,
      * }
      */
    async SET_CURRENT_WALLET({commit, dispatch, getters}, {model}) {
      const previous = getters.currentWallet
      const address: Address = getAddressByPayload(model)
      dispatch('diagnostic/ADD_DEBUG', `Store action wallet/SET_CURRENT_WALLET dispatched with ${address.plain()}`, {root: true})

      // skip if the wallet has not changed
      if (!!previous && previous.values.get('address') === address.plain()) return

      // set current wallet
      commit('currentWallet', model)
      commit('currentWalletAddress', address)

      // reset current wallet mosaics 
      commit('currentWalletMosaics', [])

      // reset current signer
      dispatch('SET_CURRENT_SIGNER', {model, options: {skipDetails: true}})

      if (!!previous) {
        // in normal initialize routine, old active wallet
        // connections must be closed
        await dispatch('uninitialize', {address: previous.values.get('address'), which: 'currentWalletMosaics'})
      }

      await dispatch('initialize', {address: address.plain(), options: {}})
      $eventBus.$emit('onWalletChange', address.plain())
    },
    async RESET_CURRENT_WALLET({commit, dispatch}) {
      dispatch('diagnostic/ADD_DEBUG', 'Store action wallet/RESET_CURRENT_WALLET dispatched', {root: true})
      commit('currentWallet', null)
      commit('currentWalletAddress', null)
    },
    async SET_CURRENT_SIGNER({commit, dispatch, getters}, {model, options}) {
      const address: Address = getAddressByPayload(model)
      dispatch('diagnostic/ADD_DEBUG', `Store action wallet/SET_CURRENT_SIGNER dispatched with ${address.plain()}`, {root: true})

      let payload = model
      if (model instanceof WalletsModel) {
        payload = {
          networkType: address.networkType,
          publicKey: model.values.get('publicKey'),
        }
      }

      // set current signer
      commit('currentSigner', payload)
      commit('currentSignerAddress', address)

      // whether entering in cosignatory mode
      const currentWallet = getters['currentWallet']
      let isCosignatory = false
      if (address.plain() !== currentWallet.values.get('address')) {
        isCosignatory = true
      }

      commit('isCosignatoryMode', isCosignatory)

      // setting current signer should not fetch ALL data
      const detailOpts = {
        skipTransactions: true,
        skipMultisig: true,
        skipOwnedAssets: false,
      }

      if (!options || !options.skipDetails) {
        await dispatch('REST_FETCH_WALLET_DETAILS', {address: address.plain(), options: detailOpts})
      }
    },
    SET_KNOWN_WALLETS({commit}, wallets: string[]) {
      commit('setKnownWallets', wallets)
    },
    RESET_BALANCES({dispatch}, which) {
      if (!which) which = 'currentWalletMosaics'
      dispatch('SET_BALANCES', {which, mosaics: []})
    },
    SET_BALANCES({commit, rootGetters}, {mosaics, which}) {
      // if no mosaics, set the mosaics to 0 networkCurrency for reactivity purposes
      if (!mosaics.length) {
        const networkMosaic = rootGetters['mosaic/networkMosaic']
        const defaultMosaic = new Mosaic(networkMosaic, UInt64.fromUint(0))
        commit(which, [defaultMosaic])
        return
      }

      commit(which, mosaics)
    },
    RESET_SUBSCRIPTIONS({commit}) {
      commit('setSubscriptions', [])
    },
    RESET_TRANSACTIONS({commit}) {
      commit('confirmedTransactions', [])
      commit('unconfirmedTransactions', [])
      commit('partialTransactions', [])
    },
    RESET_MULTISIG({commit}) {
      commit('setKnownMultisigInfo', {})
    },
    ADD_COSIGNATURE({commit, getters}, cosignatureMessage) {
      if (!cosignatureMessage || !cosignatureMessage.parentHash) {
        throw Error('Missing mandatory field \'parentHash\' for action wallet/ADD_COSIGNATURE.')
      }

      const transactions = getters['partialTransactions']

      // return if no transactions
      if (!transactions.length) return

      const index = transactions.findIndex(t => t.transactionInfo.hash === cosignatureMessage.parentHash)

      // partial tx unknown, @TODO: handle this case (fetch partials)
      if (index === -1) return

      transactions[index] = transactions[index].addCosignatures(cosignatureMessage)
      commit('partialTransactions', transactions)
    },
    async GET_ALL_TRANSACTIONS({dispatch},{address,pageSize,group}){
      if (!pageSize) {
        pageSize = 100
      }

      dispatch('app/SET_FETCHING_TRANSACTIONS', true, { root: true })
      try {
        if (group == 'all') {
          await Promise.all([
            dispatch('REST_FETCH_TRANSACTIONS', {
              group: 'confirmed',
              pageSize: pageSize,
              address: address,
            }),
            dispatch('REST_FETCH_TRANSACTIONS', {
              group: 'unconfirmed',
              pageSize: pageSize,
              address: address,
            }),
            dispatch('REST_FETCH_TRANSACTIONS', {
              group: 'partial',
              pageSize: pageSize,
              address: address,
            }),
          ])
        } else {
          await dispatch('REST_FETCH_TRANSACTIONS', {
            group: group,
            pageSize: pageSize,
            address: address,
          })
        }
      } finally {
        dispatch('app/SET_FETCHING_TRANSACTIONS', false, { root: true })
      }
      
    },
    ADD_TRANSACTION({commit, getters}, transactionMessage) {
      if (!transactionMessage || !transactionMessage.group) {
        throw Error('Missing mandatory field \'group\' for action wallet/ADD_TRANSACTION.')
      }

      // format transactionGroup to store variable name
      const transactionGroup = transactionGroupToStateVariable(transactionMessage.group)

      // if transaction hash is known, do nothing
      const hashes = getters['transactionHashes']
      const transaction = transactionMessage.transaction
      const findIterator = hashes.find(hash => hash === transaction.transactionInfo.hash)

      // register transaction
      const transactions = getters[transactionGroup]
      const findTx = transactions.find(t => t.transactionInfo.hash === transaction.transactionInfo.hash)
      if (findTx === undefined) {
        transactions.push(transaction)
      }

      if (findIterator === undefined) {
        hashes.push(transaction.transactionInfo.hash)
      }

      // update state
      // commit('addTransactionToCache', {hash: transaction.transactionInfo.hash, transaction})
      commit(transactionGroup, transactions)
      return commit('transactionHashes', hashes)
    },
    REMOVE_TRANSACTION({commit, getters}, transactionMessage) {

      if (!transactionMessage || !transactionMessage.group) {
        throw Error('Missing mandatory field \'group\' for action wallet/removeTransaction.')
      }

      // format transactionGroup to store variable name
      const transactionGroup = transactionGroupToStateVariable(transactionMessage.group)

      // read from store
      const transactions = getters[transactionGroup]

      // prepare search
      const transactionHash = transactionMessage.transaction

      // find transaction in storage
      const findIterator = transactions.findIndex(tx => tx.transactionInfo.hash === transactionHash)
      if (findIterator === undefined) {
        return // not found, do nothing
      }

      // commit empty array
      if (transactions.length === 1) {
        return commit(transactionGroup, [])
      }

      // skip `idx`
      const remaining = transactions.splice(0, findIterator).concat(
        transactions.splice(findIterator + 1, transactions.length - findIterator - 1),
      )

      commit(transactionGroup, Array.from(remaining))
    },
    ADD_STAGED_TRANSACTION({commit}, stagedTransaction: Transaction) {
      commit('addStagedTransaction', stagedTransaction)
    },
    CLEAR_STAGED_TRANSACTIONS({commit}) {
      commit('clearStagedTransaction')
    },
    RESET_TRANSACTION_STAGE({commit}) {
      commit('setStagedTransactions', [])
    },
    /**
 * Websocket API
 */
    // Subscribe to latest account transactions.
    async SUBSCRIBE({ commit, dispatch, rootGetters }, address) {
      if (!address || !address.length) {
        return 
      }

      // use RESTService to open websocket channel subscriptions
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
      const subscriptions: SubscriptionType = await RESTService.subscribeTransactionChannels(
        {commit, dispatch},
        repositoryFactory,
        address,
      )

      // update state of listeners & subscriptions
      commit('addSubscriptions', {address, subscriptions})
    },

    // Unsubscribe from all open websocket connections
    async UNSUBSCRIBE({ dispatch, getters }, address) {
      const subscriptions = getters.getSubscriptions
      const currentWallet = getters.currentWallet

      if (!address) {
        address = currentWallet.values.get('address')
      }

      const subsByAddress = subscriptions && subscriptions[address] ? subscriptions[address] : []
      for (let i = 0, m = subsByAddress.length; i < m; i ++) {
        const subscription = subsByAddress[i]

        // subscribers
        for (let j = 0, n = subscription.subscriptions; j < n; j ++) {
          await subscription.subscriptions[j].unsubscribe()
        }

        await subscription.listener.close()
      }

      // update state
      dispatch('RESET_SUBSCRIPTIONS', address)
    },
    /**
 * REST API
 */
    async REST_FETCH_TRANSACTIONS({dispatch, rootGetters}, {group, address, id}) {
      

      if (!group || ![ 'partial', 'unconfirmed', 'confirmed' ].includes(group)) {
        group = 'confirmed'
      }

      if (!address || address.length !== 40) {
        return 
      }

      dispatch(
        'diagnostic/ADD_DEBUG',
        `Store action wallet/REST_FETCH_TRANSACTIONS dispatched with : ${JSON.stringify({address: address, group})}`,
        {root: true},
      )

      try {
        // prepare REST parameters
        const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
        const queryParams = new QueryParams({ pageSize: 100, id })
        const addressObject = Address.createFromRawAddress(address)

        // fetch transactions from REST gateway
        const accountHttp = repositoryFactory.createAccountRepository()
        let transactions: Transaction[] = []
        const blockHeights: number[] = []

        if ('confirmed' === group) {
          transactions = await accountHttp.getAccountTransactions(addressObject, queryParams).toPromise()
          // - record block height to be fetched
          transactions.map(transaction => blockHeights.push(transaction.transactionInfo.height.compact()))
        }
        else if ('unconfirmed' === group)
        {transactions = await accountHttp.getAccountUnconfirmedTransactions(addressObject, queryParams).toPromise()}
        else if ('partial' === group)
        {transactions = await accountHttp.getAccountPartialTransactions(addressObject, queryParams).toPromise()}

        dispatch('diagnostic/ADD_DEBUG', `Store action wallet/REST_FETCH_TRANSACTIONS numTransactions: ${transactions.length}`, {root: true})

        // update store
        for (let i = 0, m = transactions.length; i < m; i ++) {
          const transaction = transactions[i]
          await dispatch('ADD_TRANSACTION', { address, group, transaction })
        }

        // fetch block information if necessary
        if (blockHeights.length) {
          // - non-blocking
          dispatch('network/REST_FETCH_BLOCKS', blockHeights, {root: true})
        }

        return transactions
      }
      catch (e) {
        dispatch('diagnostic/ADD_ERROR', `An error happened while trying to fetch transactions: ${e}`, {root: true})
        return false
      } 
    },
    async REST_FETCH_BALANCES({dispatch}, address) {
      if (!address || address.length !== 40) {
        return 
      }

      dispatch('diagnostic/ADD_DEBUG', `Store action wallet/REST_FETCH_BALANCES dispatched with : ${address}`, {root: true})
      try {
        const accountInfo = await dispatch('REST_FETCH_INFO', address)
        return accountInfo.mosaics
      }
      catch(e) {
        return []
      }
    },
    async REST_FETCH_INFO({commit, dispatch, getters, rootGetters}, address) {
      if (!address || address.length !== 40) {
        return 
      }

      dispatch('diagnostic/ADD_DEBUG', `Store action wallet/REST_FETCH_INFO dispatched with : ${JSON.stringify({address: address})}`, {root: true})

      const currentWallet = getters.currentWallet
      const currentSigner = getters.currentSigner
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory

      try {
        // prepare REST parameters
        const addressObject = Address.createFromRawAddress(address)

        // fetch account info from REST gateway
        const accountHttp = repositoryFactory.createAccountRepository()
        const accountInfo = await accountHttp.getAccountInfo(addressObject).toPromise()
        commit('addKnownWalletsInfo', accountInfo)

        // update current wallet state if necessary
        if (currentWallet && address === getters.currentWalletAddress.plain()) {
          dispatch('SET_BALANCES', {mosaics: accountInfo.mosaics, which: 'currentWalletMosaics'})
        }
        // update current signer state if not current wallet
        else if (currentSigner && address === getters.currentSignerAddress.plain()) {
          dispatch('SET_BALANCES', {mosaics: accountInfo.mosaics, which: 'currentSignerMosaics'})
        }

        return accountInfo
      }
      catch (e) {
        if (!!currentWallet && address === getters.currentWalletAddress.plain()) {
          dispatch('SET_BALANCES', {mosaics: [], which: 'currentWalletMosaics'})
        }
        else if (!!getters.currentSigner && address === getters.currentSignerAddress.plain()) {
          dispatch('SET_BALANCES', {mosaics: [], which: 'currentSignerMosaics'})
        }

        dispatch('diagnostic/ADD_ERROR', `An error happened while trying to fetch account information: ${e}`, {root: true})
        return false
      }
    },
    async REST_FETCH_INFOS({commit, dispatch, getters, rootGetters}, addresses: Address[]): Promise<AccountInfo[]> {
      dispatch(
        'diagnostic/ADD_DEBUG',
        `Store action wallet/REST_FETCH_INFOS dispatched with : ${JSON.stringify(addresses.map(a => a.plain()))}`,
        {root: true},
      )

      // read store
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory

      try {
        // fetch account info from REST gateway
        const accountHttp = repositoryFactory.createAccountRepository()
        const accountsInfo = await accountHttp.getAccountsInfo(addresses).toPromise()

        // add accounts to the store
        accountsInfo.forEach(info => commit('addKnownWalletsInfo', info))

        // if no current wallet address is available, skip and return accountsInfo
        // (used in account import process)
        if (!getters.currentWalletAddress) return accountsInfo

        // set current wallet info
        const currentWalletInfo = accountsInfo.find(
          info => info.address.equals(getters.currentWalletAddress),
        )

        if (currentWalletInfo !== undefined) {
          dispatch('SET_BALANCES', {mosaics: currentWalletInfo.mosaics, which: 'currentWalletMosaics'})
        }

        // .. or set current signer info
        const currentSignerInfo = accountsInfo.find(
          info => info.address.equals(getters.currentSignerAddress),
        )

        if (currentSignerInfo !== undefined) {
          dispatch('SET_BALANCES', {mosaics: currentWalletInfo.mosaics, which: 'currentSignerMosaics'})
        }

        // return accounts info
        return accountsInfo
      }
      catch (e) {
        dispatch('diagnostic/ADD_ERROR', `An error happened while trying to fetch accounts information: ${e}`, {root: true})
        throw new Error(e)
      }
    },
    async REST_FETCH_MULTISIG({commit, dispatch, rootGetters}, address): Promise<void> {
      if (!address || address.length !== 40) {
        return 
      }

      dispatch('diagnostic/ADD_DEBUG', `Store action wallet/REST_FETCH_MULTISIG dispatched with : ${address}`, {root: true})

      // read store
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory

      try {
        // prepare REST parameters
        const addressObject = Address.createFromRawAddress(address)

        // fetch multisig graph info from REST gateway
        const multisigHttp = repositoryFactory.createMultisigRepository()
        const multisigGraphInfo = await multisigHttp.getMultisigAccountGraphInfo(addressObject).toPromise()

        // extract all available multisigInfo from multisigGraphInfo
        const multisigsInfo = MultisigService.getMultisigInfoFromMultisigGraphInfo(multisigGraphInfo)

        // store multisig info
        multisigsInfo.forEach(multisigInfo => commit('addKnownMultisigInfo', multisigInfo))
      }
      catch (e) {
        dispatch('diagnostic/ADD_ERROR', `An error happened while trying to fetch multisig information: ${e}`, {root: true})
        return 
      }
    },
    async REST_FETCH_OWNED_MOSAICS(
      {commit, dispatch, getters, rootGetters},
      address,
    ): Promise<MosaicInfo[]> {
      if (!address || address.length !== 40) return

      dispatch('diagnostic/ADD_DEBUG', `Store action wallet/REST_FETCH_OWNED_MOSAICS dispatched with : ${address}`, {root: true})

      // read store
      const currentWallet = getters['currentWallet']
      const currentSigner = getters['currentSigner']
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory

      try {
        // prepare REST parameters
        const addressObject = Address.createFromRawAddress(address)

        // fetch account info from REST gateway
        const mosaicHttp = repositoryFactory.createMosaicRepository()
        const ownedMosaics = await mosaicHttp.getMosaicsFromAccount(addressObject).toPromise()

        // store multisig info
        if (currentWallet && address === currentWallet.values.get('address')) {
          commit('currentWalletOwnedMosaics', ownedMosaics)
        }
        else if (currentSigner && address === getters.currentSignerAddress.plain()) {
          commit('currentSignerOwnedMosaics', ownedMosaics)
        }

        return ownedMosaics
      }
      catch (e) {
        if (currentWallet && currentWallet.values.get('address') === address) {
          commit('currentWalletOwnedMosaics', [])
        }
        else if (currentSigner && address === getters.currentSignerAddress.plain()) {
          commit('currentSignerOwnedMosaics', [])
        }

        dispatch('diagnostic/ADD_ERROR', `An error happened while trying to fetch owned mosaics: ${e}`, {root: true})
        return null
      }
    },
    async REST_FETCH_OWNED_NAMESPACES({commit, dispatch, getters, rootGetters}, address): Promise<NamespaceInfo[]> {
      // @TODO: This method should be called by NamespaceService, like NamespaceService.fetchNamespaceInfo
      // To be fixed that along with "Owned" namespaces getters (see below)
      if (!address || address.length !== 40) {
        return 
      }

      dispatch('diagnostic/ADD_DEBUG', `Store action wallet/REST_FETCH_OWNED_NAMESPACES dispatched with : ${address}`, {root: true})

      // read store
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
      const currentWallet = getters['currentWallet']
      const currentSigner = getters['currentSigner']

      try {
        // prepare REST parameters
        const addressObject = Address.createFromRawAddress(address)

        // fetch account info from REST gateway
        const namespaceHttp = repositoryFactory.createNamespaceRepository()

        // @TODO: Handle more than 100 namespaces
        const ownedNamespaces = await namespaceHttp.getNamespacesFromAccount(
          addressObject, new QueryParams({pageSize: 100, order: Order.ASC}),
        ).toPromise()

        // update namespaces in database
        new NamespaceService(this).updateNamespaces(ownedNamespaces)

        // update namespaces info in the store
        dispatch('namespace/ADD_NAMESPACE_INFOS', ownedNamespaces, { root: true })

        // store multisig info
        // @TODO: all namespaces should be stored in the same object
        // "Owned" namespaces should be returned from it with a filter on the owner property 
        if (currentWallet && currentWallet.values.get('address') === address) {
          commit('currentWalletOwnedNamespaces', ownedNamespaces)
        }
        else if (currentSigner && address === getters.currentSignerAddress.plain()) {
          commit('currentSignerOwnedNamespaces', ownedNamespaces)
        }

        return ownedNamespaces
      }
      catch (e) {
        if (currentWallet && currentWallet.values.get('address') === address) {
          commit('currentWalletOwnedNamespaces', [])
        }
        else if (currentSigner && address === getters.currentSignerAddress.plain()) {
          commit('currentSignerOwnedNamespaces', [])
        }

        dispatch('diagnostic/ADD_ERROR', `An error happened while trying to fetch owned namespaces: ${e}`, {root: true})
        return null
      }
    },
    async REST_ANNOUNCE_PARTIAL(
      {commit, dispatch, rootGetters},
      {issuer, signedLock, signedPartial},
    ): Promise<BroadcastResult> {

      if (!issuer || issuer.length !== 40) {
        return 
      }

      dispatch('diagnostic/ADD_DEBUG', `Store action wallet/REST_ANNOUNCE_PARTIAL dispatched with: ${JSON.stringify({
        issuer: issuer,
        signedLockHash: signedLock.hash,
        signedPartialHash: signedPartial.hash,
      })}`, {root: true})

      try {
        // - prepare REST parameters
        const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
        const transactionHttp = repositoryFactory.createTransactionRepository()

        // - prepare scoped *confirmation listener*
        const listener = repositoryFactory.createListener()
        await listener.open()


        // - announce hash lock transaction and await confirmation
        transactionHttp.announce(signedLock)

        // - listen for hash lock confirmation
        return new Promise((resolve, reject) => {
          const address = Address.createFromRawAddress(issuer)
          return listener.confirmed(address).subscribe(
            async () => {
              // - hash lock confirmed, now announce partial
              await transactionHttp.announceAggregateBonded(signedPartial)
              commit('removeSignedTransaction', signedLock)
              commit('removeSignedTransaction', signedPartial)
              return resolve(new BroadcastResult(signedPartial, true))
            },
            () => {
              commit('removeSignedTransaction', signedLock)
              commit('removeSignedTransaction', signedPartial)
              reject(new BroadcastResult(signedPartial, false))
            },
          )
        })
      }
      catch(e) {
        return new BroadcastResult(signedPartial, false, e.toString())
      }
    },
    async REST_ANNOUNCE_TRANSACTION(
      {commit, dispatch, rootGetters},
      signedTransaction: SignedTransaction,
    ): Promise<BroadcastResult> {
      dispatch('diagnostic/ADD_DEBUG', `Store action wallet/REST_ANNOUNCE_TRANSACTION dispatched with: ${JSON.stringify({
        hash: signedTransaction.hash,
        payload: signedTransaction.payload,
      })}`, {root: true})

      try {
        // prepare REST parameters
        const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
        const transactionHttp = repositoryFactory.createTransactionRepository()

        // prepare symbol-sdk TransactionService
        await transactionHttp.announce(signedTransaction)
        commit('removeSignedTransaction', signedTransaction)
        return new BroadcastResult(signedTransaction, true)
      }
      catch(e) {
        commit('removeSignedTransaction', signedTransaction)
        return new BroadcastResult(signedTransaction, false, e.toString())
      }
    },
    async REST_ANNOUNCE_COSIGNATURE(
      {dispatch, rootGetters},
      cosignature: CosignatureSignedTransaction,
    ): Promise<BroadcastResult> {

      dispatch('diagnostic/ADD_DEBUG', `Store action wallet/REST_ANNOUNCE_COSIGNATURE dispatched with: ${JSON.stringify({
        hash: cosignature.parentHash,
        signature: cosignature.signature,
        signerPublicKey: cosignature.signerPublicKey,
      })}`, {root: true})

      try {
        // prepare REST parameters
        const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
        const transactionHttp = repositoryFactory.createTransactionRepository()

        // prepare symbol-sdk TransactionService
        await transactionHttp.announceAggregateBondedCosignature(cosignature)
        return new BroadcastResult(cosignature, true)
      }
      catch(e) {
        return new BroadcastResult(cosignature, false, e.toString())
      }
    },
    ON_NEW_TRANSACTION({dispatch, rootGetters}, transaction: Transaction): void {
      if (!transaction) return

      // get current wallet address from store
      const address: Address = rootGetters['wallet/currentWalletAddress']
      if (!address) return
      const plainAddress = address.plain()

      // instantiate a dispatcher
      const dispatcher = new RESTDispatcher(dispatch)

      // always refresh wallet balances
      dispatcher.add('REST_FETCH_INFO', plainAddress)

      // extract transaction types from the transaction
      const transactionTypes: TransactionType[] = transaction instanceof AggregateTransaction
        ? transaction.innerTransactions
          .map(({type}) => type)
          .filter((el, i, a) => i === a.indexOf(el))
        : [transaction.type]

      // add actions to the dispatcher according to the transaction types
      if ([
        TransactionType.NAMESPACE_REGISTRATION,
        TransactionType.MOSAIC_ALIAS,
        TransactionType.ADDRESS_ALIAS,
      ].some(a => transactionTypes.some(b => b === a))) {
        dispatcher.add('REST_FETCH_OWNED_NAMESPACES', plainAddress)
      }

      if ([
        TransactionType.MOSAIC_DEFINITION,
        TransactionType.MOSAIC_SUPPLY_CHANGE,
      ].some(a => transactionTypes.some(b => b === a))) {
        dispatcher.add('REST_FETCH_OWNED_MOSAICS', plainAddress)
      }

      if (transactionTypes.includes(TransactionType.MULTISIG_ACCOUNT_MODIFICATION)) {
        dispatcher.add('REST_FETCH_MULTISIG', plainAddress)
      }

      // dispatch actions
      dispatcher.throttle_dispatch()
    },
    /// end-region scoped actions
  },
}
