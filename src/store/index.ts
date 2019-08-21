import Vue from 'vue'
import Vuex from 'vuex'
import app from '@/store/app/index.ts'
import account from '@/store/account/index.ts'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app,
        account
    }
})
