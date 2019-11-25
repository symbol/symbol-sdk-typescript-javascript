import zh_CN from '@/language/zh-CN.json'
import en_US from '@/language/en-US.json'
import ja_JP from '@/language/ja-JP.json'
import VueI18n from 'vue-i18n'
import Vue from 'vue'

Vue.use(VueI18n)
// @ts-ignore
Vue.use({
    i18n: (key, value) => i18n.t(key, value)
})

const navLang = navigator.language
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
let lang = window.localStorage.getItem('locale') || localLang || 'en-US'
window.localStorage.setItem('locale', lang)


const messages = {
    'zh-CN': zh_CN,
    'en-US': en_US,
    'ja-JP': ja_JP
}
const i18n = new VueI18n({
    locale: lang,
    messages,
    silentTranslationWarn: true,
})

export default i18n

