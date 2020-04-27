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
import {AccountInfo, Address, CosignatureSignedTransaction, IListener, MultisigAccountInfo, NetworkType, RepositoryFactory, SignedTransaction, Transaction} from 'symbol-sdk'
import {of, Subscription} from 'rxjs'
// internal dependencies
import {$eventBus} from '../events'
import {RESTService} from '@/services/RESTService'
import {AwaitLock} from './AwaitLock'
import {BroadcastResult} from '@/core/transactions/BroadcastResult'
import {WalletModel} from '@/core/database/entities/WalletModel'
import {MultisigService} from '@/services/MultisigService'
import * as _ from 'lodash'
import {AccountModel} from '@/core/database/entities/AccountModel'
import {WalletService} from '@/services/WalletService'
import {catchError, map} from 'rxjs/operators'


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

export type Signer = { label: string, publicKey: string, address: Address, multisig: boolean }

// wallet state typing
interface WalletState {
  initialized: boolean
  currentWallet: WalletModel
  currentWalletAddress: Address
  currentWalletMultisigInfo: MultisigAccountInfo
  isCosignatoryMode: boolean
  signers: Signer[]
  currentSigner: Signer
  currentSignerAddress: Address
  currentSignerMultisigInfo: MultisigAccountInfo
  // Known wallet database identifiers
  knownWallets: WalletModel[]
  knownAddresses: Address[]
  accountsInfo: AccountInfo[]
  multisigAccountsInfo: MultisigAccountInfo[]

  stageOptions: { isAggregate: boolean, isMultisig: boolean }
  stagedTransactions: Transaction[]
  signedTransactions: SignedTransaction[]
  // Subscriptions to webSocket channels
  subscriptions: Record<string, SubscriptionType[][]>
}

// Wallet state initial definition
const walletState: WalletState = {
  initialized: false,
  currentWallet: null,
  currentWalletAddress: null,
  currentWalletMultisigInfo: null,
  isCosignatoryMode: false,
  signers: [],
  currentSigner: null,
  currentSignerAddress: null,
  currentSignerMultisigInfo: null,
  knownWallets: [],
  knownAddresses: [],
  accountsInfo: [],
  multisigAccountsInfo: [],
  stageOptions: {
    isAggregate: false,
    isMultisig: false,
  },
  stagedTransactions: [],
  signedTransactions: [],
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
    currentWallet: (state: WalletState): WalletModel => {
      return state.currentWallet
    },
    signers: (state: WalletState): Signer[] => state.signers,
    currentSigner: (state: WalletState): Signer => state.currentSigner,
    currentWalletAddress: (state: WalletState) => state.currentWalletAddress,
    knownAddresses: (state: WalletState) => state.knownAddresses,
    currentWalletMultisigInfo: (state: WalletState) => state.currentWalletMultisigInfo,
    currentSignerMultisigInfo: (state: WalletState) => state.currentSignerMultisigInfo,
    isCosignatoryMode: (state: WalletState) => state.isCosignatoryMode,
    currentSignerAddress: (state: WalletState) => state.currentSignerAddress,
    knownWallets: (state: WalletState) => state.knownWallets,
    accountsInfo: (state: WalletState) => state.accountsInfo,
    multisigAccountsInfo: (state: WalletState) => state.multisigAccountsInfo,
    getSubscriptions: (state: WalletState) => state.subscriptions,
    stageOptions: (state: WalletState) => state.stageOptions,
    stagedTransactions: (state: WalletState) => state.stagedTransactions,
    signedTransactions: (state: WalletState) => state.signedTransactions,
  },
  mutations: {
    setInitialized: (state: WalletState, initialized: boolean) => { state.initialized = initialized },
    currentWallet: (state: WalletState, walletModel: WalletModel) => { state.currentWallet = walletModel },
    currentWalletAddress: (state: WalletState, walletAddress: Address) =>
    { state.currentWalletAddress = walletAddress },
    currentSigner: (state: WalletState, currentSigner: Signer) =>
    { state.currentSigner = currentSigner },
    signers: (state: WalletState, signers: Signer[]) => { state.signers = signers },
    currentSignerAddress: (state: WalletState, signerAddress) =>
    { state.currentSignerAddress = signerAddress },
    knownWallets: (state: WalletState, knownWallets: WalletModel[]) =>
    { state.knownWallets = knownWallets },
    knownAddresses: (state: WalletState, knownAddresses: Address[]) =>
    { state.knownAddresses = knownAddresses },
    isCosignatoryMode: (state: WalletState, isCosignatoryMode: boolean) =>
    { state.isCosignatoryMode = isCosignatoryMode },
    accountsInfo: (state: WalletState, accountsInfo) => { state.accountsInfo = accountsInfo },
    multisigAccountsInfo: (state: WalletState, multisigAccountsInfo) =>
    { state.multisigAccountsInfo = multisigAccountsInfo },
    currentWalletMultisigInfo: (state: WalletState, currentWalletMultisigInfo) =>
    { state.currentWalletMultisigInfo = currentWalletMultisigInfo },
    currentSignerMultisigInfo: (state: WalletState, currentSignerMultisigInfo) =>
    { state.currentSignerMultisigInfo = currentSignerMultisigInfo },

    setSubscriptions: (state: WalletState, subscriptions: Record<string, SubscriptionType[][]>) =>
    { state.subscriptions = subscriptions },
    addSubscriptions: (state: WalletState,
      payload: { address: string, subscriptions: SubscriptionType }) => {
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

    stageOptions: (state: WalletState, options) => Vue.set(state, 'stageOptions', options),
    setStagedTransactions: (state: WalletState, transactions: Transaction[]) => Vue.set(state,
      'stagedTransactions', transactions),
    addStagedTransaction: (state: WalletState, transaction: Transaction) => {
      // - get previously staged transactions
      const staged = state.stagedTransactions

      // - push transaction on stage (order matters)
      staged.push(transaction)

      // - update state
      return Vue.set(state, 'stagedTransactions', staged)
    },
    clearStagedTransaction: (state) => Vue.set(state, 'stagedTransactions', []),
    addSignedTransaction: (state: WalletState, transaction: SignedTransaction) => {
      // - get previously signed transactions
      const signed = state.signedTransactions

      // - update state
      signed.push(transaction)
      return Vue.set(state, 'signedTransactions', signed)
    },
    removeSignedTransaction: (state: WalletState, transaction: SignedTransaction) => {
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
     * }
     */
    async initialize({commit, dispatch, getters}, {address}) {
      const callback = async () => {
        if (!address || !address.length) {
          return
        }
        // open websocket connections
        dispatch('SUBSCRIBE', address)
        commit('setInitialized', true)
      }
      await Lock.initialize(callback, {getters})
    },
    async uninitialize({commit, dispatch, getters}, {address}) {
      const callback = async () => {
        // close websocket connections
        await dispatch('UNSUBSCRIBE', address)
        await dispatch('transaction/RESET_TRANSACTIONS', {}, {root: true})
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {getters})
    },

    /**
     * Possible `options` values include:
     * @type {
     *    isCosignatoryMode: boolean,
     * }
     */
    async SET_CURRENT_WALLET({commit, dispatch, getters}, currentWallet: WalletModel) {
      const previous: WalletModel = getters.currentWallet
      if (previous && previous.address === currentWallet.address) return

      const currentWalletAddress: Address = Address.createFromRawAddress(currentWallet.address)
      dispatch('diagnostic/ADD_DEBUG',
        'Store action wallet/SET_CURRENT_WALLET dispatched with ' + currentWalletAddress.plain(),
        {root: true})

      // set current wallet
      commit('currentWallet', currentWallet)


      // reset current signer
      await dispatch('SET_CURRENT_SIGNER', {publicKey: currentWallet.publicKey})
      await dispatch('initialize', {address: currentWalletAddress.plain()})
      $eventBus.$emit('onWalletChange', currentWalletAddress.plain())
    },

    async RESET_CURRENT_WALLET({commit, dispatch}) {
      dispatch('diagnostic/ADD_DEBUG', 'Store action wallet/RESET_CURRENT_WALLET dispatched',
        {root: true})
      commit('currentWallet', null)
      commit('currentWalletAddress', null)
    },

    async SET_CURRENT_SIGNER({commit, dispatch, getters, rootGetters},
      {publicKey}: { publicKey: string }) {
      if (!publicKey){
        throw new Error('Public Key must be provided when calling wallet/SET_CURRENT_SIGNER!')
      }
      const networkType: NetworkType = rootGetters['network/networkType']
      const currentAccount: AccountModel = rootGetters['account/currentAccount']
      const currentWallet: WalletModel = getters.currentWallet
      const previousSignerAddress: Address = getters.currentSignerAddress

      const currentSignerAddress: Address = Address.createFromPublicKey(publicKey, networkType)

      if (previousSignerAddress && previousSignerAddress.equals(currentSignerAddress)) return

      dispatch('diagnostic/ADD_DEBUG',
        'Store action wallet/SET_CURRENT_SIGNER dispatched with ' + currentSignerAddress.plain(),
        {root: true})

      dispatch('transaction/RESET_TRANSACTIONS', {}, {root: true})

      const currentWalletAddress = Address.createFromRawAddress(currentWallet.address)
      const knownWallets = new WalletService().getKnownWallets(currentAccount.wallets)

      commit('currentSignerAddress', currentSignerAddress)
      commit('currentWalletAddress', currentWalletAddress)
      commit('isCosignatoryMode', !currentSignerAddress.equals(currentWalletAddress))
      commit('knownWallets', knownWallets)

      // Upgrade
      dispatch('namespace/SIGNER_CHANGED', {}, {root: true})
      dispatch('mosaic/SIGNER_CHANGED', {}, {root: true})
      dispatch('transaction/SIGNER_CHANGED', {}, {root: true})

      await dispatch('LOAD_ACCOUNT_INFO')

      dispatch('namespace/LOAD_NAMESPACES', {}, {root: true})
      dispatch('mosaic/LOAD_MOSAICS', {}, {root: true})

    },

    async LOAD_ACCOUNT_INFO({commit, getters, rootGetters}) {
      const networkType: NetworkType = rootGetters['network/networkType']
      const currentWallet: WalletModel = getters.currentWallet
      const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
      const currentSignerAddress: Address = getters.currentSignerAddress
      const currentWalletAddress: Address = getters.currentWalletAddress
      const knownWallets: WalletModel[] = getters.knownWallets

      // remote calls:

      const getMultisigAccountGraphInfoPromise = repositoryFactory.createMultisigRepository()
        .getMultisigAccountGraphInfo(currentWalletAddress).pipe(map(g => {
          return MultisigService.getMultisigInfoFromMultisigGraphInfo(g)
        }), catchError(() => {
          return of([])
        })).toPromise()


      // REMOTE CALL
      const multisigAccountsInfo: MultisigAccountInfo[] = await getMultisigAccountGraphInfoPromise

      const currentWalletMultisigInfo = multisigAccountsInfo.find(
        m => m.account.address.equals(currentWalletAddress))
      const currentSignerMultisigInfo = multisigAccountsInfo.find(
        m => m.account.address.equals(currentSignerAddress))

      const signers = new MultisigService().getSigners(networkType, knownWallets, currentWallet,
        currentWalletMultisigInfo)

      const knownAddresses = _.uniqBy([ ...signers.map(s=>s.address),
        ...knownWallets.map(w => Address.createFromRawAddress(w.address)) ].filter(a => a),
      'address')

      commit('knownAddresses', knownAddresses)
      commit('currentSigner', signers.find(s => s.address.equals(currentSignerAddress)))
      commit('signers', signers)
      commit('multisigAccountsInfo', multisigAccountsInfo)
      commit('currentWalletMultisigInfo', currentWalletMultisigInfo)
      commit('currentSignerMultisigInfo', currentSignerMultisigInfo)

      // REMOTE CALL
      const getAccountsInfoPromise = repositoryFactory.createAccountRepository()
        .getAccountsInfo(knownAddresses).toPromise()
      const accountsInfo = await getAccountsInfoPromise

      commit('accountsInfo', accountsInfo)

    },


    UPDATE_CURRENT_WALLET_NAME({commit, getters, rootGetters}, name: string) {
      const currentWallet: WalletModel = getters.currentWallet
      if (!currentWallet) {
        return
      }
      const currentAccount: AccountModel = rootGetters['account/currentAccount']
      if (!currentAccount) {
        return
      }
      const walletService = new WalletService()
      walletService.updateName(currentWallet, name)
      const knownWallets = walletService.getKnownWallets(currentAccount.wallets)
      commit('knownWallets', knownWallets)
    },


    SET_KNOWN_WALLETS({commit}, wallets: string[]) {
      commit('knownWallets', new WalletService().getKnownWallets(wallets))
    },

    RESET_SUBSCRIPTIONS({commit}) {
      commit('setSubscriptions', [])
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
    async SUBSCRIBE({commit, dispatch, rootGetters}, address) {
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
    async UNSUBSCRIBE({dispatch, getters}, address) {
      const subscriptions = getters.getSubscriptions
      const currentWallet: WalletModel = getters.currentWallet

      if (!address && currentWallet) {
        address = currentWallet.address
      }

      const subsByAddress = subscriptions && subscriptions[address] || []
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

    async REST_ANNOUNCE_PARTIAL(
      {commit, dispatch, rootGetters},
      {issuer, signedLock, signedPartial},
    ): Promise<BroadcastResult> {

      if (!issuer || issuer.length !== 40) {
        return
      }

      dispatch('diagnostic/ADD_DEBUG',
        'Store action wallet/REST_ANNOUNCE_PARTIAL dispatched with: ' + JSON.stringify({
          issuer: issuer,
          signedLockHash: signedLock.hash,
          signedPartialHash: signedPartial.hash,
        }), {root: true})

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
      } catch (e) {
        return new BroadcastResult(signedPartial, false, e.toString())
      }
    },
    async REST_ANNOUNCE_TRANSACTION(
      {commit, dispatch, rootGetters},
      signedTransaction: SignedTransaction,
    ): Promise<BroadcastResult> {
      dispatch('diagnostic/ADD_DEBUG',
        'Store action wallet/REST_ANNOUNCE_TRANSACTION dispatched with: ' + JSON.stringify({
          hash: signedTransaction.hash,
          payload: signedTransaction.payload,
        }), {root: true})

      try {
        // prepare REST parameters
        const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
        const transactionHttp = repositoryFactory.createTransactionRepository()

        // prepare symbol-sdk TransactionService
        await transactionHttp.announce(signedTransaction)
        commit('removeSignedTransaction', signedTransaction)
        return new BroadcastResult(signedTransaction, true)
      } catch (e) {
        commit('removeSignedTransaction', signedTransaction)
        return new BroadcastResult(signedTransaction, false, e.toString())
      }
    },
    async REST_ANNOUNCE_COSIGNATURE({dispatch, rootGetters}, cosignature: CosignatureSignedTransaction):
    Promise<BroadcastResult> {

      dispatch('diagnostic/ADD_DEBUG',
        'Store action wallet/REST_ANNOUNCE_COSIGNATURE dispatched with: ' + JSON.stringify({
          hash: cosignature.parentHash,
          signature: cosignature.signature,
          signerPublicKey: cosignature.signerPublicKey,
        }), {root: true})

      try {
        // prepare REST parameters
        const repositoryFactory = rootGetters['network/repositoryFactory'] as RepositoryFactory
        const transactionHttp = repositoryFactory.createTransactionRepository()

        // prepare symbol-sdk TransactionService
        await transactionHttp.announceAggregateBondedCosignature(cosignature)
        return new BroadcastResult(cosignature, true)
      } catch (e) {
        return new BroadcastResult(cosignature, false, e.toString())
      }
    },

  },


}
