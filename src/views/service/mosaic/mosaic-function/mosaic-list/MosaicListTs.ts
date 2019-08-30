import {MosaicId} from "nem2-sdk"
import {MosaicApiRxjs} from '@/core/api/MosaicApiRxjs.ts'
import {AccountApiRxjs} from '@/core/api/AccountApiRxjs.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import EditDialog from './mosaic-edit-dialog/MosaicEditDialog.vue'
import MosaicAliasDialog from './mosaic-alias-dialog/MosaicAliasDialog.vue'
import MosaicUnAliasDialog from './mosaic-unAlias-dialog/MosaicUnAliasDialog.vue'

@Component({
    components: {
        MosaicAliasDialog,
        MosaicUnAliasDialog,
        EditDialog
    }
})
export class MosaicListTs extends Vue {
    isLoadingConfirmedTx = true
    currentTab: number = 0
    rootNameList: any[] = []
    showCheckPWDialog = false
    showMosaicEditDialog = false
    showMosaicAliasDialog = false
    showMosaicUnAliasDialog = false
    accountPublicKey = ''
    accountAddress = ''
    node = ''
    generationHash = ''
    currentXem = ''
    currentXEM2: string
    currentXEM1: string
    mosaicMapInfo: any = {}
    selectedMosaic: any = {}

    get getWallet() {
        return this.$store.state.account.wallet
    }

    get ConfirmedTxList() {
        return this.$store.state.account.ConfirmedTx
    }

    get nowBlockHeihgt() {
        return this.$store.state.app.chainStatus.currentHeight
    }

    get namespaceList() {
        return this.$store.state.account.namespace
    }

    showCheckDialog() {
        this.showCheckPWDialog = true
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    showAliasDialog(item) {
        document.body.click()
        this.selectedMosaic = item
        setTimeout(() => {
            this.showMosaicAliasDialog = true
        })
    }

    showUnAliasDialog(item) {
        document.body.click()
        this.selectedMosaic = item
        setTimeout(() => {
            this.showMosaicUnAliasDialog = true
        })
    }

    closeMosaicAliasDialog() {
        this.showMosaicAliasDialog = false
    }

    closeMosaicUnAliasDialog() {
        this.showMosaicUnAliasDialog = false
    }

    showEditDialog(item) {
        document.body.click()
        this.selectedMosaic = item
        setTimeout(() => {
            this.showMosaicEditDialog = true
        }, 0)
    }

    closeMosaicEditDialog(item) {
        this.showMosaicEditDialog = false
    }


    initData() {
        if (!this.getWallet) {
            return
        }
        this.accountPublicKey = this.getWallet.publicKey
        this.accountAddress = this.getWallet.address
        this.node = this.$store.state.account.node
        this.generationHash = this.$store.state.account.generationHash
        this.currentXEM2 = this.$store.state.account.currentXEM2
        this.currentXEM1 = this.$store.state.account.currentXEM1
        this.currentXem = this.$store.state.account.currentXem
    }


    async getMosaicList() {
        const that = this
        let {accountPublicKey, accountAddress, node, currentXem} = this

        await new AccountApiRxjs().getAccountInfo(accountAddress, node).subscribe(async (accountInfo) => {
            let mosaicList = accountInfo.mosaics
            let mosaicIdList:any = mosaicList.map((item) => {
                return item.id
            })
            await new MosaicApiRxjs().getMosaics(node, mosaicIdList).subscribe(async (mosaicListInfo: any) => {
                let mosaicMapInfo: any = {}
                let existMosaics: any = []
                mosaicMapInfo.length = 0
                mosaicListInfo.forEach((item) => {
                    if (item.owner.publicKey !== accountPublicKey) {
                        return
                    }
                    item.hex = item.mosaicId.id.toHex().toUpperCase()
                    item.supply = item.supply.compact()
                    item.supplyMutable = item.properties.supplyMutable
                    item._divisibility = item.properties.divisibility
                    item.transferable = item.properties.transferable
                    if (that.computeDuration(item) === 'Forever' || that.computeDuration(item) > 0) {
                        existMosaics.push(new MosaicId(item.hex))
                    }
                    mosaicMapInfo.length += 1
                    if (item.mosaicId.id.toHex() == that.currentXEM1 || item.mosaicId.id.toHex() == that.currentXEM2) {
                        item.name = currentXem
                    } else {
                        item.name = ''
                    }
                    mosaicMapInfo[item.hex] = item
                })
                mosaicIdList.map((item: any) => {
                    return new MosaicId(item)
                })
                await new MosaicApiRxjs().getMosaicsNames(node, mosaicIdList).subscribe((mosaicsName: any) => {
                    console.log(mosaicsName)
                })
                that.mosaicMapInfo = mosaicMapInfo
                that.isLoadingConfirmedTx = false
            })
        }, () => {
            that.mosaicMapInfo = []
            that.isLoadingConfirmedTx = false
        })
    }

    computeDuration(item) {
        let continuousTime
        if (item.properties.duration.compact() === 0) {
            continuousTime = 'Forever'
        } else {
            continuousTime = (item.height.compact() + item.properties.duration.compact()) - this.nowBlockHeihgt
        }

        return continuousTime
    }

    @Watch('getWallet')
    onGetWalletChange() {
        this.initData()
        this.getMosaicList()
    }

    @Watch('ConfirmedTxList')
    onConfirmedTxChange() {
        this.getMosaicList()
    }

    created() {
        this.initData()
        this.getMosaicList()
    }
}
