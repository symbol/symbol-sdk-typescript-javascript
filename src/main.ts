import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
import store from '@/store/index'
import rem from '@/utils/rem'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
// @ts-ignore
import i18n from '@/locale'

//Introduced the global
Vue.use(iView);
// Vue.use(rem);

Vue.config.productionTip = false

new Vue({
    el:'#app',
    router,
    store,
    // @ts-ignore
    i18n,
    render: h => h(App)
})
