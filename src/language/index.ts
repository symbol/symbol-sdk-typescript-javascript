import Vue from 'vue'
import {zh_CN} from './zh-CN'
import {en_US} from './en-US'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
// @ts-ignore
Vue.use({
    i18n: (key, value) => i18n.t(key, value)
})

const navLang = navigator.language
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
let lang = window.localStorage.getItem('local') || localLang || 'en-US'
window.localStorage.setItem('local', lang)


const messages = {
    'zh-CN': zh_CN,
    'en-US': en_US
}
const i18n = new VueI18n({
    locale: lang,
    messages
})

export default i18n

