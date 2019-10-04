import Vue from 'vue'
import Vuex from 'vuex'
import {appState, appMutations} from '@/store/app/index.ts'
import {accountState, accountMutations} from '@/store/account/index.ts'
import {appMosaicsModule, onTransactionRefreshModule} from '@/store/plugins'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app: {...appState, ...appMutations},
        account: {...accountState, ...accountMutations},
    },
    plugins: [appMosaicsModule, onTransactionRefreshModule]
})
