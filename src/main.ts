import Vue from 'vue'
import iView from 'iview'
import App from '@/App.vue'
import i18n from '@/language'
import store from '@/store/index'
import router from '@/router/index'
import 'iview/dist/styles/iview.css'
import {sessionSave} from '@/help/help'

//Introduced the global
Vue.use(iView);
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 10 * (clientWidth / 192) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window)


Vue.config.productionTip = false
resetFontSize()

function resetFontSize() {
    if (window['electron']) {
        const devInnerWidth = 1689
        const winWidth = window.innerWidth
        const scaleFactor = window['electron'].screen.getPrimaryDisplay().scaleFactor;
        let zoomFactor = winWidth / devInnerWidth;
        if (winWidth > devInnerWidth && winWidth < 1920) {
            zoomFactor = 1
        } else if (winWidth >= 1920) {
            zoomFactor = winWidth / 1920;
        }
        sessionSave('zoomFactor', zoomFactor)
        window['electron'].webFrame.setZoomFactor(zoomFactor);
    }
}

export default new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})
