// external dependencies
import VueI18n from 'vue-i18n'
import Vue from 'vue'

// internal translation messages
import zh_CN from '@/language/zh-CN.json'
import en_US from '@/language/en-US.json'
import ja_JP from '@/language/ja-JP.json'

// external translation messages
import enValidationMessages from 'vee-validate/dist/locale/en.json'
import zh_CNValidationMessages from 'vee-validate/dist/locale/zh_CN.json'
import jaValidationMessages from 'vee-validate/dist/locale/ja.json'

const messages = {
  'en-US': {...en_US, validation: enValidationMessages.messages},
  'zh-CN': {...zh_CN, validation: zh_CNValidationMessages.messages},
  'ja-JP': {...ja_JP, validation: jaValidationMessages.messages},
}

const navLang = navigator.language
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
const lang = window.localStorage.getItem('locale') || localLang || 'en-US'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: lang,
  messages,
  silentTranslationWarn: true,
})

// @ts-ignore
Vue.use({ i18n: (key, value) => i18n.t(key, value) })
window.localStorage.setItem('locale', lang)

export default i18n

