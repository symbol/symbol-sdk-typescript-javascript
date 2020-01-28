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

// internal dependencies
import {AwaitLock} from './AwaitLock';
const Lock = AwaitLock.create();

// configuration
import appConfig from '@/../config/app.conf.json'

export default {
  namespaced: true,
  state: {
    initialized: false,
    timezone: new Date().getTimezoneOffset() / 60,
    currentLanguage: 'en-US',
    languages: appConfig.languages,
    hasLoadingOverlay: false,
    hasControlsDisabled: false,
    controlsDisabledMessage: '',
  },
  getters: {
    getInitialized: state => state.initialized,
    currentTimezone: (state) => state.timezone,
    currentLanguage: state => state.currentLanguage,
    languages: state => state.language,
    shouldShowLoadingOverloay: (state) => state.hasLoadingOverlay,
    shouldDisableControls: (state) => state.hasControlsDisabled,
    controlsDisabledMessage: (state) => state.controlsDisabledMessage,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    timezone: (state, timezone) => Vue.set(state, 'timezone', timezone),
    toggleControlsDisabled: (state, {disable, message}) => {
      Vue.set(state, 'hasControlsDisabled', disable)
      Vue.set(state, 'controlsDisabledMessage', message || '')
    },
    toggleLoadingOverlay: (state, display) => Vue.set(state, 'hasLoadingOverlay', display),
    setLanguage: (state, lang) => Vue.set(state, 'currentLanguage', lang),
  },
  actions: {
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
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
    SET_TIME_ZONE({commit}, timezone: number): void {
      commit('timezone', timezone)
    },
    SET_UI_DISABLED({commit}, {isDisabled, message}: {isDisabled: boolean, message: string}) {
      commit('toggleControlsDisabled', {disable: isDisabled, message: message})
    },
    SET_LOADING_OVERLAY({commit}, loadingOverlay) {
      const hasLoadingOverlay = loadingOverlay && loadingOverlay.show
      commit('toggleLoadingOverlay', hasLoadingOverlay)
    },
    SET_LANGUAGE({commit}, language) {
      this._vm.$i18n.locale = language
      commit('setLanguage', language)
    },
/// end-region scoped actions
  }
}

/*
const state: AppInfo = {
  timeZone: new Date().getTimezoneOffset() / 60, // current time zone
  locale: 'en-US',
  walletList: [],
  mnemonic: '',
  networkProperties: null,
  mosaicsLoading: true,
  transactionsLoading: false,
  namespaceLoading: true,
  xemUsdPrice: 0,
  multisigLoading: true,
  _ENABLE_TREZOR_: localRead('_ENABLE_TREZOR_') === 'true',
  isUiDisabled: false,
  uiDisabledMessage: '',
  stagedTransaction: {
    isAwaitingConfirmation: false,
    lockParams: LockParams.default(),
    transactionToSign: null,
  },
  logs: [],
  loadingOverlay: {
    show: false,
    message: '',
  },
  explorerBasePath: explorerLinkList[0].explorerBasePath,
  nodeList: [],
  transactionFormatter: null,
  listeners: null,
  networkManager: null,
}

const mutations: MutationTree<AppInfo> = {
  RESET_APP(state: AppInfo) {
    state.mnemonic = ''
    state.walletList = []
  },
  SET_WALLET_LIST(state: AppInfo, walletList: any[]): void {
    state.walletList = walletList
  },
  SET_MNEMONIC(state: AppInfo, mnemonic: string): void {
    state.mnemonic = mnemonic
  },
  SET_TIME_ZONE(state: AppInfo, timeZone: number): void {
    state.timeZone = timeZone
  },
  SET_MOSAICS_LOADING(state: AppInfo, bool: boolean) {
    state.mosaicsLoading = bool
  },
  SET_TRANSACTIONS_LOADING(state: AppInfo, bool: boolean) {
    state.transactionsLoading = bool
  },
  SET_MULTISIG_LOADING(state: AppInfo, bool: boolean) {
    state.multisigLoading = bool
  },
  SET_XEM_USD_PRICE(state: AppInfo, value: number) {
    state.xemUsdPrice = value
  },
  SET_NAMESPACE_LOADING(state: AppInfo, namespaceLoading: boolean) {
    state.namespaceLoading = namespaceLoading
  },
  SET_UI_DISABLED(state: AppInfo, {isDisabled, message}: {isDisabled: boolean, message: string}) {
    state.isUiDisabled = isDisabled
    state.uiDisabledMessage = message
  },
  SET_STAGED_TRANSACTION(state: AppInfo, stagedTransaction: StagedTransaction) {
    state.stagedTransaction = stagedTransaction
  },
  ADD_LOG(state: AppInfo, log: Log) {
    state.logs.unshift(log)
  },
  SET_LOADING_OVERLAY(state: AppInfo, loadingOverlay: LoadingOverlayObject) {
    Object.assign(state.loadingOverlay, loadingOverlay)
  },
  TRIGGER_NOTICE() {/** Subscribed in App.vue },
  SET_EXPLORER_BASE_PATH(state: AppInfo, explorerBasePath: string) {
    state.explorerBasePath = explorerBasePath
  },
  SET_NODE_LIST(state: AppInfo, nodeList) {
    state.nodeList = nodeList
    localSave('nodeList', JSON.stringify(nodeList))
  },
  SET_TRANSACTION_FORMATTER(state: AppInfo, transactionFormatter: TransactionFormatter) {
    Vue.set(state, 'transactionFormatter', transactionFormatter)
  },
  SET_NETWORK_PROPERTIES(state: AppInfo, networkProperties: NetworkProperties) {
    Vue.set(state, 'networkProperties', networkProperties)
  },
  SET_LISTENERS(state: AppInfo, listeners: Listeners) {
    Vue.set(state, 'listeners', listeners)
  },
  SET_NETWORK_MANAGER(state: AppInfo, networkManager: NetworkManager) {
    Vue.set(state, 'networkManager', networkManager)
  },
}

const actions = {
  SET_NETWORK_PROPERTIES({commit, rootState}, payload: {endpoint: string, NetworkProperties: NetworkProperties}) {
    const {endpoint, NetworkProperties} = payload
    if (endpoint !== rootState.account.node) return
    commit('SET_NETWORK_PROPERTIES', NetworkProperties)
  },
  async INITIALIZE_SERVICES({commit}, store: Store<AppState>) {
    commit('SET_TRANSACTION_FORMATTER', TransactionFormatter.create(store))
    commit('SET_NETWORK_PROPERTIES', NetworkProperties.create(store))
    commit('SET_LISTENERS', Listeners.create(store))
    commit('SET_NETWORK_MANAGER', NetworkManager.create(store))
    await Endpoints.initialize(store)
  },
}

export const appState = {state}
export const appMutations = {mutations}
export const appActions = {actions}
*/
