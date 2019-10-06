import {mapState} from "vuex"
import {Address, AliasType, MosaicId} from "nem2-sdk"
import {Component, Vue, Watch} from 'vue-property-decorator'
import EditDialog from './mosaic-edit-dialog/MosaicEditDialog.vue'
import {formatNumber} from '@/core/utils'
import {mosaicSortType} from "@/config/view/mosaic"
import {networkConfig} from "@/config"
import {MosaicNamespaceStatusType, StoreAccount, AppInfo, AppMosaic, AppNamespace} from "@/core/model"
import {
    sortByMosaicAlias, sortByMosaicDivisibility,
    sortByMosaicDuration,
    sortByMosaicId, sortByMosaicRestrictable,
    sortByMosaicSupply, sortByMosaicSupplyMutable,
    sortByMosaicTransferable
} from "@/core/services"
import Alias from '@/views/forms/alias/Alias.vue'

@Component({
    components: {
        Alias,
        EditDialog
    },
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class MosaicListTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
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
    selectedMosaic: AppMosaic = null
    currentSortType = mosaicSortType.byId
    mosaicSortType = mosaicSortType
    currentMosaicList = []
    isShowExpiredMosaic = false

    showAliasDialog: boolean = false
    bind: boolean = false
    namespace: AppNamespace = null
    mosaic: string = null
    address: string = null

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }
    get publicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get mosaicsLoading() {
        return this.app.mosaicsLoading
    }

    get namespaceMap() {
        let namespaceMap = {}
        this.activeAccount.namespaces.forEach((item) => {
            switch (item.alias.type) {
                case (AliasType.Address):
                    //@ts-ignore @TODO: E3 review
                    namespaceMap[Address.createFromEncoded(item.alias.address).address] = item
                    break
                case (AliasType.Mosaic):
                    //@ts-ignore @TODO: E3 review
                    namespaceMap[new MosaicId(item.alias.mosaicId).toHex()] = item
            }
        })
        return namespaceMap
    }

    toggleChange(page) {
        this.currentPage = page
    }

    formatNumber(number) {
        return formatNumber(number)
    }

    bindItem(mosaic: AppMosaic) {
        this.bind = true
        this.namespace = null
        this.mosaic = mosaic.hex
        this.address = null
        this.showAliasDialog = true
    }

    unbindItem(mosaic: AppMosaic) {
        const {namespaces} = this.activeAccount
        this.bind = false
        this.namespace = namespaces.find(({name}) => name === mosaic.name)
        this.mosaic = mosaic.hex
        this.address = null
        this.showAliasDialog = true
    }

    showEditDialog(item: AppMosaic) {
        this.selectedMosaic = item
        this.showMosaicEditDialog = true
    }

    computeDuration(item: AppMosaic) {
        if (!item.mosaicInfo) return 'Loading...'
        const {properties, mosaicInfo} = item
        const duration = properties.duration
        if (duration === 0) return 'Forever'
        return (mosaicInfo.height.compact() + duration) - this.currentHeight
    }

    getSortType(type: number) {
        this.currentSortType = type
        const currentMosaicList = [...this.currentMosaicList]
        switch (type) {
            case mosaicSortType.byId:
                this.currentMosaicList = sortByMosaicId(currentMosaicList)
                break
            case mosaicSortType.byDuration:
                this.currentMosaicList = sortByMosaicDuration(currentMosaicList)
                break
            case mosaicSortType.byAlias:
                this.currentMosaicList = sortByMosaicAlias(currentMosaicList)
                break
            case mosaicSortType.byRestrictable:
                this.currentMosaicList = sortByMosaicRestrictable(currentMosaicList)
                break
            case mosaicSortType.bySupply:
                this.currentMosaicList = sortByMosaicSupply(currentMosaicList)
                break
            case mosaicSortType.byTransferable:
                this.currentMosaicList = sortByMosaicTransferable(currentMosaicList)
                break
            case mosaicSortType.byDivisibility:
                this.currentMosaicList = sortByMosaicDivisibility(currentMosaicList)
                break
            case mosaicSortType.bySupplyMutable:
                this.currentMosaicList = sortByMosaicSupplyMutable(currentMosaicList)
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
    onMosaicChange() {
        this.intiMosaics()
    }

    mounted() {
        this.intiMosaics()
    }


}
