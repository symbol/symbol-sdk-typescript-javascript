import {Component, Vue, Provide} from 'vue-property-decorator'
import {AppInfo, AppWallet, StoreAccount} from '@/core/model'
import {mapState} from 'vuex'
import {DEFAULT_FEES, FEE_GROUPS, FEE_SPEEDS} from '@/config'
import {AccountLinkTransaction, Deadline, LinkAction, Password, TransactionType, UInt64} from 'nem2-sdk'
import {validatePublicKey} from '@/core/validation'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import {RemoteAccountService} from '@/core/services'
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import {getAbsoluteMosaicAmount} from '@/core/utils'

@Component({
  components: {ErrorTooltip, CheckPasswordDialog, DisabledForms},
  computed: {...mapState({activeAccount: 'account', app: 'app'})},

})
export class ProxySettingTs extends Vue {
  @Provide() validator: any = this.$validator
  activeAccount: StoreAccount
  app: AppInfo
  feeSpeed = FEE_SPEEDS.NORMAL
  defaultFees = DEFAULT_FEES[FEE_GROUPS.SINGLE]
  remotePublicKey: string = null
  isShowPasswordDialog = false
  password = ''
  feeDivider = 1
  isGenerateRemoteAccount = false

  get wallet() {
    return this.activeAccount.wallet
  }

  get feeAmount(): number {
    const {feeSpeed} = this
    const feeAmount = this.defaultFees.find(({speed}) => feeSpeed === speed).value
    return getAbsoluteMosaicAmount(feeAmount, this.networkCurrency.divisibility)
  }

  get linkedAccountKey() {
    return this.wallet.linkedAccountKey
  }

  get currentRemotePublicKey() {
    return this.linkedAccountKey || this.remotePublicKey
  }

  get networkCurrency() {
    return this.activeAccount.networkCurrency
  }

  get isUnconfirmedLinkTransactionExisted() {
    return this.activeAccount.transactionList.find(
      item => item.isTxConfirmed === false && item.rawTx.type === TransactionType.LINK_ACCOUNT,
    )
  }

  checkToCreateRemoteAccount(){
    this.isGenerateRemoteAccount = true
    this.isShowPasswordDialog = true
  }

  checkBeforeTransaction(){
    this.isGenerateRemoteAccount = false
    if(!this.password) {
      this.isShowPasswordDialog = true
      return
    }
    this.submit(this.password)
  }
  getPassword(password) {
    if(!password)return
    if(this.isGenerateRemoteAccount){
      this.checkPasswordBeforeGenerate(password)
      return
    }
    this.submit(password)
  }

  async signAndAnnounce() {
    const {feeAmount, password} = this
    try {
      const {wallet, remotePublicKey} = this

      const transactionToSign = wallet.linkedAccountKey
        ? this.createUnlinkTransaction(feeAmount)
        : this.createAccountLinkTransaction(
          password,
          remotePublicKey,
          UInt64.fromUint(feeAmount),
        )

      const account = new AppWallet(this.wallet).getAccount(new Password(password))
      const signedTransaction = account.sign(transactionToSign, this.app.networkProperties.generationHash)
      new AppWallet(this.wallet).announceTransaction(signedTransaction, this.$store)

    } catch (error) {
      console.error('AccountLinkTransactionTs -> submit -> error', error)
    }
  }

  createUnlinkTransaction(fee): AccountLinkTransaction {
    return AccountLinkTransaction.create(
      Deadline.create(),
      this.linkedAccountKey,
      LinkAction.Unlink,
      this.wallet.networkType,
      UInt64.fromUint(fee),
    )
  }

  createAccountLinkTransaction(
    password: string,
    remoteAccountPublicKey: string,
    feeAmount: UInt64,
  ): AccountLinkTransaction {
    try {
      return AccountLinkTransaction.create(
        Deadline.create(),
        remoteAccountPublicKey,
        LinkAction.Link,
        this.wallet.networkType,
        feeAmount,
      )
    } catch (error) {
      throw new Error(error)
    }
  }

  submit(password) {
    this.password = password
    if (validatePublicKey(this.currentRemotePublicKey).valid) {
      this.signAndAnnounce()
    }
  }

  checkPasswordBeforeGenerate(password) {
    if (!password) return
    this.password = password
    this.setRemotePublicKey(password)
  }

  async setRemotePublicKey(password) {
    try {
      this.remotePublicKey = await new RemoteAccountService(this.wallet)
        .getAvailableRemotePublicKey(
          new Password(password),
          this.$store,
        )
    } catch (error) {
      // @TODO
      console.error(error)
    }
  }

}
