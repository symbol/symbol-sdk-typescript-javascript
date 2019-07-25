import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { zh_CN } from './lang/zh-CN';
import { en_US } from './lang/en-US';
Vue.use(VueI18n);
// @ts-ignore
Vue.use({
    i18n: function (key, value) { return i18n.t(key, value); }
});
var navLang = navigator.language;
var localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
var lang = window.localStorage.getItem('local') || localLang || 'en-US';
var messages = {
    'zh-CN': zh_CN,
    'en-US': en_US
};
var i18n = new VueI18n({
    locale: lang,
    messages: messages
});
export default i18n;
//# sourceMappingURL=index.js.map