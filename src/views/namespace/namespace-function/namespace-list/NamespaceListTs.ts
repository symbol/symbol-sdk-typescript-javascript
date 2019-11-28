import {AliasType} from "nem2-sdk"
import {mapState} from "vuex"
import {Component, Vue} from 'vue-property-decorator'
import {Message, networkConfig} from '@/config'
import {sortNamespaceList, namespaceSortTypes, setNamespaces} from '@/core/services'
import {StoreAccount, AppInfo, AppNamespace} from "@/core/model"
import NamespaceRegistration from '@/components/forms/namespace-registration/NamespaceRegistration.vue'
import Alias from '@/components/forms/alias/Alias.vue'

@Component({
    components: {
        NamespaceRegistration,
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
    namespaceSortTypes = namespaceSortTypes
    namespaceSortType: number = 1
    showExpiredNamespaces = true
    sortDirection: boolean = false
    bind: boolean = false
    namespace: AppNamespace = null
    mosaic: string = null
    address: string = null
    isShowExpiredNamespace = true
    namespaceRefreshTimestamp = new Date().valueOf()

    get wallet() {
        return this.activeAccount.wallet
    }

    get namespaces(): AppNamespace[] {
        return this.activeAccount.namespaces
    }

    get namespaceList(): AppNamespace[] {
        const {namespaces, isShowExpiredNamespace, currentHeight} = this
        return namespaces
            .filter((item: AppNamespace )=> item.alias
                && (isShowExpiredNamespace || !item.expirationInfo(currentHeight).expired))
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

    displayDuration(namespace: AppNamespace): {expired: boolean, time: string} {
        const {currentHeight} = this
        if (!currentHeight) return {expired: false, time: '-'}

        const {
            expired,
            remainingBeforeExpiration,
            remainingBeforeDeletion,  
        } = namespace.expirationInfo(currentHeight)

        return {
            expired,
            time: expired ? remainingBeforeDeletion.time : remainingBeforeExpiration.time
        }
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
