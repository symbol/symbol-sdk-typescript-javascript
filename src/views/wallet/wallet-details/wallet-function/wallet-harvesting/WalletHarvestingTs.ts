import {Message} from "@/config/index.ts"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {AccountLinkTransaction, UInt64, LinkAction, Deadline, Password} from "nem2-sdk"
import {mapState} from "vuex"
import {cloneData, getAbsoluteMosaicAmount} from '@/core/utils'
import {formDataConfig} from "@/config/view/form"
import {AppWallet, DefaultFee, StoreAccount} from "@/core/model"
import MultisigBanCover from '@/components/multisig-ban-cover/MultisigBanCover.vue'
import {DEFAULT_FEES, FEE_GROUPS} from "@/config/index"

@Component({
  computed: {
    ...mapState({
      activeAccount: 'account',
    })
  },
  components:{
    MultisigBanCover
  }
})
export class WalletHarvestingTs extends Vue {
    activeAccount: StoreAccount
    harvestBlockList = []
    isShowDialog = false
    formItems = cloneData(formDataConfig.remoteForm)

    get wallet() {
        return this.activeAccount.wallet
    }

    get linkedAccountKey() {
        this.formItems.remotePublicKey = this.wallet.linkedAccountKey
        return this.wallet.linkedAccountKey
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get defaultFees(): DefaultFee[] {
        return DEFAULT_FEES[FEE_GROUPS.SINGLE]
    }

    get node() {
        return this.activeAccount.node
    }

    get networkType() {
        return this.activeAccount.wallet.networkType
    }

    get feeAmount(): number {
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed}) => feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.activeAccount.networkCurrency.divisibility)
    }

    get address() {
        return this.activeAccount.wallet.address
    }

    get isLinked(): boolean {
        return this.linkedAccountKey && Number(this.linkedAccountKey) != 0
    }

    initForm() {
        this.formItems = cloneData(formDataConfig.remoteForm)
    }

    modalCancel() {
        this.isShowDialog = false
    }

    switchChan() {
        if (!this.isLinked) {
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
        const {password, remotePublicKey} = this.formItems
        const {feeAmount} = this
        if (remotePublicKey.length !== 64) {
            this.showErrorMessage(this.$t(Message.ILLEGAL_publicKey_ERROR) + '')
            return false
        }
        if ((!Number(feeAmount) && Number(feeAmount) !== 0) || Number(feeAmount) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR) + '')
            return false
        }
        if (!password || password.trim() == '') {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return false
        }

        if (password.length < 8) {
            this.showErrorMessage(this.$t(Message.WRONG_PASSWORD_ERROR) + '')
            return false
        }

        const validPassword = new AppWallet(this.wallet).checkPassword(new Password(password))

        if (!validPassword) {
            this.showErrorMessage(this.$t(Message.WRONG_PASSWORD_ERROR) + '')
            return false
        }
        return true
    }

    confirmInput() {
        if (!this.checkForm()) return
        this.sendTransaction()
    }

    sendTransaction() {
        const {feeAmount,} = this
        const {password, remotePublicKey} = this.formItems
        const {generationHash, node, networkType, isLinked} = this
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            remotePublicKey,
            isLinked ? LinkAction.Unlink : LinkAction.Link,
            networkType,
            UInt64.fromUint(feeAmount)
        )
        console.log(accountLinkTransaction)
        new AppWallet(this.wallet).signAndAnnounceNormal(new Password(password), node, generationHash, [accountLinkTransaction], this)
        this.modalCancel()
    }

    toggleSwitch(status) {
        this.isShowDialog = true
    }
}
