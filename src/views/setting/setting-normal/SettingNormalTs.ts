import {timeZoneListData, languageList} from '@/config/index.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {localSave, getCurrentTimeZone} from '@/core/utils/utils.ts'
import {covertOffset} from '@/core/utils/utils.ts'

@Component
export class SettingNormalTs extends Vue {
    languageList: any = languageList
    coin = 'USD'
    tz = 'Pacific/Rarotonga'
    timeZone = 0
    timeZoneListData = timeZoneListData
    coinList = [
        {
            value: 'USD',
            label: 'USD'
        },
    ]

    get language() { return this.$i18n.locale }
    set language(lang) { 
        this.$i18n.locale = lang
        localSave('locale', lang)
    }

    chooseTimeZone(item) {
        this.timeZone = item.offset
        this.tz = item.value
    }

    initCurrentTimeZone() {
        this.timeZone = getCurrentTimeZone()
    }

    @Watch('timeZone')
    onTimeZoneChange() {
        this.$store.commit('SET_TIME_ZONE', this.timeZone)
        console.log(new Date(covertOffset(new Date().getTime(), -11)))
    }

    mounted() { this.timeZone = getCurrentTimeZone() }
}
