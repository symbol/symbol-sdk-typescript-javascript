import {Message} from "@/config/index.ts"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {formatAddress} from "@/core/utils"
import {mapState} from "vuex"
import {StoreAccount, AppInfo, removeLinkInAddressBook, saveLocalAlias, readLocalAliasInAddressBook} from "@/core/model"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class AddressBookTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    pageSize = 5
    isShowDialog = false
    isShowDeleteIcon = false
    showCheckPWDialog = false
    isCompleteForm = true
    aliasListIndex = -1
    aliasActionTypeList = []
    aliasList = []
    currentPage = 1
    formItem = {
        address: '',
        alias: '',
        tag: ''
    }

    get getWallet() {
        return this.activeAccount.wallet
    }

    get NamespaceList() {
        return this.activeAccount.namespaces
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get node() {
        return this.activeAccount.node
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }


    showUnLink(index) {
        this.aliasListIndex = index
        this.formItem = {
            address: this.aliasList[index].alias.address,
            alias: '',
            tag: ''
        }
        this.isShowDialog = true
    }

    handleChange(page) {
        this.currentPage = page
    }

    closeModel() {
        this.isShowDialog = false
        this.aliasListIndex = -1
        this.formItem = {
            address: '',
            alias: '',
            tag: ''
        }
    }

    checkForm(): boolean {
        const {address, alias} = this.formItem
        if (address.length < 40) {
            this.showErrorMessage(this.$t(Message.ADDRESS_FORMAT_ERROR))
            return false
        }
        if (!(alias || alias.trim())) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
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
    removeLink(aliasObject){
        removeLinkInAddressBook(aliasObject, this.getWallet.address)
        this.initLocalAlias()
    }
    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkForm()) return
        this.addAliasToLocalStorage()
    }

    addAliasToLocalStorage() {
        const {address, tag, alias} = this.formItem
        saveLocalAlias(
            this.getWallet.address,
            {
                tag: tag,
                alias: alias,
                address: address
            })
        this.closeModel()
        this.initLocalAlias()
    }

    formatAddress(address) {
        return formatAddress(address)
    }

    initLocalAlias() {
        this.currentPage = 1
        const addressBook = readLocalAliasInAddressBook(this.getWallet.address)
        this.aliasList = addressBook && addressBook.aliasMap ? Object.values(addressBook.aliasMap) : []
    }

    @Watch('getWallet.address')
    onAddressChange() {
        this.initLocalAlias()
    }


    mounted() {
        this.initLocalAlias()
    }

}
