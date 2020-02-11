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
import i18n from '@/language'
import {AwaitLock} from './AwaitLock';
const Lock = AwaitLock.create();

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
    hasControlsDisabled: false,
    controlsDisabledMessage: '',
    explorerUrl: networkConfig.explorerUrl,
    defaultFee: feesConfig.normal,
  },
  getters: {
    getInitialized: state => state.initialized,
    currentTimezone: (state) => state.timezone,
    currentLanguage: (state) => {
      return i18n.locale
    },
    languages: state => state.languages,
    shouldShowLoadingOverlay: (state) => state.hasLoadingOverlay,
    shouldDisableControls: (state) => state.hasControlsDisabled,
    controlsDisabledMessage: (state) => state.controlsDisabledMessage,
    explorerUrl: (state) => state.explorerUrl,
    defaultFee: (state) => state.defaultFee,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    timezone: (state, timezone) => Vue.set(state, 'timezone', timezone),
    toggleControlsDisabled: (state, {disable, message}) => {
      Vue.set(state, 'hasControlsDisabled', disable)
      Vue.set(state, 'controlsDisabledMessage', message || '')
    },
    toggleLoadingOverlay: (state, display) => Vue.set(state, 'hasLoadingOverlay', display),
    setExplorerUrl: (state, url) => Vue.set(state, 'explorerUrl', url),
    setCurrentLanguage: (state, lang) => {
      i18n.locale = lang
      window.localStorage.setItem('locale', lang)
    },
    setDefaultFee: (state, maxFee) => Vue.set(state, 'defaultFee', maxFee),
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
    SET_EXPLORER_URL({commit}, url: string) {
      commit('setExplorerUrl', url)
    },
    SET_LANGUAGE({commit}, language: string) {
      commit('setCurrentLanguage', language)
    },
    SET_DEFAULT_FEE({commit}, maxFee: number) {
      commit('setDefaultFee', maxFee)
    }
/// end-region scoped actions
  }
}
