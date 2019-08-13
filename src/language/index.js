import Vue from 'vue';
import { zh_CN } from './zh-CN';
import { en_US } from './en-US';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
// @ts-ignore
Vue.use({
    i18n: function (key, value) { return i18n.t(key, value); }
});
var navLang = navigator.language;
var localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
var lang = window.localStorage.getItem('local') || localLang || 'en-US';
window.localStorage.setItem('local', lang);
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