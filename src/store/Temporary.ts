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
import {Password} from 'symbol-sdk'
import Vue from 'vue'

// internal dependencies
import {AwaitLock} from './AwaitLock'
const Lock = AwaitLock.create()

export default {
  namespaced: true,
  state: {
    initialized: false,
    password: null,
    mnemonic: null,
  },
  getters: {
    getInitialized: state => state.initialized,
    password: state => state.password,
    mnemonic: state => state.mnemonic,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setPassword: (state, password) => Vue.set(state, 'password', password),
    setMnemonic: (state, mnemonic) => Vue.set(state, 'mnemonic', mnemonic),
  },
  actions: {
    async initialize({ commit, getters }) {
      const callback = async () => {
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
    RESET_STATE({commit}) {
      commit('setPassword', null)
      commit('setMnemonic', null)
    },
    SET_PASSWORD({commit}, password) {
      commit('setPassword', new Password(password))
    },
    SET_MNEMONIC({commit}, mnemonic) {
      commit('setMnemonic', mnemonic)
    },
    /// end-region scoped actions
  },
}
