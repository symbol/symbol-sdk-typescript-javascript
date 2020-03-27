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
import {$eventBus} from '../events'
import {AwaitLock} from './AwaitLock'
const Lock = AwaitLock.create()

export default {
  namespaced: true,
  state: {
    initialized: false,
    lastPriceUSD: 0,
  },
  getters: {
    getInitialized: state => state.initialized,
    lastPrice: state => state.lastPriceUSD,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    currentPrice: (state, price) => Vue.set(state, 'lastPriceUSD', price),
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
    async SET_CURRENT_PRICE({commit}, currentPrice) {
      // XXX validate correct price
      commit('currentPrice', currentPrice)
      $eventBus.$emit('onPriceChange', currentPrice)
    },
    /// end-region scoped actions
  },
}
