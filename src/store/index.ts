import Vue from 'vue'
import Vuex from 'vuex'
import {appState, appMutations, appActions} from '@/store/app'
import {accountState, accountMutations, accountActions} from '@/store/account'
import {appMosaicsModule, onTransactionRefreshModule} from '@/store/plugins'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app: {...appState, ...appMutations, ...appActions},
        account: {...accountState, ...accountMutations, ...accountActions},
    },
    plugins: [appMosaicsModule, onTransactionRefreshModule]
})
