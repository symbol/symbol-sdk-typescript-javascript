import {Address, MosaicId, AliasType} from "nem2-sdk"
import {mapState} from "vuex"
import {formatSeconds} from '@/core/utils/utils.ts'
import {Component, Vue} from 'vue-property-decorator'
import NamespaceEditDialog from './namespace-edit-dialog/NamespaceEditDialog.vue'
import {networkConfig} from '@/config'
import {AppMosaics, sortNamespaceList, namespaceSortTypes} from '@/core/services'
import {StoreAccount, AppInfo, MosaicNamespaceStatusType, AppNamespace} from "@/core/model"

import NamespaceUnAliasDialog
    from '@/views/service/namespace/namespace-function/namespace-list/namespace-unAlias-dialog/NamespaceUnAliasDialog.vue'
import NamespaceMosaicAliasDialog
    from '@/views/service/namespace/namespace-function/namespace-list/namespace-mosaic-alias-dialog/NamespaceMosaicAliasDialog.vue'
import NamespaceAddressAliasDialog
    from '@/views/service/namespace/namespace-function/namespace-list/namespace-address-alias-dialog/NamespaceAddressAliasDialog.vue'

@Component({
    components: {
        NamespaceEditDialog,
        NamespaceUnAliasDialog,
        NamespaceMosaicAliasDialog,
        NamespaceAddressAliasDialog

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
    currentNamespace = ''
    pageSize: number = networkConfig.namespaceListSize
    page: number = 1
    showNamespaceEditDialog = false
    showUnAliasDialog = false
    aliasDialogItem = {}
    showMosaicAliasDialog = false
    isShowAddressAliasDialog = false
    StatusString = MosaicNamespaceStatusType
    namespaceGracePeriodDuration = networkConfig.namespaceGracePeriodDuration
    namespaceSortTypes = namespaceSortTypes
    namespaceSortType: number = 1
    currentNamespaceList = []
    showExpiredNamespaces = true
    isShowMosaicAlias = false
    dataLength = 0
    sortDirection: boolean = false

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    // @TODO: Returning a boolean might be more appropriate
    get availableMosaics() {
        const {currentHeight} = this
        const {address} = this.wallet
        return AppMosaics().getAvailableToBeLinked(currentHeight, address, this.$store)
    }

    get namespaces(): AppNamespace[] {
        return this.activeAccount.namespaces
    }

    get namespaceList(): AppNamespace[] {
        const {namespaces, showExpiredNamespaces, namespaceGracePeriodDuration, currentHeight} = this
        return namespaces.filter(item => showExpiredNamespaces || item.endHeight - currentHeight > namespaceGracePeriodDuration)
    }

    get paginatedNamespaceList(): AppNamespace[] {
        const {namespaceList, namespaceSortType, sortDirection} = this
        return sortNamespaceList(namespaceSortType, namespaceList, sortDirection)
            .slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
    }

    get unlinkMosaicList() {
        const {currentHeight} = this
        const {address} = this.wallet
        return AppMosaics().getAvailableToBeLinked(currentHeight, address, this.$store)
    }

    get namespaceLoading() {
        return this.app.namespaceLoading
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    showEditDialog(namespaceName) {
        this.currentNamespace = namespaceName
        this.showNamespaceEditDialog = true
    }

    computeDuration(namespaceInfo) {
        const {endHeight, isActive} = namespaceInfo
        const {currentHeight, namespaceGracePeriodDuration} = this
        if (!isActive) {
            return MosaicNamespaceStatusType.EXPIRED
        }
        const expireTime = endHeight - currentHeight - namespaceGracePeriodDuration > 0 ? endHeight - currentHeight - namespaceGracePeriodDuration : MosaicNamespaceStatusType.EXPIRED
        return expireTime
    }

    showUnlinkDialog(aliasItem) {
        this.showUnAliasDialog = true
        this.aliasDialogItem = aliasItem
    }

    showMosaicLinkDialog(aliasItem) {
        this.showMosaicAliasDialog = true
        this.aliasDialogItem = aliasItem
    }

    showAddressLinkDialog(aliasItem) {
        this.isShowAddressAliasDialog = true
        this.aliasDialogItem = aliasItem
    }

    durationToTime(duration) {
        const {namespaceGracePeriodDuration} = this
        const durationNum = Number(duration - this.currentHeight - namespaceGracePeriodDuration)
        return formatSeconds(durationNum * 12)
    }

    getAliasType(namespace: AppNamespace): string {
        const {alias} = namespace
        if (alias.type === AliasType.Address) return 'address'
        if (alias.type === AliasType.Mosaic) return 'mosaic'
        return ''
    }
    
    getAliasTarget(namespace: AppNamespace): string {
        const {alias} = namespace
        //@ts-ignore @TODO: check when on E3
        if (alias.type === AliasType.Address) return Address.createFromEncoded(alias.address).pretty()
        if (alias.type === AliasType.Address) return alias.mosaicId.toHex()
        return ''
    }

    async handleChange(page) {
        this.page = page
    }
}
