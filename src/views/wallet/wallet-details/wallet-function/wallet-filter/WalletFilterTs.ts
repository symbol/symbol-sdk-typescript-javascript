import {Message, entityTypeList} from "@/config"
import {Component, Vue} from 'vue-property-decorator'
import {creatrModifyAccountPropertyTransaction} from '@/core/utils/wallet'
import {Account, Crypto, PropertyType} from "nem2-sdk";
import {walletApi} from "@/core/api/walletApi";
import {transactionApi} from "@/core/api/transactionApi";

@Component
export class WalletFilterTs extends Vue {
    entityTypeList = entityTypeList
    aliasList = []
    isShowDialog = false
    isShowDeleteIcon = false
    currentAlias: any = false
    currentTitle = 'add_address'
    currentFilter: any = ''
    filterTypeList = [true, false, false]
    titleList = ['add_address', 'add_mosaic', 'add_entity_type']
    PropertyType = PropertyType
    showPropertyType = true
    formItem = {
        filterType: PropertyType.AllowAddress,
        filterList: [],
        fee: 50000,
        password: '',
    }

    namespaceList = []

    clearCurrentFilter() {
        this.currentFilter = ''
    }

    get getWallet() {
        return this.$store.state.account.wallet
    }

    initForm() {
        this.currentFilter = ''
        this.formItem = {
            filterType: PropertyType.AllowAddress,
            filterList: [],
            fee: 50000,
            password: '',
        }
    }

    addFilterItem() {
        if (this.currentFilter === '') {
            return
        }
        if (this.filterTypeList[2]) {
            this.formItem.filterList.unshift({
                label: this.$t(this.currentFilter) + '(' + entityTypeList[this.currentFilter].value + ')',
                value: entityTypeList[this.currentFilter].value
            })
            return
        }
        this.formItem.filterList.unshift({
            label: this.currentFilter,
            value: this.currentFilter
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
        console.log(index)

        if (index === 0) {
            this.formItem.filterType = PropertyType.AllowAddress
            return
        }
        if (index === 1) {
            this.formItem.filterType = PropertyType.AllowMosaic
            return
        }
        if (index === 2) {
            this.formItem.filterType = PropertyType.AllowTransaction
            return
        }
    }

    checkForm(): boolean {
        const {fee, password, filterType, filterList} = this.formItem
        if (!password || !password.trim()) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return false
        }

        if ((!Number(fee) && Number(fee) !== 0) || Number(fee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
            return false
        }

        // if (filterTypeList[0] && address.length < 40) {
        //     this.showErrorMessage(this.$t(Message.ADDRESS_FORMAT_ERROR))
        //     return false
        // }
        //
        //
        // if (filterTypeList[1] && mosaic) {
        //     this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR))
        //     return false
        // }
        //
        // if (filterTypeList[2] && entityType) {
        //     this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR))
        //     return false
        // }

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
        this.decryptKey()
    }

    generateFilter(privatekey) {
        let {fee, filterType, filterList} = this.formItem
        const {networkType} = this.$store.state.account.wallet
        const {generationHash, node} = this.$store.state.account
        const account = Account.createFromPrivateKey(privatekey, networkType)
        creatrModifyAccountPropertyTransaction(
            filterType,
            filterList,
            networkType,
            fee
        ).then((modifyAccountPropertyAddressTransaction) => {
            console.log(modifyAccountPropertyAddressTransaction)
            transactionApi._announce({
                transaction: modifyAccountPropertyAddressTransaction,
                account,
                node,
                generationHash
            })
        })
    }


    sendTransaction(privatekey) {
        const {filterTypeList} = this
        const {fee, password, filterType, filterList} = this.formItem
        this.generateFilter(privatekey)
    }

    decryptKey() {
        let encryptObj = {
            ciphertext: this.getWallet.ciphertext,
            iv: this.getWallet.iv.data ? this.getWallet.iv.data : this.getWallet.iv,
            key: this.formItem.password
        }
        this.checkPrivateKey(Crypto.decrypt(encryptObj))
    }

    checkPrivateKey(DeTxt) {
        const that = this
        walletApi.getWallet({
            name: this.getWallet.name,
            networkType: this.getWallet.networkType,
            privateKey: DeTxt.length === 64 ? DeTxt : ''
        }).then(async (Wallet: any) => {
            this.sendTransaction(DeTxt)
        }).catch((e) => {
            console.log(e)
            that.showErrorMessage(this.$t(Message.WRONG_PASSWORD_ERROR))
        })
    }

    getAccountProperties() {
        const {node} = this.$store.state.account
        const {address} = this.$store.state.account.wallet
        console.log(address.length)
        // TODO SDK has not been complete yet
        // getAccountProperties(address, node).then((accountPropertiesInfo) => {
        //     console.log(accountPropertiesInfo)
        // })
    }

    created() {
        this.getAccountProperties()
    }

}
