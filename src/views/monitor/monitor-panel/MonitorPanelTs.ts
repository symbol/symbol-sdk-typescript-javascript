import {Message} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import monitorSelected from '@/common/img/monitor/monitorSelected.png'
import monitorUnselected from '@/common/img/monitor/monitorUnselected.png'
import {copyTxt, formatXemAmount, formatNumber, localRead, localSave} from '@/core/utils/utils.ts'
import {mapState} from "vuex"
import {monitorPanelNavigatorConfig} from "@/config/view/monitor"
import {AppInfo, StoreAccount} from "@/core/model"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class MonitorPanelTs extends Vue {
    app: AppInfo
    activeAccount: StoreAccount
    mosaic: string
    mosaicName = ''
    showExpiredMosaics = false
    isShowAccountInfo = true
    isShowManageMosaicIcon = false
    isChecked = true
    monitorSelected = monitorSelected
    monitorUnselected = monitorUnselected
    navigatorList: any = monitorPanelNavigatorConfig
    formatXemAmount = formatXemAmount

    get balance(): number {
        const {wallet} = this.activeAccount
        if (!wallet) return 0
        return wallet.balance || 0
    }

    get xemUsdPrice() {
        return this.app.xemUsdPrice
    }

    get ticker() {
        return this.activeAccount.networkCurrency.ticker
    }
    
    get mosaicsLoading() {
        return this.app.mosaicsLoading
    }

    get address() {
        return this.activeAccount.wallet.address
    }

    get mosaicMap() {
        return this.activeAccount.mosaics
    }

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get mosaicList() {
        const {mosaics} = this
        if (this.mosaicsLoading || !mosaics) return []
        return Object.values(this.mosaics)
    }

    get filteredList() {
        const {mosaics} = this
        if (this.mosaicsLoading || !mosaics) return []
        return Object.values(this.mosaics).filter(({hide}) => !hide)
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    switchPanel(index) {
        if (this.navigatorList[index].disabled) {
            return
        }
        const list = this.navigatorList.map((item) => {
            item.isSelect = false
            return item
        })
        list[index].isSelect = true
        this.navigatorList = list
        this.$router.push({
            name: list[index].path
        })
    }

    hideAssetInfo() {
        this.isShowAccountInfo = false
    }

    manageMosaicList() {
        this.isShowManageMosaicIcon = !this.isShowManageMosaicIcon
    }

    copyAddress() {
        const that = this
        copyTxt(this.address).then(() => {
            that.$Notice.success(
                {
                    title: this.$t(Message.COPY_SUCCESS) + ''
                }
            )
        })
    }

    toggleAllChecked() {
        this.isChecked = !this.isChecked
        const updatedList: any = {...this.mosaicMap}
        Object.keys(updatedList).forEach(key => updatedList[key].hide = !this.isChecked)
        this.$store.commit('SET_MOSAICS', updatedList)
        localSave(this.address, JSON.stringify(updatedList))
    }

    toggleShowExpired() {
        this.showExpiredMosaics = !this.showExpiredMosaics
        const updatedList: any = {...this.mosaicMap}
        const {currentHeight} = this
        Object.keys(updatedList)
            .forEach(key => {
                const {expirationHeight} = updatedList[key]
                updatedList[key].hide = this.showExpiredMosaics
                    ? false
                    : expirationHeight !== 'Forever' || currentHeight > expirationHeight
            })
        this.$store.commit('SET_MOSAICS', updatedList)
        localSave(this.address, JSON.stringify(updatedList))
    }

    showMosaicMap() {
        this.isShowManageMosaicIcon = !this.isShowManageMosaicIcon
    }

    toggleShowMosaic(mosaic) {
        const accountMap = JSON.parse(localRead('accountMap'))
        let wallets = accountMap.wallets
        const updatedList: any = {...this.mosaicMap}
        updatedList[mosaic.hex].hide = !updatedList[mosaic.hex].hide
        this.$store.commit('SET_MOSAICS', updatedList)
        wallets[0].hideMosaicMap = wallets[0].hideMosaicMap || {}
        if (!mosaic.show) {
            wallets[0].hideMosaicMap[mosaic.hex] = true
            accountMap.wallets = wallets
            localSave('accountMap', JSON.stringify(accountMap))
            return
        }
        // delete from hideMosaicList
        delete wallets[0].hideMosaicMap[mosaic.hex]
        accountMap.wallets = wallets
        localSave('accountMap', JSON.stringify(accountMap))
    }

    // @TODO: move to formatTransaction
    formatNumber(number) {
        return formatNumber(number)
    }

    searchMosaic() {
        // @TODO: Query the network for mosaics that are not in the mosaic list
        if (this.mosaicName == '') {
            this.showErrorMessage(Message.MOSAIC_NAME_NULL_ERROR)
            return
        }
    }

    showErrorMessage(message) {
        this.$Notice.destroy()
        this.$Notice.error({title: this.$t(message) + ''})
    }

    mounted() {
        // @TODO: review
        this.switchPanel(0)
    }
}
