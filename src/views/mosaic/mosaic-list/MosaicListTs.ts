import {mapState} from "vuex"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {formatNumber} from '@/core/utils'
import {mosaicSortType} from "@/config/view/mosaic"
import {Message, networkConfig} from "@/config"
import {AppInfo, AppMosaic, AppNamespace, MosaicNamespaceStatusType, StoreAccount} from "@/core/model"
import {setMosaics, sortMosaicList} from "@/core/services"
import Alias from '@/components/forms/alias/Alias.vue'
import MosaicSupplyChange from '@/components/forms/mosaic-supply-change/MosaicSupplyChange.vue'

@Component({
    components: {
        Alias,
        MosaicSupplyChange,
    },
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class MosaicListTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    currentPage: number = 1
    pageSize: number = networkConfig.namespaceListSize
    showCheckPWDialog = false
    showMosaicEditDialog = false
    selectedMosaic: AppMosaic = null
    currentSortType = mosaicSortType.byId
    mosaicSortType = mosaicSortType
    currentMosaicList = []
    isShowExpiredMosaic = false
    sortDirection = true
    mosaicRefreshTimestamp = new Date().valueOf()
    showAliasDialog: boolean = false
    bind: boolean = false
    namespace: AppNamespace = null
    mosaic: string = null
    address: string = null
    MosaicNamespaceStatusType = MosaicNamespaceStatusType
    formatNumber = formatNumber

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

    get wallet() {
        return this.activeAccount.wallet
    }

    mosaicSupplyAmount(value) {
        if (!value.mosaicInfo) return 0
        return formatNumber(value.mosaicInfo.supply.compact())
    }

    toggleChange(page) {
        this.currentPage = page
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
        if (duration === 0) return MosaicNamespaceStatusType.FOREVER
        return (mosaicInfo.height.compact() + duration) - this.currentHeight
    }

    getSortType(type: number) {
        const preSortType = this.currentSortType
        this.currentSortType = type
        if (preSortType == type) {
            this.currentMosaicList.sort(() => -1)
            this.sortDirection = !this.sortDirection
            return
        }
        this.sortDirection = true
        const currentMosaicList = [...this.currentMosaicList]
        this.currentMosaicList = sortMosaicList(type, currentMosaicList)
    }


    toggleIsShowExpiredMosaic() {
        const {isShowExpiredMosaic, currentHeight} = this
        const list = Object.values(this.mosaics)
        this.currentMosaicList = list.filter((item: any) => isShowExpiredMosaic || item.expirationHeight == MosaicNamespaceStatusType.FOREVER || item.expirationHeight > currentHeight)
        this.isShowExpiredMosaic = !this.isShowExpiredMosaic
    }

    intiMosaics() {
        this.getSortType(this.currentSortType)
        this.currentMosaicList = Object.values(this.mosaics)
    }

    async refreshMosaicList() {
        const {mosaicRefreshTimestamp, wallet} = this
        const currentTimestamp = new Date().valueOf()
        if (currentTimestamp - mosaicRefreshTimestamp <= 2000) {
            this.$Notice.destroy()
            this.$Notice.warning({title: '' + this.$t(Message.REFRESH_TOO_FAST_WARNING)})
            return
        }
        try {
            setMosaics(wallet, this.$store)
            this.mosaicRefreshTimestamp = currentTimestamp
            this.$Notice.destroy()
            this.$Notice.success({title: '' + this.$t(Message.SUCCESS)})
        } catch (e) {
            console.error("App -> refresh mosaic list-> error", e)
        }

    }

    // @TODO: Watch and mounted should not be necessary
    @Watch('mosaics', {deep: true})
    onMosaicChange() {
        this.intiMosaics()
    }

    mounted() {
        this.intiMosaics()
    }
}
