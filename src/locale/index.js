import Vue from 'vue'
import VueI18n from 'vue-i18n'
import customZhCn from './lang/zh-CN'
import customEnUs from './lang/en-US'

Vue.use(VueI18n)
Vue.use({
  i18n: (key, value) => i18n.t(key, value)
})

const navLang = navigator.language
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
let lang = window.localStorage.getItem('local') || localLang || 'en-US'

const messages = {
  'zh-CN': customZhCn,
  'en-US': customEnUs
}
const i18n = new VueI18n({
  locale: lang,
  messages
})

export default i18n

