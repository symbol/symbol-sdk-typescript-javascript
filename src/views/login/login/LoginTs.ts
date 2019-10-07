import {localSave} from '@/core/utils/utils.ts'
import {Component, Vue} from 'vue-property-decorator'
import {languageConfig} from "@/config/view/language"

@Component
export class LoginTs extends Vue {
    languageList = languageConfig

    switchLanguage(language) {
        // @ts-ignore
        this.$i18n.locale = language
        localSave('locale', language)
    }

    get language() {
        return this.$i18n.locale
    }

    set language(lang) {
        this.$i18n.locale = lang
        localSave('locale', lang)
    }
}
