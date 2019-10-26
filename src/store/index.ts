import Vue from 'vue'
import Vuex from 'vuex'
import {appState, appMutations} from '@/store/app'
import {accountState, accountMutations} from '@/store/account'
import {appMosaicsModule, onTransactionRefreshModule} from '@/store/plugins'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app: {...appState, ...appMutations},
        account: {...accountState, ...accountMutations},
    },
    plugins: [appMosaicsModule, onTransactionRefreshModule]
})
