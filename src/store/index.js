import Vue from 'vue';
import Vuex from 'vuex';
import app from './app';
import account from './account';
Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        app: app,
        account: account
    }
});
//# sourceMappingURL=index.js.map