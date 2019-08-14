import {Message} from "@/config"
import {walletInterface} from "@/interface/sdkWallet"
import {Component, Vue} from 'vue-property-decorator'
import {transactionInterface} from '@/interface/sdkTransaction'
import {AccountLinkTransaction, UInt64, LinkAction, NetworkType, Deadline, Account} from "nem2-sdk"
import {decryptKey} from "@/help/appHelp";


@Component
export class MonitorRemoteTs extends Vue {
    modal1 = false
    modalMark = false
    switchMark = false
    switchState = false
    tableColumns = []
    aliasList = []
    formItem = {
        remotePublickey: '',
        fee: 0,
        password: ''
    }

    get getWallet() {
        return this.$store.state.account.wallet
    }


    initForm() {
        this.formItem = {
            remotePublickey: '',
            fee: 0,
            password: ''
        }
    }

    changePage() {

    }

    modalOk() {

    }

    modalCancel() {
        this.modalMark = false
        this.switchMark = false
    }

    switchChan() {
        if (this.switchMark == false) {
            this.modalMark = true
        }
    }

    showErrorMessage(message: string) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    checkForm(): boolean {
        const {remotePublickey, fee, password} = this.formItem
        if (remotePublickey.length !== 64) {
            this.showErrorMessage(this.$t(Message.ILLEGAL_PUBLICKEY_ERROR) + '')
            return false
        }
        if ((!Number(fee) && Number(fee) !== 0) || Number(fee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR) + '')
            return false
        }
        if (password == '' || password.trim() == '') {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return false
        }
        return true
    }

    confirmInput() {
        if (!this.checkForm()) return
        this.decryptKey()
    }

    decryptKey() {
        this.checkPrivateKey(decryptKey(this.getWallet, this.formItem.password))
    }

    checkPrivateKey(DeTxt) {
        const that = this
        walletInterface.getWallet({
            name: this.getWallet.name,
            networkType: this.getWallet.networkType,
            privateKey: DeTxt.length === 64 ? DeTxt : ''
        }).then(async (Wallet: any) => {
            this.sendTransaction(DeTxt)
        }).catch(() => {
            that.$Notice.error({
                title: this.$t('password_error') + ''
            })
        })
    }

    sendTransaction(privatekey) {
        const {remotePublickey, fee, password} = this.formItem
        // TODO COMLETE REMOTE TRANSACTION
        const {networkType} = this.getWallet
        const {generationHash, node} = this.$store.state.account
        const account = Account.createFromPrivateKey(privatekey, networkType)
        const accountLinkTransaction = AccountLinkTransaction.create(Deadline.create(), remotePublickey, LinkAction.Link, NetworkType.MIJIN_TEST, UInt64.fromUint(fee))
        transactionInterface._announce({
            transaction: accountLinkTransaction,
            node,
            account,
            generationHash
        })
        this.modalCancel()
    }
}
