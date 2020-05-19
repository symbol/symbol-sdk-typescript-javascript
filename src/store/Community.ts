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
import { AwaitLock } from './AwaitLock'
import { CommunityService, ArticleEntry } from '@/services/CommunityService'

const Lock = AwaitLock.create()

/**
 * Community Store
 */
export default {
  namespaced: true,
  state: {
    initialized: false,
    articles: [],
  },
  getters: {
    getInitialized: (state) => state.initialized,
    latestArticles: (state) => state.articles,
  },
  mutations: {
    setInitialized: (state, initialized) => {
      state.initialized = initialized
    },
    addArticles: (state, articles: ArticleEntry[]): void => {
      const newArticles = [...articles, ...state.articles]
      Vue.set(state, 'articles', newArticles)
    },
  },
  actions: {
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        // fetch news
        await dispatch('FETCH_ARTICLES')
        commit('setInitialized', true)
      }
      await Lock.initialize(callback, { getters })
    },
    async uninitialize({ commit, getters }) {
      const callback = async () => {
        // close websocket connections
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, { getters })
    },
    /// region scoped actions
    async FETCH_ARTICLES({ commit }) {
      // fetch articles from external feed
      try {
        const service = new CommunityService()
        const articles: ArticleEntry[] = await service.getLatestArticles()
        commit('addArticles', articles)
      } catch (e) {
        // forward error
        throw new Error(e)
      }
    },
    /// end-region scoped actions
  },
}
