import {Message} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {AccountLinkTransaction, UInt64, LinkAction, Deadline, Password} from "nem2-sdk"
import {AccountApiRxjs} from "@/core/api/AccountApiRxjs.ts"
import {mapState} from "vuex"
import {getAbsoluteMosaicAmount} from '@/core/utils'
import {formDataConfig} from "@/config/view/form";
import {AppWallet, DefaultFee, StoreAccount} from "@/core/model"
import {DEFAULT_FEES, defaultNetworkConfig, FEE_GROUPS} from "@/config/index";

@Component({
  computed: {
    ...mapState({
      activeAccount: 'account',
    })
  }
})
export class WalletHarvestingTs extends Vue {
  activeAccount: StoreAccount
  isLinked = false
  harvestBlockList = []
  isLinkToRemote = false
  isShowDialog = false
  remotePublicKey = ''
  formItems = {...formDataConfig.remoteForm}
  XEM: string = defaultNetworkConfig.XEM
  get getWallet() {
    return this.activeAccount.wallet
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
        const feeAmount = this.defaultFees.find(({speed})=>feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.xemDivisibility)
    }

  get address() {
    return this.activeAccount.wallet.address
  }

  get xemDivisibility() {
    return this.activeAccount.xemDivisibility
  }

  initForm() {
    this.formItems = formDataConfig.remoteForm
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
    const {remotePublicKey, password} = this.formItems
    const {feeAmount} = this
    if (remotePublicKey.length !== 64) {
      this.showErrorMessage(this.$t(Message.ILLEGAL_PUBLICKEY_ERROR) + '')
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
    const {feeAmount} = this
    let {remotePublicKey, password} = this.formItems
    const {generationHash, node, networkType, xemDivisibility, isLinked} = this
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
