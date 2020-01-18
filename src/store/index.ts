import Vue from 'vue'
import Vuex from 'vuex'
import AccountStore from '@/store/Account'
import NetworkStore from '@/store/Network'
import ChainStore from '@/store/Chain'
import AppInfoStore from '@/store/AppInfo'
import Plugins from '@/store/Plugins'

// use AwaitLock for initialization routines
import {AwaitLock} from '@/store/AwaitLock'
const AsyncLock = AwaitLock.create();

Vue.use(Vuex);

export default new Vuex.Store({
  strict: false,
  modules: {
    app: AppInfoStore,
    network: NetworkStore,
    chain: ChainStore,
    account: AccountStore,
  },
  plugins: [ 
    Plugins.mosaicsPlugin,
    Plugins.transactionsPlugin,
  ],
  actions: {
    async initialize({ commit, dispatch, getters }) {
      const callback = async () => {
        await dispatch('network/initialize')
        await dispatch('chain/initialize')
      }
      await AsyncLock.initialize(callback, commit, dispatch, getters)
    },
    // Uninitialize the stores (call on app destroyed).
    async uninitialize({ dispatch }) {
      await Promise.all([
        dispatch('network/uninitialize'),
        dispatch('chain/uninitialize'),
        dispatch('account/uninitialize'),
      ])
    }
  }
});
