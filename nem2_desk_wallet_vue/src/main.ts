import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
// @ts-ignore
import i18n from './utils/locale'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    // @ts-ignore
    i18n,
    render: h => h(App)
}).$mount('#app')
