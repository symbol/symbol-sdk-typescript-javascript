import {Address, MosaicId, AliasType, NamespaceInfo} from "nem2-sdk"
import {mapState} from "vuex"
import {formatSeconds} from '@/core/utils/utils.ts'
import {Component, Vue} from 'vue-property-decorator'
import NamespaceEditDialog from './namespace-edit-dialog/NamespaceEditDialog.vue'
import {networkConfig} from '@/config'
import {sortNamespaceList, namespaceSortTypes} from '@/core/services'
import {StoreAccount, AppInfo, MosaicNamespaceStatusType, AppNamespace} from "@/core/model"
import Alias from '@/views/forms/alias/Alias.vue'

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

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    get namespaces(): AppNamespace[] {
        return this.activeAccount.namespaces
    }

    get namespaceList(): AppNamespace[] {
        const {namespaces, isShowExpiredNamespace, namespaceGracePeriodDuration, currentHeight} = this
        return namespaces
            .filter(item => isShowExpiredNamespace || item.endHeight - currentHeight + namespaceGracePeriodDuration > 0)
    }

    get paginatedNamespaceList(): AppNamespace[] {
        let {namespaceList, namespaceSortType, sortDirection} = this
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

    toggleIsShowExpirednamespace(){
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
        this.mosaic = namespace.alias.mosaicId + '' || null
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
        if (alias.type === AliasType.Address) return alias.address
        if (alias.type === AliasType.Mosaic) return alias.mosaicId
        return ''
    }

    async handleChange(page) {
        this.page = page
    }
}
