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
import Vue from 'vue';
import {
  Address,
  NamespaceInfo,
  QueryParams,
  Listener,
  Transaction,
  SignedTransaction,
  TransactionService,
  AggregateTransaction,
} from 'nem2-sdk'
import {Subscription, Observable, from} from 'rxjs'
import {map} from 'rxjs/operators'

// internal dependencies
import {$eventBus} from '../events'
import {RESTService} from '@/services/RESTService'
import {AwaitLock} from './AwaitLock';
import {BroadcastResult} from '@/core/transactions/BroadcastResult';
import {WalletsModel} from '@/core/database/entities/WalletsModel'

/**
 * Helper to format transaction group in name of state variable.
 *
 * @internal
 * @param {string} group 
 * @return {string} One of 'confirmedTransactions', 'unconfirmedTransactions' or 'partialTransactions'
 */
const transactionGroupToStateVariable = (
  group: string
): string => {
  let transactionGroup = group.toLowerCase();
  if (transactionGroup === 'unconfirmed'
      || transactionGroup === 'confirmed'
      || transactionGroup === 'partial') {
    transactionGroup = transactionGroup + 'Transactions'
  }
  else {
    throw new Error('Unknown transaction group \'' + group + '\'.')
  }

  return transactionGroup
}

/// region globals
const Lock = AwaitLock.create();
/// end-region globals

/**
 * Type SubscriptionType for Wallet Store
 * @type {SubscriptionType}
 */
type SubscriptionType = {
  listener: Listener,
  subscriptions: Subscription[]
}

/**
 * Type PartialTransactionAnnouncementPayloadType for Wallet Store 
 * @type {PartialTransactionAnnouncementPayloadType}
 */
type PartialTransactionAnnouncementPayloadType = {
  signedLock: SignedTransaction,
  signedPartial: SignedTransaction,
}

/**
 * Wallet Store
 */
export default {
  namespaced: true,
  state: {
    initialized: false,
    currentWallet: '',
    currentWalletAddress: null,
    currentWalletInfo: null,
    currentWalletMosaics: [],
    currentMultisigInfo: null,
    currentWalletOwnedMosaics: [],
    currentWalletOwnedNamespaces: [],
    knownWallets: [],
    otherWalletsInfo: {},
    otherMultisigsInfo: {},
    allTransactions: [],
    transactionHashes: [],
    confirmedTransactions: [],
    unconfirmedTransactions: [],
    partialTransactions: [],
    stagedTransactions: [],
    signedTransactions: [],
    transactionCache: {},
    // Subscriptions to websocket channels.
    subscriptions: [],
  },
  getters: {
    getInitialized: state => state.initialized,
    currentWallet: state => state.currentWallet,
    currentWalletAddress: state => state.currentWalletAddress,
    currentWalletInfo: state => state.currentWalletInfo,
    currentWalletMosaics: state => state.currentWalletMosaics,
    currentWalletOwnedMosaics: state => state.currentWalletOwnedMosaics,
    currentWalletOwnedNamespaces: state => state.currentWalletOwnedNamespaces,
    currentMultisigInfo: state => state.currentMultisigInfo,
    knownWallets: state => state.knownWallets,
    otherWalletsInfo: state => state.otherWalletsInfo,
    otherMultisigsInfo: state => state.otherMultisigsInfo,
    getSubscriptions: state => state.subscriptions,
    transactionHashes: state => state.transactionHashes,
    confirmedTransactions: state => {
      return state.confirmedTransactions.sort((t1, t2) => {
        const info1 = t1.transactionInfo
        const info2 = t2.transactionInfo

        // - confirmed sorted by height then index
        const diffHeight = info1.height.compact() - info2.height.compact()
        const diffIndex = info1.index - info2.index
        return diffHeight !== 0 ? diffHeight : diffIndex
      })
    },
    unconfirmedTransactions: state => {
      return state.unconfirmedTransactions.sort((t1, t2) => {
        const info1 = t1.transactionInfo
        const info2 = t2.transactionInfo
     
        // - unconfirmed/partial sorted by index
        return t1.transactionInfo.index - t2.transactionInfo.index
      })
    },
    partialTransactions: state => {
      return state.partialTransactions.sort((t1, t2) => {
        const info1 = t1.transactionInfo
        const info2 = t2.transactionInfo
     
        // - unconfirmed/partial sorted by index
        return t1.transactionInfo.index - t2.transactionInfo.index
      })
    },
    stagedTransactions: state => state.stagedTransactions,
    signedTransactions: state => state.signedTransactions,
    transactionCache: state => state.transactionCache,
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
    currentWallet: (state, walletName) => Vue.set(state, 'currentWallet', walletName),
    currentWalletAddress: (state, walletAddress) => Vue.set(state, 'currentWalletAddress', walletAddress),
    currentWalletInfo: (state, currentWalletInfo) => Vue.set(state, 'currentWalletInfo', currentWalletInfo),
    currentWalletMosaics: (state, currentWalletMosaics) => Vue.set(state, 'currentWalletMosaics', currentWalletMosaics),
    currentWalletOwnedMosaics: (state, currentWalletOwnedMosaics) => Vue.set(state, 'currentWalletOwnedMosaics', currentWalletOwnedMosaics),
    currentWalletOwnedNamespaces: (state, currentWalletOwnedNamespaces) => Vue.set(state, 'currentWalletOwnedNamespaces', currentWalletOwnedNamespaces),
    setKnownWallets: (state, wallets) => Vue.set(state, 'knownWallets', wallets),
    addWalletInfo: (state, walletInfo) => {
      // update storage
      let wallets = state.otherWalletsInfo
      wallets[walletInfo.address.plain()] = walletInfo

      // update state
      Vue.set(state, 'otherWalletsInfo', wallets)
    },
    addOtherMultisigInfo: (state, multisigInfo) => {
      // update storage
      let wallets = state.otherMultisigsInfo
      wallets[multisigInfo.address.plain()] = multisigInfo

      // update state
      Vue.set(state, 'otherMultisigsInfo', wallets)
    },
    setMultisigInfo: (state, multisigInfo) => Vue.set(state, 'currentMultisigInfo', multisigInfo),
    transactionHashes: (state, hashes) => Vue.set(state, 'transactionHashes', hashes),
    confirmedTransactions: (state, transactions) => Vue.set(state, 'confirmedTransactions', transactions),
    unconfirmedTransactions: (state, transactions) => Vue.set(state, 'unconfirmedTransactions', transactions),
    partialTransactions: (state, transactions) => Vue.set(state, 'partialTransactions', transactions),
    setSubscriptions: (state, data) => Vue.set(state, 'subscriptions', data),
    addSubscriptions: (state, payload) => {
      if (payload && payload.length) {
        const subscriptions = state.subscriptions
        subscriptions.push(payload)

        Vue.set(state, 'subscriptions', subscriptions)
      }
    },
    addTransactionToCache: (state, payload) => {
      if (payload === undefined) {
        return ;
      }

      // if unknown cache key, JiT creation of collection
      const key  = payload.cacheKey
      const cache = state.transactionCache
      if (! cache.hasOwnProperty(key)) {
        cache[key] = []
      }

      // add transaction to cache
      const hash  = payload.hash
      cache[key].push({hash, transaction: payload.transaction})

      // update state
      Vue.set(state, 'transactionCache', cache)
      return cache
    },
    setStagedTransactions: (state, transactions: Transaction[]) => Vue.set(state, 'stagedTransactions', transactions),
    addStagedTransaction: (state, transaction: Transaction) => {
      // - get previously staged transactions
      const staged = state.stagedTransactions

      // - push transaction on stage (order matters)
      staged.push(transaction)

      // - update state
      return Vue.set(state, 'stagedTransactions', staged)
    },
    addSignedTransaction: (state, transaction: SignedTransaction) => {
      // - get previously signed transactions
      const signed = state.signedTransactions
      const staged = state.stagedTransactions

      // - update state
      signed.push(transaction)
      return Vue.set(state, 'signedTransactions', signed)
    },
    removeSignedTransaction: (state, transaction: SignedTransaction) => {
      // - get previously signed transactions
      const signed = state.signedTransactions

      // - find transaction by hash and delete
      const findIndex = signed.findIndex(tx => tx.hash === transaction.hash)
      if (undefined !== findIndex) {
        delete signed[findIndex]
      }

      // - use Array.from to reset indexes
      return Vue.set(state, 'signedTransactions', Array.from(signed))
    },
  },
  actions: {
    async initialize({ commit, dispatch, getters }, address) {
      const callback = async () => {
        if (!address || !address.length) {
            return ;
        }

        // fetch account info
        try { await dispatch('REST_FETCH_INFO', address) } catch (e) {}
        try { await dispatch('REST_FETCH_TRANSACTIONS', {
          group: 'confirmed',
          pageSize: 100,
          address: address,
        }) } catch(e) {}

        // open websocket connections
        dispatch('SUBSCRIBE', address)
        commit('setInitialized', true)
      }
      await Lock.initialize(callback, {commit, dispatch, getters})
    },
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => {
        // close websocket connections
        await dispatch('UNSUBSCRIBE')
        await dispatch('RESET_BALANCES')
        await dispatch('RESET_TRANSACTIONS')
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {commit, dispatch, getters})
    },
/// region scoped actions
    async SET_CURRENT_WALLET({commit, dispatch}, currentWalletModel) {
      // fetchDatabase()

      // const currentWallet = walletsRepository.read(walletId)
      commit('currentWallet', currentWalletModel)

      const address = Address.createFromRawAddress(currentWalletModel.values.get('address'))
      commit('currentWalletAddress', address)

      dispatch('diagnostic/ADD_DEBUG', 'Changing current wallet to ' + address.plain(), {root: true})

      // reset store + re-initialize
      await dispatch('uninitialize')
      await dispatch('initialize', address.plain())
      $eventBus.$emit('onWalletChange', address.plain())
    },
    SET_KNOWN_WALLETS({commit}, wallets) {
      commit('setKnownWallets', wallets)
    },
    RESET_BALANCES({dispatch}) {
      dispatch('SET_BALANCES', [])
    },
    SET_BALANCES({commit}, mosaics) {
      commit('currentWalletMosaics', mosaics.length ? mosaics : [])
    },
    RESET_SUBSCRIPTIONS({commit}) {
      commit('setSubscriptions', [])
    },
    RESET_TRANSACTIONS({commit}) {
      commit('confirmedTransactions', [])
      commit('unconfirmedTransactions', [])
      commit('partialTransactions', [])
    },
    ADD_TRANSACTION({commit, dispatch, getters}, transactionMessage) {

      if (!transactionMessage || !transactionMessage.group) {
        throw Error('Missing mandatory field \'group\' for action wallet/addTransaction.')
      }

      const message = 'Adding transaction to ' + transactionMessage.group + ' Type: ' + transactionMessage.transaction.type
      dispatch('diagnostic/ADD_DEBUG', message, {root: true})

      // format transactionGroup to store variable name
      let transactionGroup = transactionGroupToStateVariable(transactionMessage.group);

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
      //commit('addTransactionToCache', {hash: transaction.transactionInfo.hash, transaction})
      commit(transactionGroup, transactions)
      return commit('transactionHashes', hashes)
    },
    REMOVE_TRANSACTION({commit, getters}, transactionMessage) {
      if (!transactionMessage || !transactionMessage.group) {
        throw Error('Missing mandatory field \'group\' for action wallet/removeTransaction.')
      }

      // format transactionGroup to store variable name
      let transactionGroup = transactionGroupToStateVariable(transactionMessage.group);

      // read from store
      const hashes = getters['transactionHashes']
      const transactions = getters[transactionGroup]

      // prepare search
      const transaction = transactionMessage.transaction
      const transactionHash = transaction.meta.hash

      // find transaction in storage
      const findHashIt = hashes.find(hash => hash === transactionHash)
      const findIterator = transactions.find(tx => tx.meta.hash === transactionHash)
      if (findIterator === undefined) {
        return ; // not found, do nothing
      }

      // remove transaction
      delete transactions[findIterator]
      delete hashes[findHashIt]
      commit(transactionGroup, transactions)
      return commit('transactionHashes', hashes)
    },
    ADD_STAGED_TRANSACTION({commit}, stagedTransaction: Transaction) {
      commit('addStagedTransaction', stagedTransaction)
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
        return ;
      }

      // use RESTService to open websocket channel subscriptions
      const websocketUrl = rootGetters['network/wsEndpoint']
      const subscriptions: SubscriptionType  = await RESTService.subscribeTransactionChannels(
        {commit, dispatch},
        websocketUrl,
        address,
      )

      // update state of listeners & subscriptions
      commit('addSubscriptions', subscriptions)
    },

    // Unsubscribe from all open websocket connections
    UNSUBSCRIBE({ dispatch, getters }) {
      const subscriptions = getters.getSubscriptions
      subscriptions.map((subscription: SubscriptionType) => {
        // unsubscribe channels
        subscription.subscriptions.map(sub => sub.unsubscribe())

        // close listener
        subscription.listener.close()
      })

      // update state
      dispatch('RESET_SUBSCRIPTIONS')
    },
/**
 * REST API
 */
    async REST_FETCH_TRANSACTIONS({dispatch, getters, rootGetters}, {group, address, pageSize, id}) {
      if (!group || ! ['partial', 'unconfirmed', 'confirmed'].includes(group)) {
        group = 'confirmed'
      }

      if (!address || address.length !== 40) {
        return ;
      }

      dispatch('diagnostic/ADD_DEBUG', 'Store action wallet/REST_FETCH_TRANSACTIONS dispatched with : ' + JSON.stringify({address: address, group}), {root: true})

      try {
        // prepare REST parameters
        const currentPeer = rootGetters['network/currentPeer'].url
        const queryParams = new QueryParams(pageSize, id)
        const addressObject = Address.createFromRawAddress(address)

        // fetch transactions from REST gateway
        const accountHttp = RESTService.create('AccountHttp', currentPeer)
        let transactions: Transaction[] = []
        let blockHeights: number[] = []

        if ('confirmed' === group) {
          transactions = await accountHttp.getAccountTransactions(addressObject, queryParams).toPromise()
          // - record block height to be fetched
          transactions.map(transaction => blockHeights.push(transaction.transactionInfo.height.compact()))
        }
        else if ('unconfirmed' === group)
          transactions = await accountHttp.getAccountUnconfirmedTransactions(addressObject, queryParams).toPromise()
        else if ('partial' === group)
          transactions = await accountHttp.getAccountPartialTransactions(addressObject, queryParams).toPromise()

        dispatch('diagnostic/ADD_DEBUG', 'Store action wallet/REST_FETCH_TRANSACTIONS numTransactions: ' + transactions.length, {root: true})

        // update store
        for (let i = 0, m = transactions.length; i < m; i++) {
          const transaction = transactions[i]
          await dispatch('ADD_TRANSACTION', { address, group, transaction })
        }

        // fetch block informations if necessary
        if (blockHeights.length) {
          // - non-blocking
          dispatch('network/REST_FETCH_BLOCKS', blockHeights, {root: true})
        }

        return transactions
      }
      catch (e) {
        dispatch('diagnostic/ADD_ERROR', 'An error happened while trying to fetch transactions: ' + e, {root: true})
        return false
      }
    },
    async REST_FETCH_BALANCES({dispatch}, address) {
      if (!address || address.length !== 40) {
        return ;
      }

      dispatch('diagnostic/ADD_DEBUG', 'Store action wallet/REST_FETCH_BALANCES dispatched with : ' + address, {root: true})
      try {
        const accountInfo = await dispatch('REST_FETCH_INFO', address)
        return accountInfo.mosaics
      }
      catch(e) {}
      return []
    },
    async REST_FETCH_INFO({commit, dispatch, getters, rootGetters}, address) {
      if (!address || address.length !== 40) {
        return ;
      }

      dispatch('diagnostic/ADD_DEBUG', 'Store action wallet/REST_FETCH_INFO dispatched with : ' + JSON.stringify({address: address}), {root: true})

      try {
        // prepare REST parameters
        const currentPeer = rootGetters['network/currentPeer'].url
        const addressObject = Address.createFromRawAddress(address)

        // fetch account info from REST gateway
        const accountHttp = RESTService.create('AccountHttp', currentPeer)

        return accountHttp.getAccountInfo(addressObject).subscribe((accountInfo) => {

          commit('addWalletInfo', accountInfo)

          // update current wallet state if necessary
          if (address === getters.currentWalletAddress.plain()) {
            commit('currentWalletInfo', accountInfo)
            dispatch('SET_BALANCES', accountInfo.mosaics)
          }

          return accountInfo
        }, () => {
          dispatch('SET_BALANCES', [])
        })
      }
      catch (e) {
        dispatch('diagnostic/ADD_ERROR', 'An error happened while trying to fetch account information: ' + e, {root: true})
        return false
      }
    },
    async REST_FETCH_INFOS({commit, dispatch, getters, rootGetters}, addresses) {

      dispatch('diagnostic/ADD_DEBUG', 'Store action wallet/REST_FETCH_INFOS dispatched with : ' + JSON.stringify(addresses.map(a => a.plain())), {root: true})

      try {
        // prepare REST parameters
        const currentPeer = rootGetters['network/currentPeer'].url

        // fetch account info from REST gateway
        const accountHttp = RESTService.create('AccountHttp', currentPeer)

        return accountHttp.getAccountsInfo(addresses).subscribe((accountsInfo) => {
          accountsInfo.map(info => commit('addWalletInfo', info))

          const currentWalletInfo = accountsInfo.find(info => info.address.equals(getters.currentWalletAddress))
          if (currentWalletInfo !== undefined) {
            commit('currentWalletInfo', currentWalletInfo)
            dispatch('SET_BALANCES', currentWalletInfo.mosaics)
          }

          return accountsInfo
        }, (error) => dispatch('diagnostic/ADD_ERROR', 'An error happened while trying to fetch account informations: ' + error, {root: true}))
      }
      catch (e) {
        dispatch('diagnostic/ADD_ERROR', 'An error happened while trying to fetch account informations: ' + e, {root: true})
        return false
      }
    },
    async REST_FETCH_MULTISIG({commit, dispatch, getters, rootGetters}, address) {
      if (address instanceof WalletsModel) {
        address = address.objects.address.plain()
      }

      if (!address || address.length !== 40) {
        return ;
      }

      dispatch('diagnostic/ADD_DEBUG', 'Store action wallet/REST_FETCH_MULTISIG dispatched with : ' + address, {root: true})

      try {
        // prepare REST parameters
        const currentPeer = rootGetters['network/currentPeer'].url
        const currentWallet = getters['currentWallet']
        const addressObject = Address.createFromRawAddress(address)

        // fetch account info from REST gateway
        const multisigHttp = RESTService.create('MultisigHttp', currentPeer)
        const multisigInfo = await multisigHttp.getMultisigAccountInfo(addressObject).toPromise()

        // store multisig info
        commit('addOtherMultisigInfo', multisigInfo)
        if (currentWallet && currentWallet.values.get('address') === address) {
          commit('setMultisigInfo', multisigInfo)
        }

        return multisigInfo
      }
      catch (e) {
        dispatch('diagnostic/ADD_ERROR', 'An error happened while trying to fetch multisig information: ' + e, {root: true})
        return false
      }
    },
    async REST_FETCH_OWNED_MOSAICS({commit, dispatch, getters, rootGetters}, address) {
      if (address instanceof WalletsModel) {
        address = address.objects.address.plain()
      }

      if (!address || address.length !== 40) {
        return ;
      }

      dispatch('diagnostic/ADD_DEBUG', 'Store action wallet/REST_FETCH_OWNED_MOSAICS dispatched with : ' + address, {root: true})

      try {
        // prepare REST parameters
        const currentPeer = rootGetters['network/currentPeer'].url
        const currentWallet = getters['currentWallet']
        const addressObject = Address.createFromRawAddress(address)

        // fetch account info from REST gateway
        const mosaicHttp = RESTService.create('MosaicHttp', currentPeer)
        const ownedMosaics = await mosaicHttp.getMosaicsFromAccount(addressObject).toPromise()

        // store multisig info
        if (currentWallet && currentWallet.values.get('address') === address) {
          commit('currentWalletOwnedMosaics', ownedMosaics)
        }

        return ownedMosaics
      }
      catch (e) {
        dispatch('diagnostic/ADD_ERROR', 'An error happened while trying to fetch owned mosaics: ' + e, {root: true})
        return false
      }
    },
    async REST_FETCH_OWNED_NAMESPACES({commit, dispatch, getters, rootGetters}, address): Promise<NamespaceInfo[]> {
      if (address instanceof WalletsModel) {
        address = address.objects.address.plain()
      }

      if (!address || address.length !== 40) {
        return ;
      }

      dispatch('diagnostic/ADD_DEBUG', 'Store action wallet/REST_FETCH_OWNED_NAMESPACES dispatched with : ' + address, {root: true})

      try {
        // prepare REST parameters
        const currentPeer = rootGetters['network/currentPeer'].url
        const currentWallet = getters['currentWallet']
        const addressObject = Address.createFromRawAddress(address)

        // fetch account info from REST gateway
        const namespaceHttp = RESTService.create('NamespaceHttp', currentPeer)
        const ownedNamespaces = await namespaceHttp.getNamespacesFromAccount(addressObject).toPromise()

        // store multisig info
        if (currentWallet && currentWallet.values.get('address') === address) {
          commit('currentWalletOwnedNamespaces', ownedNamespaces)
        }

        return ownedNamespaces
      }
      catch (e) {
        dispatch('diagnostic/ADD_ERROR', 'An error happened while trying to fetch owned namespaces: ' + e, {root: true})
        return null
      }
    },
    REST_ANNOUNCE_PARTIAL(
      {commit, rootGetters},
      {signedLock, signedPartial}
    ): Observable<BroadcastResult> {
      try {
        // prepare REST parameters
        const currentPeer = rootGetters['network/currentPeer'].url
        const wsEndpoint = rootGetters['network/wsEndpoint']
        const transactionHttp = RESTService.create('TransactionHttp', currentPeer)
        const receiptHttp = RESTService.create('ReceiptHttp', currentPeer)
        const listener = new Listener(wsEndpoint)

        // prepare nem2-sdk TransactionService
        const service = new TransactionService(transactionHttp, receiptHttp)

        // announce lock and aggregate only after lock confirmation
        return service.announceHashLockAggregateBonded(
          signedLock,
          signedPartial,
          listener
        ).pipe(
          map((announcedTransaction: AggregateTransaction) => {
            commit('removeSignedTransaction', signedPartial)
            commit('removeSignedTransaction', signedLock)

            return new BroadcastResult(signedPartial, true)
          })
        )
      }
      catch(e) {
        return from([
          new BroadcastResult(signedPartial, false, e.toString()),
        ])
      }
    },
    REST_ANNOUNCE_TRANSACTION(
      {commit, dispatch, rootGetters},
      signedTransaction: SignedTransaction
    ): Observable<BroadcastResult> {

      dispatch('diagnostic/ADD_DEBUG', 'Store action wallet/REST_ANNOUNCE_TRANSACTION dispatched with: ' + JSON.stringify({
        hash: signedTransaction.hash,
        payload: signedTransaction.payload
      }), {root: true})

      try {
        // prepare REST parameters
        const currentPeer = rootGetters['network/currentPeer'].url
        const wsEndpoint = rootGetters['network/wsEndpoint']
        const transactionHttp = RESTService.create('TransactionHttp', currentPeer)
        const receiptHttp = RESTService.create('ReceiptHttp', currentPeer)
        const listener = new Listener(wsEndpoint)

        // prepare nem2-sdk TransactionService
        const service = new TransactionService(transactionHttp, receiptHttp)
        return service.announce(signedTransaction, listener).pipe(
          map((transaction: Transaction) => {
            commit('removeSignedTransaction', signedTransaction)
            return new BroadcastResult(signedTransaction, true)
          })
        )
      }
      catch(e) {
        return from([
          new BroadcastResult(signedTransaction, false, e.toString()),
        ])
      }
    },
/// end-region scoped actions
  },
};
