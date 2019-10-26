import {AliasType} from "nem2-sdk"
import {mapState} from "vuex"
import {formatSeconds} from '@/core/utils'
import {Component, Vue} from 'vue-property-decorator'
import NamespaceEditDialog from './namespace-edit-dialog/NamespaceEditDialog.vue'
import {Message, networkConfig} from '@/config'
import {sortNamespaceList, namespaceSortTypes, setNamespaces} from '@/core/services'
import {StoreAccount, AppInfo, MosaicNamespaceStatusType, AppNamespace} from "@/core/model"
import Alias from '@/components/forms/alias/Alias.vue'

@Component({
    components: {
        NamespaceEditDialog,
        Alias,
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})

export class NamespaceListTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    pageSize: number = networkConfig.namespaceListSize
    page: number = 1
    showNamespaceEditDialog = false
    showAliasDialog = false
    StatusString = MosaicNamespaceStatusType
    namespaceGracePeriodDuration = networkConfig.namespaceGracePeriodDuration
    namespaceSortTypes = namespaceSortTypes
    namespaceSortType: number = 1
    currentNamespaceList = []
    showExpiredNamespaces = true
    isShowMosaicAlias = false
    dataLength = 0
    sortDirection: boolean = false
    bind: boolean = false
    namespace: AppNamespace = null
    mosaic: string = null
    address: string = null
    isShowExpiredNamespace = false
    disabled: boolean = false
    namespaceRefreshTimestamp = new Date().valueOf()

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    get node() {
        return this.activeAccount.node
    }

    get namespaces(): AppNamespace[] {
        return this.activeAccount.namespaces
    }

    get namespaceList(): AppNamespace[] {
        const {namespaces, isShowExpiredNamespace, namespaceGracePeriodDuration, currentHeight} = this
        return namespaces
            .filter(item => item.alias
                && (isShowExpiredNamespace || item.endHeight - currentHeight + namespaceGracePeriodDuration > 0))
    }

    get paginatedNamespaceList(): AppNamespace[] {
        const {namespaceList, namespaceSortType, sortDirection} = this
        return sortNamespaceList(namespaceSortType, namespaceList, sortDirection)
            .slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
    }

    get namespaceLoading() {
        return this.app.namespaceLoading
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    showEditDialog(namespace: AppNamespace) {
        this.namespace = namespace
        this.showNamespaceEditDialog = true
    }

    toggleIsShowExpiredNamespace() {
        this.isShowExpiredNamespace = !this.isShowExpiredNamespace
    }

    // @TODO: refactor
    computeDuration(namespace: AppNamespace): number | MosaicNamespaceStatusType.EXPIRED {
        const {endHeight, isActive} = namespace

        const {currentHeight, namespaceGracePeriodDuration} = this
        if (!isActive) {
            return MosaicNamespaceStatusType.EXPIRED
        }
        const expireTime = endHeight - currentHeight + namespaceGracePeriodDuration > 0
            ? endHeight - currentHeight + namespaceGracePeriodDuration
            : MosaicNamespaceStatusType.EXPIRED

        return expireTime
    }

    // @TODO: refactor
    durationToTime(duration) {
        const {namespaceGracePeriodDuration} = this
        const durationNum = Number(duration - this.currentHeight + namespaceGracePeriodDuration)
        return formatSeconds(durationNum * 12)
    }

    unbindItem(namespace: AppNamespace) {
        this.showAliasDialog = true
        this.bind = false
        this.address = namespace.alias.address ? namespace.alias.address.plain() : null
        this.mosaic = namespace.alias.mosaicId ? namespace.alias.mosaicId.toHex() : null
        this.namespace = namespace
    }

    bindItem(namespace: AppNamespace) {
        this.showAliasDialog = true
        this.bind = true
        this.address = null
        this.mosaic = null
        this.namespace = namespace
    }

    getAliasType(namespace: AppNamespace): string {
        const {alias} = namespace
        if (alias.type === AliasType.Address) return 'address'
        if (alias.type === AliasType.Mosaic) return 'mosaic'
        return ''
    }

    getAliasTarget(namespace: AppNamespace): string {
        const {alias} = namespace
        if (alias.type === AliasType.Address) return alias.address.plain()
        if (alias.type === AliasType.Mosaic) return alias.mosaicId.toHex()
        return ''
    }

    async refreshNamespaceList() {
        const {wallet, namespaceRefreshTimestamp} = this
        const currentTimestamp = new Date().valueOf()
        if (currentTimestamp - namespaceRefreshTimestamp <= 2000) {
            this.$Notice.destroy()
            this.$Notice.warning({title: '' + this.$t(Message.REFRESH_TOO_FAST_WARNING)})
            return
        }
        try {
            this.namespaceRefreshTimestamp = currentTimestamp
            await setNamespaces(wallet.address, this.$store)
            this.$Notice.destroy()
            this.$Notice.success({title: '' + this.$t(Message.SUCCESS)})
        } catch (error) {
            console.error("App ->  refresh namespace list-> error", error)
        }
    }

    async handleChange(page) {
        this.page = page
    }
}
