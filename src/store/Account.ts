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

// internal dependencies
import {$eventBus} from '../main'
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {AwaitLock} from './AwaitLock';

/// region globals
const Lock = AwaitLock.create();
const accountsRepository = new AccountsRepository()
/// end-region globals

export default {
  namespaced: true,
  state: {
    initialized: false,
    currentAccount: null,
    isAuthenticated: false,
  },
  getters: {
    getInitialized: state => state.initialized,
    currentAccount: state => state.currentAccount,
    isAuthenticated: state => state.isAuthenticated,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    currentAccount: (state, accountModel) => Vue.set(state, 'currentAccount', accountModel),
    setAuthenticated: (state, authState) => Vue.set(state, 'isAuthenticated', authState === true),
  },
  actions: {
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        await dispatch('RESET_STATE')
        commit('setInitialized', true)
      }

      // aquire async lock until initialized
      await Lock.initialize(callback, {commit, dispatch, getters})
    },
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => {
        await dispatch('RESET_STATE')
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {commit, dispatch, getters})
    },
/// region scoped actions
    RESET_STATE({commit}) {
      commit('currentAccount', null)
      commit('setAuthenticated', false)
    },
    LOG_OUT({dispatch}) {
      return dispatch('RESET_STATE')
    },
    async SET_CURRENT_ACCOUNT({commit, dispatch}, accountName) {
      //XXX validate account exists

      const currentAccount = accountsRepository.read(accountName)
      commit('currentAccount', currentAccount)
      commit('setAuthenticated', true)

      // reset store + re-initialize
      await dispatch('uninitialize', null, {root: true})
      await dispatch('initialize')
      $eventBus.$emit('onAccountChange', accountName)
    }
/// end-region scoped actions
  }
}



/*





const state: StoreAccount = {
  wallet: null,
  activeMultisigAccount: null,
  balances: {},
  mosaics: {},
  namespaces: [],
  transactionList: [],
  transactionsToCosign: [],
  temporaryLoginInfo: {
    password: null,
    mnemonic: null,
  },

  // Properties to move out
  currentAccount: null,
  multisigAccountInfo: {},
  multisigAccountsMosaics: {},
  multisigAccountsNamespaces: {},
  multisigAccountsTransactions: {},
  networkCurrency: defaultNetworkConfig.defaultNetworkMosaic,
  networkMosaics: {},
  node: '',
}


const getters: GetterTree<StoreAccount, AppState> = {
  balance(state): string {
    const address = state.wallet.address
    const balances = state.balances[address]
    const {networkCurrency} = state
    if (!balances || !networkCurrency) return '0'
    const balance = balances[networkCurrency.hex]
    return balance ? absoluteAmountToRelativeAmount(balance, networkCurrency) : '0'
  },
  currentAccount: state => state.currentAccount
}


const updateMosaics = (state: StoreAccount, mosaics: AppMosaic[]) => {
  if (!mosaics) return // @TODO: quick fix
  mosaics.forEach((mosaic: AppMosaic) => {
    const {hex} = mosaic
    const storeMosaic = state.mosaics[hex] || {}
    Vue.set(state.mosaics, hex, {...storeMosaic, ...mosaic})
  })
}

const popTransactionToCosignByHash = (
  oldTransactions: FormattedTransaction[],
  hash: string,
): FormattedTransaction[] => {
  const transactionIndex = oldTransactions.findIndex(({rawTx}) => rawTx.transactionInfo.hash === hash)
  oldTransactions.splice(transactionIndex, 1)
  return oldTransactions
}

const mutations: MutationTree<StoreAccount> = {
  RESET_ACCOUNT(state: StoreAccount) {
    state.wallet = null
    state.mosaics = {}
    state.namespaces = []
    state.transactionList = []
    state.currentAccount = null
  },
  SET_WALLET(state: StoreAccount, wallet: AppWallet): void {
    const {currentAccount} = state
    AppWallet.updateActiveWalletAddress(wallet.address, currentAccount.accountName)
    state.wallet = wallet
  },
  SET_MOSAICS(state: StoreAccount, mosaics: Record<string, AppMosaic>): void {
    state.mosaics = mosaics
  },
  SET_NETWORK_MOSAICS(state: StoreAccount, mosaics: AppMosaic[]): void {
    state.networkMosaics = {}
    // eslint-disable-next-line no-return-assign
    mosaics.forEach(mosaic => state.networkMosaics[mosaic.hex] = mosaic)
  },
  UPDATE_MOSAICS(state: StoreAccount, mosaics: AppMosaic[]): void {
    updateMosaics(state, mosaics)
  },
  /**
     * This mutation's purpose is to not be watched by the appMosaics plugin
     
  UPDATE_MOSAICS_INFO(state: StoreAccount, mosaics: AppMosaic[]): void {
    updateMosaics(state, mosaics)
  },
  /**
     * This mutation's purpose is to not be watched by the appMosaics plugin
     
  UPDATE_MOSAICS_NAMESPACES(state: StoreAccount, mosaics: AppMosaic[]): void {
    updateMosaics(state, mosaics)
  },
  RESET_MOSAICS(state: StoreAccount) {
    state.mosaics = {...state.networkMosaics}
  },
  SET_NETWORK_CURRENCY(state: StoreAccount, mosaic: NetworkCurrency) {
    state.networkCurrency = mosaic
  },
  RESET_NAMESPACES(state: StoreAccount): void {
    state.namespaces = []
  },
  UPDATE_NAMESPACES(state: StoreAccount, namespaces: AppNamespace[]): void {
    const namespacesToUpdate = [...state.namespaces]

    const updatedNamespaces = namespaces.map(newNamespace => {
      const oldNamespace = namespacesToUpdate.find(({hex}) => hex === newNamespace.hex)
      if (oldNamespace === undefined) return newNamespace
      return AppNamespace.fromNamespaceUpdate(oldNamespace, newNamespace)
    })

    const namespacesNotUpdated = namespacesToUpdate
      .filter(({hex}) => namespaces.find(ns => ns.hex === hex) === undefined)

    state.namespaces = [ ...namespacesNotUpdated, ...updatedNamespaces ]
  },
  ADD_NAMESPACE_FROM_RECIPIENT_ADDRESS(state: StoreAccount, namespaces: AppNamespace[]) {
    state.namespaces = [ ...state.namespaces, ...namespaces ]
  },
  SET_NODE(state: StoreAccount, nodeAndNetworkType: {node: string, networkType: NetworkType}): void {
    const {node, networkType} = nodeAndNetworkType
    state.node = node
    const activeNodeMap = JSON.parse(localRead('activeNodeMap') || '{}')
    activeNodeMap[networkType] = node
    localSave('activeNodeMap', JSON.stringify(activeNodeMap))
  },
  RESET_TRANSACTION_LIST(state: StoreAccount) {
    state.transactionList = []
  },
  SET_TRANSACTION_LIST(state: StoreAccount, list: FormattedTransaction[]) {
    state.transactionList = list
  },
  SET_UNCONFIRMED_TRANSACTION_LIST(state: StoreAccount, list: FormattedTransaction[]) {
    state.transactionList.unshift(...list)
  },
  ADD_UNCONFIRMED_TRANSACTION(state: StoreAccount, transaction: FormattedTransaction) {
    state.transactionList.unshift(transaction)
  },
  ADD_CONFIRMED_TRANSACTION(state: StoreAccount, transaction: FormattedTransaction) {
    const newStateTransactions = [...state.transactionList]
    const txIndex = newStateTransactions
      .findIndex(({txHeader}) => transaction.txHeader.hash === txHeader.hash)

    if (txIndex > -1) newStateTransactions.splice(txIndex, 1)
    newStateTransactions.unshift(transaction)
    state.transactionList = newStateTransactions
  },
  SET_ACCOUNT_DATA(state: StoreAccount, currentAccount: AppAccount) {
    state.currentAccount = currentAccount
  },
  SET_MULTISIG_ACCOUNT_INFO(state: StoreAccount, addressAndMultisigInfo: AddressAndMultisigInfo) {
    const {address, multisigAccountInfo} = addressAndMultisigInfo
    Vue.set(state.multisigAccountInfo, address, multisigAccountInfo)
  },
  SET_ACTIVE_MULTISIG_ACCOUNT(state: StoreAccount, publicKey: string) {
    if (publicKey === state.wallet.publicKey) {
      state.activeMultisigAccount = null
      return
    }
    state.activeMultisigAccount = publicKey
  },
  SET_MULTISIG_ACCOUNT_NAMESPACES(state: StoreAccount, addressAndNamespaces: AddressAndNamespaces) {
    const {address, namespaces} = addressAndNamespaces
    Vue.set(state.multisigAccountsNamespaces, address, namespaces)
  },
  UPDATE_MULTISIG_ACCOUNT_MOSAICS(state: StoreAccount, addressAndMosaics: AddressAndMosaics): void {
    const {address, mosaics} = addressAndMosaics
    const mosaicList = {...state.multisigAccountsMosaics[address]}
    mosaics.forEach((mosaic: AppMosaic) => {
      if (!mosaic.hex) return
      const {hex} = mosaic
      if (!mosaicList[hex]) mosaicList[hex] = new AppMosaic({hex})
      Object.assign(mosaicList[mosaic.hex], mosaic)
    })
    Vue.set(state.multisigAccountsMosaics, address, mosaicList)
  },
  RESET_TRANSACTIONS_TO_COSIGN(state: StoreAccount) {
    state.transactionsToCosign = []
  },
  POP_TRANSACTION_TO_COSIGN_BY_HASH(state: StoreAccount, hash: string) {
    state.transactionsToCosign = popTransactionToCosignByHash([...state.transactionsToCosign], hash)
  },
  SET_TRANSACTIONS_TO_COSIGN(state: StoreAccount, transactions: FormattedTransaction[]) {
    state.transactionsToCosign = transactions
  },
  SET_TEMPORARY_PASSWORD(state: StoreAccount, password: string) {
    state.temporaryLoginInfo.password = password
  },
  SET_TEMPORARY_MNEMONIC(state: StoreAccount, mnemonic: string) {
    state.temporaryLoginInfo.mnemonic = mnemonic
  },
  REMOVE_TEMPORARY_LOGIN_INFO(state: StoreAccount) {
    state.temporaryLoginInfo = {
      password: null,
      mnemonic: null,
    }
  },
  UPDATE_TRANSACTION_TO_COSIGN(state: StoreAccount, newTransaction: FormattedTransaction) {
    const {hash} = newTransaction.rawTx.transactionInfo
    const transactions = popTransactionToCosignByHash([...state.transactionsToCosign], hash)
    state.transactionsToCosign = [ newTransaction, ...transactions ]
  },
  SET_TEMPORARY_REMOTE_NODE_CONFIG(state: StoreAccount, temporaryRemoteNodeConfig: {
    publicKey: string
    node: string
  }) {
    state.wallet.temporaryRemoteNodeConfig = temporaryRemoteNodeConfig
  },

  SET_ACCOUNTS_BALANCES(state: StoreAccount, balances: Record <string, Balances>) {
    state.balances = balances
  },

  SET_ACCOUNT_BALANCES(state, { address, balances }) {
    Vue.set(state.balances, address, balances)
  },
}

const actions: ActionTree<any, AppState> = {
  SET_GENERATION_HASH({commit, rootState}, {endpoint, generationHash}) {
    if (endpoint !== rootState.account.node) return
    commit('SET_GENERATION_HASH', generationHash)
  },
  SET_NETWORK_CURRENCY({commit, rootState}, {endpoint, networkCurrency}) {
    if (endpoint !== rootState.account.node) return
    commit('SET_NETWORK_CURRENCY', networkCurrency)
  },
  SET_NETWORK_MOSAICS({commit, rootState}, {endpoint, appMosaics}) {
    if (endpoint !== rootState.account.node) return
    commit('SET_NETWORK_MOSAICS', appMosaics)
  },
  UPDATE_MOSAICS({commit, rootState}, {endpoint, appMosaics}) {
    if (endpoint !== rootState.account.node) return
    commit('UPDATE_MOSAICS', appMosaics)
  },

  async SET_ACCOUNTS_BALANCES({commit, rootState}) {
    const {walletList} = rootState.app
    const {node} = rootState.account
    const plainAddresses = walletList.map(({address}) => Address.createFromRawAddress(address))
    const accountsInfo = await new AccountHttp(node)
      .getAccountsInfo(plainAddresses)
      .toPromise()

    const balances = BalancesService.getFromAccountsInfo(accountsInfo)
    
    commit('SET_ACCOUNTS_BALANCES', balances)
  },
}

export const accountState = {state}
export const accountMutations = {mutations}
export const accountActions = {actions}
export const accountGetters = {getters}
*/
