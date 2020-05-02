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
// internal dependencies
import i18n from '@/language'
import app from '@/main'
import { AwaitLock } from './AwaitLock'
// configuration
import appConfig from '@/../config/app.conf.json'
import networkConfig from '@/../config/network.conf.json'
import { SettingsModel } from '@/core/database/entities/SettingsModel'
import { SettingService } from '@/services/SettingService'

const Lock = AwaitLock.create()
const settingService = new SettingService()
const ANON_PROFILE_NAME = ''

interface AppInfoState {
  initialized: false
  timezone: number
  languages: { value: string; label: string }[]
  hasLoadingOverlay: boolean
  loadingOverlayMessage: string
  loadingDisableCloseButton: false
  hasControlsDisabled: false
  controlsDisabledMessage: string
  faucetUrl: string
  settings: SettingsModel
}

const appInfoState: AppInfoState = {
  initialized: false,
  timezone: new Date().getTimezoneOffset() / 60,
  languages: appConfig.languages,
  hasLoadingOverlay: false,
  loadingOverlayMessage: '',
  loadingDisableCloseButton: false,
  hasControlsDisabled: false,
  controlsDisabledMessage: '',
  faucetUrl: networkConfig.faucetUrl,
  settings: settingService.getProfileSettings(ANON_PROFILE_NAME),
}

export default {
  namespaced: true,
  state: appInfoState,
  getters: {
    getInitialized: (state: AppInfoState) => state.initialized,
    currentTimezone: (state: AppInfoState) => state.timezone,
    language: (state: AppInfoState) => state.settings.language,
    languages: (state: AppInfoState) => state.languages,
    shouldShowLoadingOverlay: (state: AppInfoState) => state.hasLoadingOverlay,
    loadingOverlayMessage: (state: AppInfoState) => state.loadingOverlayMessage,
    loadingDisableCloseButton: (state: AppInfoState) => state.loadingDisableCloseButton,
    shouldDisableControls: (state: AppInfoState) => state.hasControlsDisabled,
    controlsDisabledMessage: (state: AppInfoState) => state.controlsDisabledMessage,
    explorerUrl: (state: AppInfoState) => state.settings.explorerUrl,
    settings: (state: AppInfoState) => state.settings,
    faucetUrl: (state: AppInfoState) => state.faucetUrl,
    defaultFee: (state: AppInfoState) => state.settings.defaultFee,
    defaultAccount: (state: AppInfoState) => state.settings.defaultAccount,
  },
  mutations: {
    setInitialized: (state: AppInfoState, initialized) => {
      state.initialized = initialized
    },
    timezone: (state: AppInfoState, timezone) => Vue.set(state, 'timezone', timezone),
    settings: (state: AppInfoState, settings: SettingsModel) => Vue.set(state, 'settings', settings),
    toggleControlsDisabled: (state: AppInfoState, { disable, message }) => {
      Vue.set(state, 'hasControlsDisabled', disable)
      Vue.set(state, 'controlsDisabledMessage', message || '')
    },
    toggleLoadingOverlay: (state: AppInfoState, display: boolean) => Vue.set(state, 'hasLoadingOverlay', display),
    setLoadingOverlayMessage: (state: AppInfoState, message: string) =>
      Vue.set(state, 'loadingOverlayMessage', message),
    setLoadingDisableCloseButton: (state: AppInfoState, bool: boolean) =>
      Vue.set(state, 'loadingDisableCloseButton', bool),
  },
  actions: {
    async initialize({ commit, getters }) {
      const callback = async () => {
        // update store
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
    /// region scoped actions
    SET_TIME_ZONE({ commit }, timezone: number): void {
      commit('timezone', timezone)
    },
    SET_UI_DISABLED({ commit }, { isDisabled, message }: { isDisabled: boolean; message: string }) {
      commit('toggleControlsDisabled', {
        disable: isDisabled,
        message: message,
      })
    },
    SET_LOADING_OVERLAY({ commit }, loadingOverlay) {
      // @ts-ignore
      if (!loadingOverlay.show) app.$Spin.hide()
      commit('toggleLoadingOverlay', loadingOverlay.show)
      commit('setLoadingOverlayMessage', loadingOverlay.message)
      commit('setLoadingDisableCloseButton', loadingOverlay.disableCloseButton || false)
    },

    SET_SETTINGS({ commit, rootGetters }, settingsModel: SettingsModel) {
      if (settingsModel.language) {
        i18n.locale = settingsModel.language
        window.localStorage.setItem('locale', settingsModel.language)
      }
      const currentProfile = rootGetters['profile/currentProfile']
      const profileName = (currentProfile && currentProfile.profileName) || ANON_PROFILE_NAME
      commit('settings', settingService.changeProfileSettings(profileName, settingsModel))
    },

    SET_EXPLORER_URL({ dispatch }, explorerUrl: string) {
      dispatch('SET_SETTINGS', { explorerUrl })
    },

    SET_LANGUAGE({ dispatch }, language: string) {
      dispatch('SET_SETTINGS', { language })
    },
    SET_DEFAULT_FEE({ dispatch }, defaultFee: number) {
      dispatch('SET_SETTINGS', { defaultFee })
    },
    SET_DEFAULT_ACCOUNT({ dispatch }, defaultAccount: string) {
      dispatch('SET_SETTINGS', { defaultAccount })
    },
    /// end-region scoped actions
  },
}
