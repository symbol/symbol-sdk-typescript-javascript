import {Message} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {AccountLinkTransaction, UInt64, LinkAction, Deadline, Password} from "nem2-sdk"
import {AccountApiRxjs} from "@/core/api/AccountApiRxjs.ts"
import {mapState} from "vuex"
import {getAbsoluteMosaicAmount} from '@/core/utils'
import {formDataConfig} from "@/config/view/form";
import {AppWallet} from "@/core/model"


@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class MonitorRemoteTs extends Vue {
    activeAccount: any
    isLinked = false
    harvestBlockList = []
    isLinkToRemote = false
    isShowDialog = false
    remotePublickey = ''
    formItem: any = formDataConfig.remoteForm

    get getWallet() {
        return this.activeAccount.wallet
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get node() {
        return this.activeAccount.node
    }

    get networkType() {
        return this.activeAccount.wallet.networkType
    }

    get address() {
        return this.activeAccount.wallet.address
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    initForm() {
        this.formItem = {
            remotePublickey: '',
            fee: 0.5,
            password: ''
        }
    }

    changePage() {

    }

    modalCancel() {
        this.isShowDialog = false
    }

    switchChan() {
        if (this.isLinked == false) {
            this.isShowDialog = true
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
        if (!password || password.trim() == '') {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return false
        }

        if (password.length < 8) {
            this.showErrorMessage(this.$t('password_error') + '')
            return false
        }

        const validPassword = new AppWallet(this.getWallet).checkPassword(new Password(password))

        if (!validPassword) {
            this.showErrorMessage(this.$t('password_error') + '')
            return false
        }
        return true
    }

    confirmInput() {
        if (!this.checkForm()) return
        this.sendTransaction()
    }

    sendTransaction() {
        let {remotePublickey, fee, password} = this.formItem
        const {generationHash, node, networkType, xemDivisibility, isLinked} = this
        console.log(fee, xemDivisibility)
        fee = getAbsoluteMosaicAmount(fee, xemDivisibility)
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            remotePublickey,
            isLinked ? LinkAction.Unlink : LinkAction.Link,
            networkType,
            UInt64.fromUint(fee)
        )
        new AppWallet(this.getWallet).signAndAnnounceNormal(new Password(password), node, generationHash, [accountLinkTransaction], this)
        this.modalCancel()
    }

    toggleSwitch(status) {
        this.isShowDialog = true
    }

    getLinkPublicKey() {
        if (!this.getWallet.address) {
            return
        }
        const that = this
        const {address, node} = this
        new AccountApiRxjs().getLinkedPublickey(node, address).subscribe((resStr: string) => {
                that.remotePublickey = ''
                if (JSON.parse(resStr) && JSON.parse(resStr).account && JSON.parse(resStr).account.linkedAccountKey) {
                    let linkedPublicKey = JSON.parse(resStr).account.linkedAccountKey
                    that.remotePublickey = Buffer.from(linkedPublicKey, 'base64').toString('hex').toUpperCase()
                }
                that.remotePublickey = ''
                if (Number(that.remotePublickey) != 0) {
                    // switch on
                    that.formItem.remotePublickey = that.remotePublickey
                    that.isLinked = true
                    return
                }
            }
        )
    }

    mounted() {
        this.getLinkPublicKey()
    }
}
