import Vue from 'vue';
import iView from 'iview';
import App from '@/App.vue';
import i18n from '@/language';
import store from '@/store/index';
import router from '@/router/index';
import rem from '@/help/remHelp.js';
import 'iview/dist/styles/iview.css';
import { sessionSave } from '@/help/help';
//Introduced the global
Vue.use(iView);
Vue.use(rem);
Vue.config.productionTip = false;
resetFontSize();
function resetFontSize() {
    if (window['electron']) {
        var devInnerWidth = 1689;
        var winWidth = window.innerWidth;
        var scaleFactor = window['electron'].screen.getPrimaryDisplay().scaleFactor;
        var zoomFactor = winWidth / devInnerWidth;
        if (winWidth > devInnerWidth && winWidth < 1920) {
            zoomFactor = 1;
        }
        else if (winWidth >= 1920) {
            zoomFactor = winWidth / 1920;
        }
        sessionSave('zoomFactor', zoomFactor);
        window['electron'].webFrame.setZoomFactor(zoomFactor);
    }
}
export default new Vue({
    el: '#app',
    router: router,
    store: store,
    i18n: i18n,
    render: function (h) { return h(App); }
});
//# sourceMappingURL=main.js.map