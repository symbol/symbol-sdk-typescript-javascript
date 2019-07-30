import Vue from 'vue'
// @ts-ignore
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
Vue.use(rem);

Vue.config.productionTip = false
resize()
function resize() {
    if(window['electron']){
        var devInnerWidth= 1920
        var scaleFactor = window['electron'].screen.getPrimaryDisplay().scaleFactor;
        var zoomFactor =  window.innerWidth/devInnerWidth;
        window['electron'].webFrame.setZoomFactor(zoomFactor);
    }
}

export default new Vue({
    el:'#app',
    router,
    store,
    // @ts-ignore
    i18n,
    render: h => h(App)
})
