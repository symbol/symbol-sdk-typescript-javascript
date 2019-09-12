import {Message} from "@/config/index.ts"
import {Component, Vue, Watch} from 'vue-property-decorator'
import monitorSeleted from '@/common/img/monitor/monitorSeleted.png'
import monitorUnselected from '@/common/img/monitor/monitorUnselected.png'
import {copyTxt, formatXEMamount, formatNumber} from '@/core/utils/utils.ts'
import {mapState} from "vuex"
import {minitorPanelNavigatorList} from '@/config/index.ts'

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
    ischecked = true
    monitorSeleted = monitorSeleted
    monitorUnselected = monitorUnselected
    navigatorList: any = minitorPanelNavigatorList

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

    get currentXEM2() {
        return this.activeAccount.currentXEM2
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
        const {mosaics, mosaicName} = this
        const newList: any = Object.values(mosaics)
        return newList.filter(mosaic => (
            mosaic.name && mosaic.name.indexOf(mosaicName) > -1
                || mosaic.hex.indexOf(mosaicName) > -1
        ))
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

    toggleAllChecked(){
        this.ischecked = !this.ischecked
        const updatedList: any = {...this.mosaicMap}
        Object.keys(updatedList).forEach(key=>updatedList[key].show = this.ischecked)        
    }

    toggleShowExpired(){
        this.showExpiredMosaics = !this.showExpiredMosaics
        const updatedList: any = {...this.mosaicMap}
        const {currentHeight} = this
        Object.keys(updatedList)
            .forEach(key=>  {
                const {expirationHeight} = updatedList[key]
                updatedList[key].show = this.showExpiredMosaics
                    ? true 
                    : expirationHeight === 'Forever' || currentHeight < expirationHeight
            })
    }

    showMosaicMap() {
        this.isShowManageMosaicIcon = !this.isShowManageMosaicIcon
    }

    toggleShowMosaic(mosaic) {
        const updatedList: any = {...this.mosaicMap}
        updatedList[mosaic.hex].show = !updatedList[mosaic.hex].show
        this.$store.commit('SET_MOSAICS', updatedList)
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
