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
import app from '@/main'
import {AwaitLock} from './AwaitLock'
const Lock = AwaitLock.create()

export default {
  namespaced: true,
  state: {
    initialized: false,
    history: [],
  },
  getters: {
    getInitialized: state => state.initialized,
    history: state => state.history,
    lastNotification: state => state.history.pop(),
    successes: state => {
      return state.history
        .filter(row => row.level === 'success')
        .map(log => log.message)
    },
    warnings: state => {
      return state.history
        .filter(row => row.level === 'warning')
        .map(log => log.message)
    },
    errors: state => {
      return state.history
        .filter(row => row.level === 'error')
        .map(log => log.message)
    },
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    add: (state, payload) => {
      const history = state.history
      history.push({
        level: payload.level || 'warning',
        message: payload.message,
      })
      Vue.set(state, 'history', history)

      /// region trigger notice UI
      app.$Notice.destroy()
      app.$Notice[payload.level]({title: app.$t(payload.message)})
      /// end-region trigger notice UI
    },
  },
  actions: {
    async initialize({ commit, getters }) {
      const callback = async () => {
        /// region initialize $Notice
        app.$Notice.config({duration: 4})
        /// end-region initialize $Notice

        // update store
        commit('setInitialized', true)
      }

      // aquire async lock until initialized
      await Lock.initialize(callback, {getters})
    },
    async uninitialize({ commit, getters }) {
      const callback = async () => {
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {getters})
    },
    /// region scoped actions
    async ADD_SUCCESS({commit, dispatch}, message) {
      commit('add', {level: 'success', message})
      dispatch('diagnostic/ADD_INFO', `Notification (Success): ${message}`, {root: true})
    },
    async ADD_WARNING({commit, dispatch}, message) {
      commit('add', {level: 'warning', message})
      dispatch('diagnostic/ADD_WARNING', `Notification (Warning): ${message}`, {root: true})
    },
    async ADD_ERROR({commit, dispatch}, message) {
      commit('add', {level: 'error', message})
      dispatch('diagnostic/ADD_ERROR', `Notification (Error): ${message}`, {root: true})
    },
    /// end-region scoped actions
  },
}
