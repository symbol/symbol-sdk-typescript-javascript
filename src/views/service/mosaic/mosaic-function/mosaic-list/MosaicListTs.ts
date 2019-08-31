import {MosaicId, Mosaic} from "nem2-sdk"
import {MosaicApiRxjs} from '@/core/api/MosaicApiRxjs.ts'
import {AccountApiRxjs} from '@/core/api/AccountApiRxjs.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import EditDialog from './mosaic-edit-dialog/MosaicEditDialog.vue'
import MosaicAliasDialog from './mosaic-alias-dialog/MosaicAliasDialog.vue'
import MosaicUnAliasDialog from './mosaic-unAlias-dialog/MosaicUnAliasDialog.vue'
import {getMosaicList, getMosaicInfoList} from '@/core/utils/wallet'

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


    async initMosaic() {
        const that = this
        let {accountPublicKey, accountAddress, node, currentXem} = this
        let mosaicMapInfo: any = {}
        mosaicMapInfo.length = 0
        let existMosaics: any = []
        const mosaicList: any = await getMosaicList(accountAddress, node)
        let mosaicIdList: any = mosaicList.map((item) => {
            return item.id
        })
        const mosaicListInfo: any = await getMosaicInfoList(node, mosaicIdList)
        mosaicListInfo.map((mosaicInfo) => {
            if (mosaicInfo.owner.publicKey !== accountPublicKey) {
                return
            }
            mosaicInfo.hex = mosaicInfo.mosaicId.id.toHex().toUpperCase()
            mosaicInfo.supply = mosaicInfo.supply.compact()
            mosaicInfo.supplyMutable = mosaicInfo.properties.supplyMutable
            mosaicInfo._divisibility = mosaicInfo.properties.divisibility
            mosaicInfo.transferable = mosaicInfo.properties.transferable
            if (that.computeDuration(mosaicInfo) === 'Forever' || that.computeDuration(mosaicInfo) > 0) {
                existMosaics.push(new MosaicId(mosaicInfo.hex))
            }
            mosaicMapInfo.length += 1
            if (mosaicInfo.mosaicId.id.toHex() == that.currentXEM1 || mosaicInfo.mosaicId.id.toHex() == that.currentXEM2) {
                mosaicInfo.name = currentXem
            } else {
                mosaicInfo.name = ''
            }
            mosaicMapInfo[mosaicInfo.hex] = mosaicInfo
        })
        mosaicIdList.map((item: any) => {
            return new MosaicId(item)
        })
        that.mosaicMapInfo = mosaicMapInfo
        that.isLoadingConfirmedTx = false
    }

    computeDuration(item) {
        let continuousTime
        if (item.properties.duration.compact() === 0) {
            continuousTime = 'Forever'
            return continuousTime
        }
        continuousTime = (item.height.compact() + item.properties.duration.compact()) - this.nowBlockHeihgt
        return continuousTime

    }

    @Watch('getWallet')
    onGetWalletChange() {
        this.initData()
        this.initMosaic()
    }

    @Watch('ConfirmedTxList')
    onConfirmedTxChange() {
        this.initMosaic()
    }

    created() {
        this.initData()
        this.initMosaic()
    }
}
