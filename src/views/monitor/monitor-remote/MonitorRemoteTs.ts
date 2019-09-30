import {Message, DEFAULT_FEES, FEE_GROUPS, defaultNetworkConfig, formDataConfig} from "@/config"
import {Component, Vue} from 'vue-property-decorator'
import {AccountLinkTransaction, UInt64, LinkAction, Deadline, Password} from "nem2-sdk"
import {AccountApiRxjs} from "@/core/api/AccountApiRxjs.ts"
import {mapState} from "vuex"
import {getAbsoluteMosaicAmount} from '@/core/utils'
import {AppWallet, StoreAccount, DefaultFee} from "@/core/model"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class MonitorRemoteTs extends Vue {
    activeAccount: StoreAccount
    isLinked = false
    harvestBlockList = []
    isLinkToRemote = false
    isShowDialog = false
    remotePublicKey = ''
    formItems = formDataConfig.remoteForm
    XEM = defaultNetworkConfig.XEM

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

    get defaultFees(): DefaultFee[] {
        return DEFAULT_FEES[FEE_GROUPS.SINGLE]
    }

    get feeAmount() {
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed})=>feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.xemDivisibility)
    }

    initForm() {
        this.formItems = formDataConfig.remoteForm
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
        const {remotePublicKey, password} = this.formItems
        if (remotePublicKey.length !== 64) {
            this.showErrorMessage(this.$t(Message.ILLEGAL_PUBLIC_KEY_ERROR) + '')
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
        const {remotePublicKey, password} = this.formItems
        const {generationHash, node, networkType, isLinked} = this
        const {feeAmount} = this
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            remotePublicKey,
            isLinked ? LinkAction.Unlink : LinkAction.Link,
            networkType,
            UInt64.fromUint(feeAmount)
        )
        new AppWallet(this.getWallet).signAndAnnounceNormal(new Password(password), node, generationHash, [accountLinkTransaction], this)
        this.modalCancel()
    }

    toggleSwitch() {
        this.isShowDialog = true
    }

    getLinkPublicKey() {
        if (!this.getWallet.address) {
            return
        }
        const that = this
        const {address, node} = this
        new AccountApiRxjs().getLinkedPublickey(node, address).subscribe((resStr: string) => {
                that.remotePublicKey = ''
                if (JSON.parse(resStr) && JSON.parse(resStr).account && JSON.parse(resStr).account.linkedAccountKey) {
                    let linkedPublicKey = JSON.parse(resStr).account.linkedAccountKey
                    that.remotePublicKey = Buffer.from(linkedPublicKey, 'base64').toString('hex').toUpperCase()
                }
                that.remotePublicKey = ''
                if (Number(that.remotePublicKey) != 0) {
                    // switch on
                    that.formItems.remotePublicKey = that.remotePublicKey
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
