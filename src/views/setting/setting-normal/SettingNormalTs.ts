import {localSave} from '@/core/utils/utils'
import {Component, Vue} from 'vue-property-decorator'

@Component
export class SettingNormalTs extends Vue {
    language = ''
    coin = 'USD'
    languageList = []
    coinList = [
        {
            value: 'USD',
            label: 'USD'
        },
    ]

    switchLanguage(language) {
        this.$store.state.app.local = {
            abbr: language,
            language: this.$store.state.app.localMap[language]
        }
        // @ts-ignore
        this.$i18n.locale = language
        localSave('local', language)
    }

    created() {
        this.languageList = this.$store.state.app.languageList
        this.language = this.$i18n.locale
    }

}
