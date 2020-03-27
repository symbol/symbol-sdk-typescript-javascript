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
import {AwaitLock} from './AwaitLock'
import {CommunityService} from '@/services/CommunityService'
const Lock = AwaitLock.create()

/**
 * Community Store
 */
export default {
  namespaced: true,
  state: {
    initialized: false,
    currentArticle: '',
    articles: [],
  },
  getters: {
    getInitialized: state => state.initialized,
    currentArticle: state => state.currentArticle,
    latestArticles: state => state.articles,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    currentArticle: (state, activeArticle) => Vue.set(state, 'currentArticle', activeArticle),
    addArticle: (state, article) => {
      const articles = state.articles

      // order by DESC
      articles.unshift(article)
      Vue.set(state, 'articles', articles)
      return article
    },
  },
  actions: {
    async initialize({ state, commit, dispatch, getters }) {
      const callback = async () => {
        // fetch news
        await dispatch('FETCH_ARTICLES')
        commit('currentArticle', [...state.articles].shift())
        commit('setInitialized', true)
      }
      await Lock.initialize(callback, {getters})
    },
    async uninitialize({ commit, getters }) {
      const callback = async () => {
        // close websocket connections
        commit('setInitialized', false)
      }
      await Lock.uninitialize(callback, {getters})
    },
    /// region scoped actions
    SET_CURRENT_ARTICLE({commit}, article) {
      commit('currentArticle', article)
    },
    async FETCH_ARTICLES({commit}) {
      // fetch articles from external feed
      try {
        const service = new CommunityService()
        const articles = await service.getLatestArticles()

        return articles.map(article => commit('addArticle', article))
      }
      catch (e) {
        // forward error
        throw new Error(e)
      }
    },
    /// end-region scoped actions
  },
}
