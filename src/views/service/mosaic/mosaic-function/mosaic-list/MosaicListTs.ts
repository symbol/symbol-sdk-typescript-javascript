import {mapState} from "vuex"
import {Address, AliasType, MosaicId} from "nem2-sdk"
import {Component, Vue, Watch} from 'vue-property-decorator'
import EditDialog from './mosaic-edit-dialog/MosaicEditDialog.vue'
import MosaicAliasDialog from './mosaic-alias-dialog/MosaicAliasDialog.vue'
import MosaicUnAliasDialog from './mosaic-unAlias-dialog/MosaicUnAliasDialog.vue'
import {formatNumber} from '@/core/utils'
import {mosaicSortType} from "@/config/view/mosaic"
import {
    sortById,
    sortBySupply,
    sortByDivisibility,
    sortByTransferable,
    sortBySupplyMutable,
    sortByDuration,
    sortByRestrictable,
    sortByAlias
} from '@/core/services/mosaics/methods.ts'
import {networkConfig} from "@/config"
import {MosaicNamespaceStatusType} from "@/core/model"

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
    isLoadingConfirmedTx = false
    currentTab: number = 0
    currentPage: number = 1
    pageSize: number = networkConfig.namespaceListSize
    rootNameList: any[] = []
    screenMosaic: any = {}
    showCheckPWDialog = false
    showMosaicEditDialog = false
    showMosaicAliasDialog = false
    showMosaicUnAliasDialog = false
    mosaicMapInfo: any = {}
    selectedMosaic: any = {}
    currentSortType = mosaicSortType.byId
    mosaicSortType = mosaicSortType
    currentMosaicList = []
    isShowExpiredMosaic = false

    get currentXem() {
        return this.activeAccount.currentXem
    }

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get generationHash() {
        return this.activeAccount.generationHash
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

    get nowBlockHeight() {
        return this.app.chainStatus.currentHeight
    }

    get mosaicsLoading() {
        return this.app.mosaicsLoading
    }

    get namespaceMap() {
        let namespaceMap = {}
        this.activeAccount.namespaces.forEach((item) => {
            switch (item.alias.type) {
                case (AliasType.Address):
                    //@ts-ignore
                    namespaceMap[Address.createFromEncoded(item.alias.address).address] = item
                    break
                case (AliasType.Mosaic):
                    namespaceMap[new MosaicId(item.alias.mosaicId).toHex()] = item
            }
        })
        return namespaceMap
    }

    get publicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    showCheckDialog() {
        this.showCheckPWDialog = true
    }

    toggleChange(page) {
        this.currentPage = page
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

    computeDuration(item) {
        if (!item.mosaicInfo) return 'Loading...'
        const {properties, height} = item.mosaicInfo
        if (properties.duration.compact() === 0) return 'Forever'
        return (height.compact() + properties.duration.compact()) - this.nowBlockHeight
    }

    getSortType(type) {
        this.currentSortType = type
        const currentMosaicList = [...this.currentMosaicList]
        switch (type) {
            case mosaicSortType.byId:
                this.currentMosaicList = sortById(currentMosaicList)
                break
            case mosaicSortType.byDuration:
                this.currentMosaicList = sortByDuration(currentMosaicList)
                break
            case mosaicSortType.byAlias:
                this.currentMosaicList = sortByAlias(currentMosaicList)
                break
            case mosaicSortType.byRestrictable:
                this.currentMosaicList = sortByRestrictable(currentMosaicList)
                break
            case mosaicSortType.bySupply:
                this.currentMosaicList = sortBySupply(currentMosaicList)
                break
            case mosaicSortType.byTransferable:
                this.currentMosaicList = sortByTransferable(currentMosaicList)
                break
            case mosaicSortType.byDivisibility:
                this.currentMosaicList = sortByDivisibility(currentMosaicList)
                break
            case mosaicSortType.bySupplyMutable:
                this.currentMosaicList = sortBySupplyMutable(currentMosaicList)
                break
        }
    }

    toggleIsShowExpiredMosaic() {
        const {isShowExpiredMosaic, currentHeight} = this
        const list = Object.values(this.mosaics)
        this.currentMosaicList = list.filter((item: any) => isShowExpiredMosaic || item.expirationHeight == MosaicNamespaceStatusType.FOREVER || item.expirationHeight > currentHeight)
        this.isShowExpiredMosaic = !isShowExpiredMosaic
    }

    intiMosaics() {
        this.getSortType(this.currentSortType)
        this.currentMosaicList = Object.values(this.mosaics)
    }

    @Watch('mosaics', {deep: true})
    onMosiacsChange() {
        this.intiMosaics()
    }

    mounted() {
        this.intiMosaics()
    }


}
