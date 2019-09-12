import {Address, MosaicId} from "nem2-sdk"
import {Component, Vue, Watch} from 'vue-property-decorator'
import EditDialog from './mosaic-edit-dialog/MosaicEditDialog.vue'
import MosaicAliasDialog from './mosaic-alias-dialog/MosaicAliasDialog.vue'
import MosaicUnAliasDialog from './mosaic-unAlias-dialog/MosaicUnAliasDialog.vue'
import {getMosaicList, getMosaicInfoList} from '@/core/utils/wallet'
import {mapState} from "vuex"
import {formatNumber} from "@/core/utils/utils"
import {aliasType} from "@/config"

@Component({
    components: {
        MosaicAliasDialog,
        MosaicUnAliasDialog,
        EditDialog
    },
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class MosaicListTs extends Vue {
    activeAccount: any
    app: any
    isLoadingConfirmedTx = true
    currentTab: number = 0
    rootNameList: any[] = []
    showCheckPWDialog = false
    showMosaicEditDialog = false
    showMosaicAliasDialog = false
    showMosaicUnAliasDialog = false
    mosaicMapInfo: any = {}
    selectedMosaic: any = {}

    get currentXem() {
        return this.activeAccount.currentXem
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get currentXEM2() {
        return this.activeAccount.currentXEM2
    }


    get generationHash() {
        return this.activeAccount.generationHash
    }

    get accountPublicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get accountAddress() {
        return this.activeAccount.wallet.address
    }

    get node() {
        return this.activeAccount.node
    }

    get getWallet() {
        return this.activeAccount.wallet
    }

    get ConfirmedTxList() {
        return this.activeAccount.ConfirmedTx
    }

    get nowBlockHeihgt() {
        return this.app.chainStatus.currentHeight
    }

    get namespaceMap() {
        let namespaceMap = {}
        this.activeAccount.namespace.forEach((item) => {
            switch (item.alias.type) {
                case (aliasType.addressAlias):
                    //@ts-ignore
                    namespaceMap[Address.createFromEncoded(item.alias.address).address] = item
                    break
                case (aliasType.mosaicAlias):
                    namespaceMap[new MosaicId(item.alias.mosaicId).toHex()] = item
            }
        })
        return namespaceMap
    }

    showCheckDialog() {
        this.showCheckPWDialog = true
    }

    formatNumber(number) {
        return formatNumber(number)
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

    async initMosaic() {
        const that = this
        let {accountPublicKey, accountAddress, node, currentXem, namespaceMap} = this
        let mosaicMapInfo: any = {}
        mosaicMapInfo.length = 0
        let existMosaics: any = []
        const mosaicList: any = await getMosaicList(accountAddress, node)
        let mosaicIdList: any = mosaicList.map((item) => {
            return item.id
        })
        const mosaicListInfo: any = await getMosaicInfoList(node, mosaicIdList,this.nowBlockHeihgt)
        mosaicListInfo.map((mosaicInfo) => {
            const mosaicHex = mosaicInfo.mosaicId.id.toHex()
            if (mosaicInfo.owner.publicKey !== accountPublicKey) {
                return
            }
            mosaicInfo.hex = mosaicHex.toUpperCase()
            mosaicInfo.supply = mosaicInfo.supply.compact()
            mosaicInfo.supplyMutable = mosaicInfo.properties.supplyMutable
            mosaicInfo._divisibility = mosaicInfo.properties.divisibility
            mosaicInfo.transferable = mosaicInfo.properties.transferable
            if (that.computeDuration(mosaicInfo) === 'Forever' || that.computeDuration(mosaicInfo) > 0) {
                existMosaics.push(new MosaicId(mosaicInfo.hex))
            }
            mosaicMapInfo.length += 1
            if (mosaicHex == that.currentXEM1 || mosaicHex == that.currentXEM2) {
                mosaicInfo.name = currentXem
            } else {
                mosaicInfo.name = namespaceMap[mosaicHex] ? namespaceMap[mosaicHex].name : ''
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

    @Watch('getWallet.address')
    onGetWalletChange() {
        this.initMosaic()
    }

    @Watch('ConfirmedTxList')
    onConfirmedTxChange() {
        this.initMosaic()
    }

    created() {
        this.initMosaic()
    }
}
