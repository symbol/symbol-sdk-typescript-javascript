import {timeZoneListData} from '@/config/index.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {localSave, getCurrentTimeZone} from '@/core/utils/utils.ts'
import {covertOffset} from '@/core/utils/utils.ts'

@Component
export class SettingNormalTs extends Vue {
    language = ''
    coin = 'USD'
    languageList = []
    tz = 'Pacific/Rarotonga'
    timeZone = 0
    timeZoneListData = timeZoneListData
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
        this.$i18n.locale = language
        localSave('local', language)
    }

    chooseTimeZone(item) {
        this.timeZone = item.offset
        this.tz = item.value
    }

    initCurrentTimeZone() {
        this.timeZone = getCurrentTimeZone()
    }

    initLanguage() {
        this.languageList = this.$store.state.app.languageList
        this.language = this.$i18n.locale
    }

    @Watch('timeZone')
    onTimeZoneChange() {
        this.$store.commit('SET_TIME_ZONE', this.timeZone)
        console.log(new Date(covertOffset(new Date().getTime(), -11)))
    }

    created() {
        this.initLanguage()
        this.initCurrentTimeZone()
    }

}
