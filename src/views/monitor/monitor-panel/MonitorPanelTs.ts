import {Message} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import monitorSeleted from '@/common/img/monitor/monitorSeleted.png'
import monitorUnselected from '@/common/img/monitor/monitorUnselected.png'
import {copyTxt, formatXEMamount, formatNumber, localRead, localSave} from '@/core/utils/utils.ts'
import {mapState} from "vuex"
import {monitorPanelNavigatorList} from '@/config/view'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class MonitorPanelTs extends Vue {
    app: any
    activeAccount: any
    mosaic: string
    mosaicName = ''
    showExpiredMosaics = false
    isShowAccountInfo = true
    // isShowAccountAlias = false @TODO: Account Alias (update when method available)
    isShowManageMosaicIcon = false
    isChecked = true
    monitorSeleted = monitorSeleted
    monitorUnselected = monitorUnselected
    navigatorList: any = monitorPanelNavigatorList

    get xemUsdPrice() {
        return this.app.xemUsdPrice
    }

    get balanceLoading() {
        return this.app.balanceLoading
    }

    get mosaicsLoading() {
        return this.app.mosaicsLoading
    }

    get getWallet() {
        return this.activeAccount.wallet
    }

    get XEMamount() {
        return this.activeAccount.wallet.balance
    }

    get address() {
        return this.activeAccount.wallet.address
    }

    get node() {
        return this.activeAccount.node
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
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
        const updatedList: any = {...this.mosaicMap}
        updatedList[mosaic.hex].hide = !updatedList[mosaic.hex].hide
        this.$store.commit('SET_MOSAICS', updatedList)
        localSave(this.address, JSON.stringify(updatedList))
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

    formatXEMamount(text) {
        return formatXEMamount(text)
    }

    mounted() {
        // @TODO: review
        this.switchPanel(0)
    }
}
