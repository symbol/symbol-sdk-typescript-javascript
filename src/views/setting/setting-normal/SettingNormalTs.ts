import {Component, Vue} from 'vue-property-decorator'
import {localSave} from '@/core/utils'
import {mapState} from "vuex"
import {timeZoneListData} from "@/config/view/timeZone";
import {languageConfig} from "@/config/view/language";
import {AppInfo} from "@/core/model"
import DebugConsole from '@/components/debug-console/DebugConsole.vue'

@Component({
    components: { DebugConsole },
    computed: {...mapState({app: 'app'})},
})
export class SettingNormalTs extends Vue {
    app: AppInfo
    languageList: any = languageConfig
    coin = 'USD'
    timeZoneListData = timeZoneListData
    showDebugConsole: boolean = false

    coinList = [
        {
            value: 'USD',
            label: 'USD'
        },
    ]

    get language() {
        return this.$i18n.locale
    }

    get timeZone() {
        return this.app.timeZone
    }

    set timeZone(timeZone) {
        this.$store.commit('SET_TIME_ZONE', timeZone)
    }

    set language(lang) {
        this.$i18n.locale = lang
        localSave('locale', lang)
    }
}
