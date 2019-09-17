import {formatSeconds} from '@/core/utils/utils.ts'
import {Component, Vue} from 'vue-property-decorator'
import NamespaceEditDialog from './namespace-edit-dialog/NamespaceEditDialog.vue'
import {mapState} from "vuex"
import {networkConfig} from '@/config/index.ts'
import {Address, MosaicId} from "nem2-sdk"
import NamespaceUnAliasDialog
    from '@/views/service/namespace/namespace-function/namespace-list/namespace-unAlias-dialog/NamespaceUnAliasDialog.vue'
import NamespaceMosaicAliasDialog
    from '@/views/service/namespace/namespace-function/namespace-list/namespace-mosaic-alias-dialog/NamespaceMosaicAliasDialog.vue'
import NamespaceAddressAliasDialog
    from '@/views/service/namespace/namespace-function/namespace-list/namespace-address-alias-dialog/NamespaceAddressAliasDialog.vue'
import {AppMosaics} from '@/core/services/mosaics'
import {aliasType} from "@/config/types";
import { StatusString } from '@/config/view'

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
    activeAccount: any
    app: any
    currentNamespace = ''
    showNamespaceEditDialog = false
    showUnAliasDialog = false
    aliasDialogItem = {}
    showMosaicAliasDialog = false
    isShowAddressAliasDialog = false
    StatusString = StatusString
    namespaceGracePeriodDuration = networkConfig.namespaceGracePeriodDuration

    get namespaceList() {
        const namespaceList = this.activeAccount.namespace.map((item) => {
            switch (item.alias.type) {
                case (aliasType.noAlias):
                    item.aliasTarget = StatusString.NO_ALIAS
                    item.aliasType = StatusString.NO_ALIAS
                    item.isLinked = false
                    break
                case (aliasType.addressAlias):
                    //@ts-ignore
                    item.aliasTarget = Address.createFromEncoded(item.alias.address).address
                    item.aliasType = 'address'
                    item.isLinked = true
                    break
                case (aliasType.mosaicAlias):
                    item.aliasTarget = new MosaicId(item.alias.mosaicId).toHex()
                    item.aliasType = 'mosaic'
                    item.isLinked = true
            }
            return item
        })
        return namespaceList
    }

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get availableMosaics() {
        const {mosaics, currentHeight} = this
        const {address} = this.wallet
        const appMosaics = AppMosaics()
        appMosaics.init(mosaics)
        return appMosaics.getAvailableToBeLinked(currentHeight, address)
    }

    get unlinkMosaicList() {
        const {mosaics, currentHeight} = this
        const {address} = this.wallet
        const appMosaics = AppMosaics()
        appMosaics.init(mosaics)
        return appMosaics.getAvailableToBeLinked(currentHeight, address)
    }

    get namespaceLoading() {
        return this.app.namespaceLoading
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    closeMosaicAliasDialog() {
        this.showMosaicAliasDialog = false
    }

    closeUnAliasDialog() {
        this.showUnAliasDialog = false
    }

    showEditDialog(namespaceName) {
        this.currentNamespace = namespaceName
        this.showNamespaceEditDialog = true
    }

    closeNamespaceEditDialog() {
        this.showNamespaceEditDialog = false
    }

    closeAddressAliasDialog() {
        this.isShowAddressAliasDialog = false
    }

    computeDuration(namespaceInfo) {
        const {endHeight, isActive} = namespaceInfo
        const {currentHeight, namespaceGracePeriodDuration} = this
        if (!isActive) {
            return StatusString.EXPIRED
        }
        const expireTime = endHeight - currentHeight > namespaceGracePeriodDuration ? endHeight - currentHeight : StatusString.EXPIRED
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
        const durationNum = Number(duration - this.currentHeight)
        return formatSeconds(durationNum * 12)
    }

}
