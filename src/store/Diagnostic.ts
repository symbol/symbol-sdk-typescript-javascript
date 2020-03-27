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
import {LogLevels} from '@/core/utils/LogLevels'
import {AwaitLock} from './AwaitLock'
const Lock = AwaitLock.create()

export default {
  namespaced: true,
  state: {
    initialized: false,
    logs: [],
  },
  getters: {
    getInitialized: state => state.initialized,
    logs: state => state.logs,
    lastLog: state => state.logs.pop(),
    infos: state => {
      return state.logs
        .filter(row => row.level === LogLevels.INFO)
        .map(log => log.message)
    },
    debugs: state => {
      return state.logs
        .filter(row => row.level === LogLevels.DEBUG)
        .map(log => log.message)
    },
    warnings: state => {
      return state.logs
        .filter(row => row.level === LogLevels.WARNING)
        .map(log => log.message)
    },
    errors: state => {
      return state.logs
        .filter(row => row.level === LogLevels.ERROR)
        .map(log => log.message)
    },
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    addLog: (state, payload) => {
      const logs = state.logs
      logs.push({
        level: payload.level || LogLevels.DEBUG,
        message: payload.message,
        time: payload.time,
      })
      Vue.set(state, 'logs', logs)
    },
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
    ADD_LOG({commit}, {level, message}) {
      commit('addLog', {level, message, time: new Date()})
    },
    ADD_INFO({commit}, message) {
      const time = new Date()
      commit('addLog', {level: LogLevels.INFO, message, time})
      return time
    },
    ADD_DEBUG({commit}, message) {
      const time = new Date()
      commit('addLog', {level: LogLevels.DEBUG, message, time})
      return time
    },
    ADD_WARNING({commit}, message) {
      const time = new Date()
      commit('addLog', {level: LogLevels.WARNING, message, time})
      return time
    },
    ADD_ERROR({commit}, message) {
      const time = new Date()
      commit('addLog', {level: LogLevels.ERROR, message, time})
      return time
    },
    /// end-region scoped actions
  },
}
