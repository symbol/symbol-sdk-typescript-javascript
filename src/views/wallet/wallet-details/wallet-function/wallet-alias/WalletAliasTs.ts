import {Message} from "@/config/index.ts"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {EmptyAlias} from "nem2-sdk/dist/src/model/namespace/EmptyAlias"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import {Account, Address, AddressAlias, AliasActionType, MosaicId, NamespaceId} from "nem2-sdk";
import {TransactionApiRxjs} from "@/core/api/TransactionApiRxjs.ts"
import {decryptKey} from "@/core/utils/wallet.ts"
import {WalletApiRxjs} from "@/core/api/WalletApiRxjs.ts"
import {formatAddress, formatSeconds} from "@/core/utils/utils.ts"

@Component
export class WalletAliasTs extends Vue {
    isShowDialog = false
    isShowDeleteIcon = false
    showCheckPWDialog = false
    isCompleteForm = false
    formItem = {
        address: '',
        alias: '',
        fee: 50000,
        password: ''
    }
    aliasList = []
    aliasListIndex = -1
    aliasActionTypeList = []

    get getWallet() {
        return this.$store.state.account.wallet
    }

    get namespaceList() {
        return this.$store.state.account.namespace
    }

    get generationHash() {
        return this.$store.state.account.generationHash
    }

    get node() {
        return this.$store.state.account.node
    }

    get nowBlockHeihgt() {
        return this.$store.state.app.chainStatus.currentHeight
    }

    showUnLink(index) {
        this.aliasListIndex = index
        this.formItem = {
            address: this.aliasList[index].alias.address,
            alias: this.aliasList[index].name,
            fee: 50000,
            password: ''
        }
        this.isShowDialog = true
    }

    closeModel() {
        this.isShowDialog = false
        this.aliasListIndex = -1
        this.formItem = {
            address: '',
            alias: '',
            fee: 50000,
            password: ''
        }
    }

    checkForm(): boolean {
        const {address, alias, fee, password} = this.formItem
        if (address.length < 40) {
            this.showErrorMessage(this.$t(Message.ADDRESS_FORMAT_ERROR))
            return false
        }
        if (!(alias || alias.trim())) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return false
        }
        if (!(password || password.trim())) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return false
        }
        if ((!Number(fee) && Number(fee) !== 0) || Number(fee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
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

    checkAliasForm() {
        if (!this.isCompleteForm) return
        if (!this.checkForm()) return
        if (this.aliasListIndex >= 0) {
            this.addressAlias(decryptKey(this.getWallet, this.formItem.password), false)
        } else {
            this.checkPrivateKey(decryptKey(this.getWallet, this.formItem.password))
        }
    }

    checkPrivateKey(DeTxt) {
        const that = this
        try {
            new WalletApiRxjs().getWallet(
                this.getWallet.name,
                DeTxt.length === 64 ? DeTxt : '',
                this.getWallet.networkType,
            )
            that.addressAlias(DeTxt, true)
        } catch (e) {
            that.$Notice.error({
                title: this.$t('password_error') + ''
            })
        }
    }

    addressAlias(key, type) {
        const that = this
        const account = Account.createFromPrivateKey(key, this.getWallet.networkType);
        let transaction = new NamespaceApiRxjs().addressAliasTransaction(
            type ? AliasActionType.Link : AliasActionType.Unlink,
            new NamespaceId(that.formItem.alias),
            Address.createFromRawAddress(that.formItem.address),
            this.getWallet.networkType,
            that.formItem.fee
        )
        const signature = account.sign(transaction, this.generationHash)
        new TransactionApiRxjs().announce(signature, this.node).subscribe((announceInfo: any) => {
            that.$Notice.success({
                title: this.$t(Message.SUCCESS) + ''
            })
            this.closeModel()
        })
    }

    formatAddress(address) {
        return formatAddress(address)
    }

    computeDuration(duration) {
        let expireTime = duration - this.nowBlockHeihgt > 0 ? this.durationToTime(duration - this.nowBlockHeihgt) : 'Expired'
        return expireTime
    }

    durationToTime(duration) {
        const durationNum = Number(duration)
        return formatSeconds(durationNum * 12)

    }

    initData() {
        let list = []
        let addressAliasList = []
        this.namespaceList.map((item, index) => {
            if (item.alias instanceof EmptyAlias) {
                list.push(item)
            } else if (item.alias instanceof AddressAlias) {
                addressAliasList.push(item)
            }
        })
        this.aliasActionTypeList = list
        this.aliasList = addressAliasList
    }

    @Watch('namespaceList')
    onNamespaceListChange() {
        this.initData()
    }

    @Watch('formItem', {immediate: true, deep: true})
    onFormItemChange() {
        const {address, alias, password, fee} = this.formItem
        // isCompleteForm
        this.isCompleteForm = address !== '' && alias !== '' && password !== '' && fee > 0
    }

    created() {
        this.initData()
    }
}
