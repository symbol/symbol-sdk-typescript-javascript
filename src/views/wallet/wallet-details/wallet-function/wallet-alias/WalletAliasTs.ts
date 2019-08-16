import {Message} from "@/config"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {EmptyAlias} from "nem2-sdk/dist/src/model/namespace/EmptyAlias";
import {namespaceApi} from "@/core/api/namespaceApi";
import {Account, Address, AddressAlias, AliasActionType, MosaicId, NamespaceId} from "nem2-sdk";
import {transactionApi} from "@/core/api/transactionApi";
import {decryptKey} from "@/core/utils/wallet";
import {walletApi} from "@/core/api/walletApi";
import {formatAddress, formatSeconds} from "@/core/utils/utils";

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

    get namespaceList () {
        return this.$store.state.account.namespace
    }

    get generationHash() {
        return this.$store.state.account.generationHash
    }

    get node() {
        return this.$store.state.account.node
    }

    get nowBlockHeihgt () {
        return this.$store.state.app.chainStatus.currentHeight
    }

    showUnLink(index){
        this.aliasListIndex = index
        this.formItem = {
            address: this.aliasList[index].alias.address,
            alias: this.aliasList[index].name,
            fee: 50000,
            password: ''
        }
        this.isShowDialog = true
    }

    closeModel () {
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
        if (address.length !== 40) {
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
        if(!this.isCompleteForm) return
        if(!this.checkForm()) return
        if(this.aliasListIndex >= 0){
            this.addressAlias(decryptKey(this.getWallet, this.formItem.password), false)
        }else {
            this.checkPrivateKey(decryptKey(this.getWallet, this.formItem.password))
        }
    }

    checkPrivateKey(DeTxt) {
        const that = this
        walletApi.getWallet({
            name: this.getWallet.name,
            networkType: this.getWallet.networkType,
            privateKey: DeTxt.length === 64 ? DeTxt : ''
        }).then(async (Wallet: any) => {
            this.addressAlias(DeTxt, true)
        }).catch(() => {
            that.$Notice.error({
                title: this.$t('password_error') + ''
            })
        })
    }

    addressAlias (key, type) {
        const that = this
        const account = Account.createFromPrivateKey(key, this.getWallet.networkType);
        namespaceApi.addressAliasTransaction({
            actionType: type ? AliasActionType.Link : AliasActionType.Unlink,
            namespaceId: new NamespaceId(that.formItem.alias),
            address: Address.createFromRawAddress(that.formItem.address),
            networkType: this.getWallet.networkType,
            maxFee: that.formItem.fee
        }).then((addressAliasTransaction)=>{
            let transaction
            transaction = addressAliasTransaction.result.aliasAddressTransaction
            const signature = account.sign(transaction, this.generationHash)
            transactionApi.announce({signature, node: this.node}).then((announceResult) => {
                // get announce status
                console.log(signature)
                announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                    that.$Notice.success({
                        title: this.$t(Message.SUCCESS) + ''
                    })
                    this.closeModel()
                })
            })
        })
    }

    formatAddress (address) {
        return formatAddress(address)
    }

    computeDuration (duration) {
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
            }else if(item.alias instanceof AddressAlias){
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
        this.isCompleteForm = address !== '' && alias !== '' && password !== '' && fee  > 0
    }

    created () {
        this.initData()
    }
}
