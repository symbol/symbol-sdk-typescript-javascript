import {mapState} from "vuex"
import {Address, MosaicId} from "nem2-sdk"
import {Component, Vue} from 'vue-property-decorator'
import EditDialog from './mosaic-edit-dialog/MosaicEditDialog.vue'
import MosaicAliasDialog from './mosaic-alias-dialog/MosaicAliasDialog.vue'
import MosaicUnAliasDialog from './mosaic-unAlias-dialog/MosaicUnAliasDialog.vue'
import {formatNumber} from '@/core/utils'
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
    isLoadingConfirmedTx = false
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

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
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

    get filteredMosaics() {
        const mosaics: any = Object.values(this.mosaics)
        return [...mosaics].filter(mosaic => (
            mosaic.mosaicInfo.owner.publicKey === this.accountPublicKey
        ))
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
    computeDuration(item) {
        const {properties, height} = item.mosaicInfo
        if (properties.duration.compact() === 0) return 'Forever'
        return (height.compact() + properties.duration.compact()) - this.nowBlockHeihgt
    }
}
