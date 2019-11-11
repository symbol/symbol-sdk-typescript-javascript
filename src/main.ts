import Vue from 'vue'
import Router from 'vue-router'
import VueRx from 'vue-rx'
import {veeValidateConfig} from '@/core/validation'
import App from '@/App.vue'
import i18n from '@/language/index.ts'
import store from '@/store/index.ts'
import router from '@/router/index.ts'
import iView from 'view-design'
import 'view-design/dist/styles/iview.css'
import htmlRem from '@/core/utils/rem.ts'
import {isWindows} from "@/config/index.ts"
import {resetFontSize} from '@/core/utils/electron.ts'
import VeeValidate from 'vee-validate'
import locale from 'view-design/dist/locale/en-US'
import moment from 'vue-moment'

Vue.use(iView, {locale})
Vue.use(moment as any)
Vue.use(Router)
Vue.use(VueRx)
//Introduced the global
Vue.use(VeeValidate, veeValidateConfig)
htmlRem()
if (isWindows) {
    resetFontSize()
}

Vue.config.productionTip = false
/*
* Custom instruction
* input auto focus
* */
Vue.directive('focus', {
    inserted: function (el, binding) {
        el.focus()
    }
})
export default new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})
