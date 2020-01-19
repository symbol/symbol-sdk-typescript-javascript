import Vue from 'vue';
import { NetworkType } from 'nem2-sdk';

// internal dependencies
import CatapultHttp from '../infrastructure/CatapultHttp.js';
import { Helpers } from '@/core/Helpers';
import { eventBus } from '../main'
import Lock from './Lock.js';
const AwaitLock = Lock.create();

import networkConfig from '../../config/network.conf.json';

export default {
  namespaced: true,
  state: {
    initialized: false,
    wsEndpoint: '',
    config: networkConfig,
    defaultNode: Helpers.formatUrl(networkConfig.defaultNode.url),
    currentNode: Helpers.formatUrl(networkConfig.defaultNode.url),
    explorerUrl: networkConfig.explorerUrl,
    networkType: NetworkType.MIJIN_TEST,
    isConnected: false,
  },
  mutations: {
    setInitialized: (state, initialized) => { state.initialized = initialized },
    setConnected: (state, connected) => { state.isConnected = connected },
    currentNode: (state, payload) => {
      if (undefined !== payload) {
        let currentNode = Helpers.formatUrl(payload)
        let wsEndpoint = Helpers.httpToWsUrl(currentNode.url)
        Vue.set(state, 'currentNode', currentNode)
        Vue.set(state, 'wsEndpoint', wsEndpoint)
      }
    },
    networkType: (state, type) => {
      switch (type) {
        case NetworkType.MIJIN_TEST:
        case NetworkType.MIJIN:
        case NetworkType.TEST_NET:
        case NetworkType.MAIN_NET:
          Vue.set(state, 'networkType', type)
          break;

        default:
          Vue.set(state, 'networkType', NetworkType.MIJIN_TEST)
          break;
      }
    }
  },
  getters: {
    getInitialized: state => state.initialized,
    wsEndpoint: state => state.wsEndpoint,
    networkType: state => state.networkType,
    currentNode: state => state.currentNode,
    explorerUrl: state => state.explorerUrl,
    nodes: state => {
      let nodes = [];

      const networks = Object.keys(state.config.networks)
      networks.map((network) => {
        const conf = state.config.networks[network];
        conf.nodes.map((node) => {
          nodes.push({
            value: node,
            text: '(' + conf.networkType + ') ' + node
          });
        });
      });

      return nodes;
    }
  },
  actions: {
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        const nodeUrl = getters.currentNode.url
        console.log('action: network/initialize with current node: ', nodeUrl)

        // configure HTTP + Websocket (REST)
        try {
          await CatapultHttp.init(nodeUrl)
          commit('setConnected', true)
          eventBus.$emit('newConnection', nodeUrl);
        }
        catch (e) {
          console.log("Error in Store network/initialize: ", e)
        }

        // update store
        commit('networkType', CatapultHttp.networkType)
        commit('setInitialized', true)
      }
      await AwaitLock.initialize(callback, commit, dispatch, getters)
    },
    async setCurrentNode({ commit, dispatch }, currentNodeUrl) {
      console.log('action: network/setCurrentNode with new node: ', currentNodeUrl)
      if (!Helpers.validURL(currentNodeUrl)) {
        throw Error('Cannot change node. URL is not valid: ' + currentNodeUrl)
      }

      commit('currentNode', currentNodeUrl)
      commit('setConnected', false)
      commit('setInitialized', false)

      // reset store
      await dispatch('uninitialize', null, {root: true})
      await dispatch('initialize')
    },
    async uninitialize({ commit, dispatch, getters }) {
      const callback = async () => {
        console.log('action: network/uninitialize')
        commit('setInitialized', false)
      }
      await AwaitLock.uninitialize(callback, commit, dispatch, getters)
    }
  }
};
