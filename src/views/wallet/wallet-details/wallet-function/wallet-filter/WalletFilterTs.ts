import {Component, Vue} from 'vue-property-decorator'
import {RestrictionApiRxjs} from '@/core/api/RestrictionApiRxjs.ts'
import {Message} from "@/config/index.ts"
import {mapState} from "vuex"
import {
    Account,
    RestrictionType,
    AccountRestrictionTransaction,
    Deadline,
    UInt64,
    AccountRestrictionModification,
    RestrictionModificationType,
    Address, MosaicId,
    Password
} from "nem2-sdk"
import { transactionTypeConfig } from '@/config/view/transaction'
import {AppWallet} from "@/core/model"

@Component({
    computed: {...mapState({activeAccount: 'account'})},
})
export class WalletFilterTs extends Vue {
    entityTypeList = transactionTypeConfig
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
        fee: .5,
        password: '',
    }

    namespaceList = []

    clearCurrentFilter() {
        this.currentFilter = ''
    }


    get node() {
        return this.activeAccount.node
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get address() {
        return this.activeAccount.wallet.address
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
            fee: .5,
            password: '',
        }
    }

    addFilterItem(modificationType) {
        if (this.currentFilter === '') {
            return
        }
        if (this.filterTypeList[2]) {
            this.formItem.filterList.unshift({
                label: this.$t(this.currentFilter) + '(' + transactionTypeConfig[this.currentFilter].value + ')',
                value: transactionTypeConfig[this.currentFilter].value,
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

        if (this.formItem.password.length < 8) {
            this.showErrorMessage(this.$t('password_error'))
            return false
        }

        const validPassword = new AppWallet(this.wallet).checkPassword(new Password(this.formItem.password))

        if (!validPassword) {
            this.showErrorMessage(this.$t('password_error'))
            return false
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
        const password = new Password(this.formItem.password)
        new AppWallet(this.getWallet).signAndAnnounceNormal(password, node, generationHash, [addressRestrictionTransaction], this)
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
        const password = new Password(this.formItem.password)
        new AppWallet(this.getWallet).signAndAnnounceNormal(password, node, generationHash, [addressRestrictionTransaction], this)
    }

    switchRestrictionType(privatekey) {
        let {filterType} = this.formItem
        const {networkType} = this.getWallet
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

    getAccountRestriction() {
        // TODO update while sdk complete
        if (!this.wallet) {
            return
        }
        const {node, address} = this
        new RestrictionApiRxjs().getRestrictionInfo(node, address).subscribe((restrictionInfo) => {
        })
    }

}
