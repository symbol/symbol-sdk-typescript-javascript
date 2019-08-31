import {WalletApiRxjs} from "@/core/api/WalletApiRxjs.ts"
import {Component, Vue} from 'vue-property-decorator'
import {RestrictionApiRxjs} from '@/core/api/RestrictionApiRxjs.ts'
import {Message, entityTypeList} from "@/config/index.ts"
import {decryptKey, signAndAnnounceNormal} from "@/core/utils/wallet"
import {mapState} from "vuex"
import {
    Account,
    RestrictionType,
    AccountRestrictionTransaction,
    Deadline,
    UInt64,
    AccountRestrictionModification,
    RestrictionModificationType,
    Address, MosaicId
} from "nem2-sdk"

@Component({
    computed: {...mapState({activeAccount: 'account'})},
})
export class WalletFilterTs extends Vue {
    entityTypeList = entityTypeList
    aliasList = []
    activeAccount: any
    isShowDialog = false
    isShowDeleteIcon = false
    currentAlias: any = false
    RestrictionModificationType = RestrictionModificationType
    currentTitle = 'add_address'
    currentFilter: any = ''
    filterTypeList = [true, false]
    titleList = ['add_address', 'add_mosaic']
    RestrictionType = RestrictionType
    showRestrictionType = true
    formItem = {
        filterType: RestrictionType.AllowAddress,
        filterList: [],
        fee: 50000,
        password: '',
    }

    namespaceList = []

    clearCurrentFilter() {
        this.currentFilter = ''
    }


    get node() {
        return this.activeAccount.node
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }


    get getWallet() {
        return this.activeAccount.wallet
    }

    initForm() {
        this.currentFilter = ''
        this.formItem = {
            filterType: RestrictionType.AllowAddress,
            filterList: [],
            fee: 50000,
            password: '',
        }
    }

    addFilterItem(modificationType) {
        if (this.currentFilter === '') {
            return
        }
        if (this.filterTypeList[2]) {
            this.formItem.filterList.unshift({
                label: this.$t(this.currentFilter) + '(' + entityTypeList[this.currentFilter].value + ')',
                value: entityTypeList[this.currentFilter].value,
                modificationType
            })
            return
        }
        this.formItem.filterList.unshift({
            label: this.currentFilter,
            value: this.currentFilter,
            modificationType
        })
        this.clearCurrentFilter()
    }

    removeFilterItem(index) {
        this.formItem.filterList.splice(index, 1)
    }

    showFilterTypeListIndex(index) {
        this.initForm()
        this.currentTitle = this.titleList[index]
        this.filterTypeList = [false, false, false]
        this.filterTypeList[index] = true
        if (index === 0) {
            this.formItem.filterType = RestrictionType.AllowAddress
            return
        }
        if (index === 1) {
            this.formItem.filterType = RestrictionType.AllowMosaic
            return
        }
        if (index === 2) {
            this.formItem.filterType = RestrictionType.AllowTransaction
            return
        }
    }

    checkForm(): boolean {
        const {filterTypeList} = this
        const {fee, password, filterList} = this.formItem
        if (!password || !password.trim()) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return false
        }

        if ((!Number(fee) && Number(fee) !== 0) || Number(fee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
            return false
        }

        if (filterTypeList[0]) {
            const flag = filterList.every((item) => {
                return item.value.length >= 40
            })
            if (!flag) {
                this.showErrorMessage(this.$t(Message.ADDRESS_FORMAT_ERROR))
            }
            return flag
        }

        if (filterTypeList[1]) {
            const flag = filterList.every((item) => {
                return item.value.length >= 16
            })
            if (!flag) {
                this.showErrorMessage(this.$t(Message.MOSAIC_HEX_FORMAT_ERROR))
            }
            return flag
        }
        return true
    }

    showErrorMessage(message) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    confirmInput() {
        if (!this.checkForm()) return
        this.checkPassword()
    }

    showNotice() {
        this.$Notice.success({
            title: this.$t(Message.SUCCESS) + ''
        })
    }

    generateAddressRestriction(account: Account) {
        const {networkType} = this.getWallet
        let {filterList, filterType, fee} = this.formItem
        const {node, generationHash} = this
        const addressRestriction = filterList.map((item) => {
            return AccountRestrictionModification.createForAddress(item.modificationType, Address.createFromRawAddress(item.value))
        })
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            filterType,
            addressRestriction,
            networkType,
            UInt64.fromUint(fee)
        )
        signAndAnnounceNormal(account, node, generationHash, [addressRestrictionTransaction], this.showNotice)
    }


    generateMosaicRestriction(account: Account) {
        const {networkType} = this.getWallet
        let {filterList, filterType, fee} = this.formItem
        const {node, generationHash} = this
        const mosaicRestriction = filterList.map((item) => {
            return AccountRestrictionModification.createForMosaic(item.modificationType, new MosaicId(item.value))
        })
        const addressRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
            Deadline.create(),
            filterType,
            mosaicRestriction,
            networkType,
            UInt64.fromUint(fee)
        )
        signAndAnnounceNormal(account, node, generationHash, [addressRestrictionTransaction], this.showNotice)
    }

    switchRestrictionType(privatekey) {
        let {filterType, filterList} = this.formItem
        const {networkType} = this.$store.state.account.wallet
        const account = Account.createFromPrivateKey(privatekey, networkType)
        switch (filterType) {
            case RestrictionType.AllowAddress:
            case RestrictionType.BlockAddress:
                this.generateAddressRestriction(account)
                break
            case RestrictionType.AllowMosaic:
            case RestrictionType.BlockMosaic:
                this.generateMosaicRestriction(account)
                break
            case RestrictionType.AllowTransaction:
            case RestrictionType.BlockTransaction:
                break
        }
    }


    checkPassword() {
        const DeTxt = decryptKey(this.getWallet, this.formItem.password).trim()
        try {
            new WalletApiRxjs().getWallet(
                this.getWallet.name,
                DeTxt.length === 64 ? DeTxt : '',
                this.getWallet.networkType,
            )
            this.switchRestrictionType(DeTxt)
        } catch (e) {
            console.log(e)
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }

    getAccountRestriction() {
        // TODO update while sdk complete
        if (!this.$store.state.account.wallet) {
            return
        }
        const {node} = this.$store.state.account
        const {address} = this.$store.state.account.wallet
        new RestrictionApiRxjs().getRestrictionInfo(node, address).subscribe((restrictionInfo) => {
        })
    }


    created() {

    }

}
