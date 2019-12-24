import {Component, Provide, Vue} from 'vue-property-decorator'
import {localRead, localSave} from '@/core/utils'
import {mapState} from "vuex"
import {timeZoneListData} from "@/config/view/timeZone";
import {languageConfig} from "@/config/view/language";
import {AppInfo, StoreAccount} from "@/core/model"
import DebugConsole from '@/components/debug-console/DebugConsole.vue'
import {explorerLinkList, Message} from "@/config"
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import {validation} from "@/core/validation"

@Component({
    components: {DebugConsole, ErrorTooltip},
    computed: {...mapState({app: 'app', activeAccount: 'account'})},
})
export class SettingNormalTs extends Vue {
    @Provide() validator: any = this.$validator
    app: AppInfo
    validation = validation
    languageList: any = languageConfig
    coin = 'USD'
    timeZoneListData = timeZoneListData
    showDebugConsole: boolean = false
    currentExplorerLink = ''
    activeAccount: StoreAccount
    coinList = [ {
            value: 'USD',
            label: 'USD'
        }]

    get defaultExplorerLinkList() {
        const explorerLinkListInLocalStorage = localRead(' explorerLinkList')
        if (explorerLinkListInLocalStorage == '' || !explorerLinkListInLocalStorage) {
            return explorerLinkList.map(item => item.explorerBasePath)
        }
        return JSON.parse(explorerLinkListInLocalStorage).map((item: any) => item.explorerBasePath)
    }

    get language() {
        return this.$i18n.locale
    }

    get timeZone() {
        return this.app.timeZone
    }

    get networkType() {
        return this.activeAccount.wallet.networkType
    }

    set timeZone(timeZone) {
        this.$store.commit('SET_TIME_ZONE', timeZone)
    }

    set language(lang) {
        this.$i18n.locale = lang
        localSave('locale', lang)
    }

    explorerLinkFilterMethod(value, option) {
        return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    }

    setExplorerBasePath() {
        const {defaultExplorerLinkList, currentExplorerLink} = this
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) {
                    this.$store.commit('SET_EXPLORER_BASE_PATH', explorerLinkList[0].explorerBasePath)
                    this.$Notice.success({title: this.$t(Message.SET_DEFAULT_EXPLORER) + ''})
                    return
                }
                this.$store.commit('SET_EXPLORER_BASE_PATH', this.currentExplorerLink)
                if (defaultExplorerLinkList.findIndex(item => item.explorerBasePath == currentExplorerLink) == -1) {
                    this.saveExplorerLinkListInLocal()
                }
                this.$forceUpdate()
                this.$Notice.success({title: this.$t(Message.SUCCESS) + ''})
            })
    }

    saveExplorerLinkListInLocal() {
        const {networkType, currentExplorerLink} = this
        const explorerLinkListInLocalStorage = localRead('explorerLinkList')

        if (explorerLinkListInLocalStorage == '') {
            const currentExplorerLinkList = explorerLinkList
            currentExplorerLinkList.push({
                explorerBasePath: currentExplorerLink,
                networkType: networkType  //todo add networkType
            })
            localSave('explorerLinkList', JSON.stringify(currentExplorerLinkList))
            return
        }
        const currentExplorerLinkList = JSON.parse(explorerLinkListInLocalStorage)
        currentExplorerLinkList.push({
            explorerBasePath: currentExplorerLink,
            networkType: networkType  //todo add networkType
        })
        localSave('explorerLinkList', JSON.stringify(currentExplorerLinkList))
    }

    mounted() {
        this.currentExplorerLink = this.app.explorerBasePath
    }
}
