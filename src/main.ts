import Vue from 'vue'
import iView from 'iview'
import App from '@/App.vue'
import i18n from '@/language'
import store from '@/store/index'
import router from '@/router/index'
import 'iview/dist/styles/iview.css'
// import {resetFontSize} from '@/core/utils/electron'
import htmlRem from '@/core/utils/rem'


//Introduced the global
Vue.use(iView);
htmlRem()
// resetFontSize()

Vue.config.productionTip = false

export default new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})
