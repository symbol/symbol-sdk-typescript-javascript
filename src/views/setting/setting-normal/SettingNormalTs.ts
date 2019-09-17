import {Component, Vue} from 'vue-property-decorator'
import {localSave} from '@/core/utils/utils.ts'
import {mapState} from "vuex"
import {languageList} from "@/config/view";
import {timeZoneListData} from "@/config/timeZone";

@Component({
    computed: {...mapState({app: 'app'})},
})
export class SettingNormalTs extends Vue {
    app: any
    languageList: any = languageList
    coin = 'USD'
    timeZoneListData = timeZoneListData
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
