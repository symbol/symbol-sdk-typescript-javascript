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
import i18n from '@/language'
import app from '@/main'
import {AwaitLock} from './AwaitLock'
const Lock = AwaitLock.create()

// configuration
import appConfig from '@/../config/app.conf.json'
import feesConfig from '@/../config/fees.conf.json'
import networkConfig from '@/../config/network.conf.json'

export default {
  namespaced: true,
  state: {
    initialized: false,
    timezone: new Date().getTimezoneOffset() / 60,
    languages: appConfig.languages,
    hasLoadingOverlay: false,
    loadingOverlayMessage: '',
    loadingDisableCloseButton: false,
    hasControlsDisabled: false,
    controlsDisabledMessage: '',
    explorerUrl: networkConfig.explorerUrl,
    faucetUrl: networkConfig.faucetUrl,
    defaultFee: feesConfig.normal,
    defaultWallet: '',
    isFetchingTransactions: false,
  },
  getters: {
    getInitialized: (state) => state.initialized,
    currentTimezone: (state) => state.timezone,
    currentLanguage: () => i18n.locale,
    languages: (state) => state.languages,
    shouldShowLoadingOverlay: (state) => state.hasLoadingOverlay,
    loadingOverlayMessage: (state) => state.loadingOverlayMessage,
    loadingDisableCloseButton: (state) => state.loadingDisableCloseButton,
    shouldDisableControls: (state) => state.hasControlsDisabled,
    controlsDisabledMessage: (state) => state.controlsDisabledMessage,
    explorerUrl: (state) => state.explorerUrl,
    faucetUrl: (state) => state.faucetUrl,
    defaultFee: (state) => state.defaultFee,
    defaultWallet: (state) => state.defaultWallet,
    isFetchingTransactions: (state) => state.isFetchingTransactions,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    timezone: (state, timezone) => Vue.set(state, 'timezone', timezone),
    toggleControlsDisabled: (state, {disable, message}) => {
      Vue.set(state, 'hasControlsDisabled', disable)
      Vue.set(state, 'controlsDisabledMessage', message || '')
    },
    toggleLoadingOverlay: (state, display) => Vue.set(state, 'hasLoadingOverlay', display),
    setLoadingOverlayMessage: (state, message) => Vue.set(state, 'loadingOverlayMessage', message),
    setLoadingDisableCloseButton: (state, bool) => Vue.set(state, 'loadingDisableCloseButton', bool),
    setExplorerUrl: (state, url) => Vue.set(state, 'explorerUrl', url),
    setCurrentLanguage: (state, lang) => {
      i18n.locale = lang
      window.localStorage.setItem('locale', lang)
    },
    setDefaultFee: (state, maxFee) => Vue.set(state, 'defaultFee', maxFee),
    setDefaultWallet: (state, defaultWallet) => Vue.set(state, 'defaultWallet', defaultWallet),
    setFetchingTransactions: (state, bool: boolean) => Vue.set(state, 'isFetchingTransactions', bool),
  },
  actions: {
    async initialize({ commit, getters }) {
      const callback = async () => {
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
    SET_TIME_ZONE({commit}, timezone: number): void {
      commit('timezone', timezone)
    },
    SET_UI_DISABLED({commit}, {isDisabled, message}: {isDisabled: boolean, message: string}) {
      commit('toggleControlsDisabled', {disable: isDisabled, message: message})
    },
    SET_LOADING_OVERLAY({commit}, loadingOverlay) {
      // @ts-ignore
      if (!loadingOverlay.show) app.$Spin.hide()
      commit('toggleLoadingOverlay', loadingOverlay.show)
      commit('setLoadingOverlayMessage', loadingOverlay.message)
      commit('setLoadingDisableCloseButton', loadingOverlay.disableCloseButton || false)
    },
    SET_EXPLORER_URL({commit}, url: string) {
      commit('setExplorerUrl', url)
    },
    SET_LANGUAGE({commit}, language: string) {
      commit('setCurrentLanguage', language)
    },
    SET_DEFAULT_FEE({commit}, maxFee: number) {
      commit('setDefaultFee', maxFee)
    },
    SET_DEFAULT_WALLET({commit}, defaultWallet: string) {
      commit('setDefaultWallet', defaultWallet)
    },
    USE_SETTINGS({commit}, settingsModel) {
      commit('setExplorerUrl', settingsModel.values.get('explorer_url'))
      commit('setCurrentLanguage', settingsModel.values.get('language'))
      commit('setDefaultFee', settingsModel.values.get('default_fee'))
      commit('setDefaultWallet', settingsModel.values.get('default_wallet'))
    },
    SET_FETCHING_TRANSACTIONS({commit}, bool: boolean) {
      commit('setFetchingTransactions', bool)
    },
    /// end-region scoped actions
  },
}
