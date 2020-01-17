import {Component, Vue, Provide} from 'vue-property-decorator'
import {DEFAULT_FEES, FEE_GROUPS, FEE_SPEEDS, Message} from '@/config'
import {AppInfo, AppWallet, FormattedTransaction,  Notice, NoticeType} from '@/core/model'
import {StoreAccount} from '@/store/account/StoreAccount'
import {mapState} from 'vuex'
import {validation} from '@/core/validation'
import {Deadline, Password, PersistentDelegationRequestTransaction, TransactionType, UInt64} from 'nem2-sdk'
import ThreeDotsLoading from '@/components/three-dots-loading/ThreeDotsLoading.vue'
import {RemoteAccountService} from '@/core/services/harvesting/RemoteAccountService'
import {ServiceFactory} from '@/core/services/ServiceFactory'
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import {getAbsoluteMosaicAmount} from '@/core/utils'
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
@Component({
  components: {
    ThreeDotsLoading,
    DisabledForms,
    CheckPasswordDialog,
  },
  computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class DelegateRequestsTs extends Vue {
  @Provide() validator: any = this.$validator
  activeAccount: StoreAccount
  feeDivider = 1
  feeSpeed = FEE_SPEEDS.NORMAL
  defaultFees = DEFAULT_FEES[FEE_GROUPS.SINGLE]
  validation = validation
  app: AppInfo
  showDialogContainsFeeAndPassword = false
  password = ''

  get remoteService(): RemoteAccountService {
    return ServiceFactory.create('remote-account')
  }

  get feeAmount(): number {
    const {feeSpeed} = this
    const feeAmount = this.defaultFees.find(({speed}) => feeSpeed === speed).value
    return getAbsoluteMosaicAmount(feeAmount, this.networkCurrency.divisibility)
  }

  get wallet() {
    return this.activeAccount.wallet
  }

  get networkCurrency() {
    return this.activeAccount.networkCurrency
  }

  get persistentAccountRequestTransactions(): FormattedTransaction[] {
    if (! this.activeAccount.wallet.isLinked) {
      return []
    }

    const transactions = this.$store.state.account.transactionList
    return this.remoteService.getHarvestingDelegationRequests(transactions) || []
  }

  get latestPersistentTransaction() {
    return this.persistentAccountRequestTransactions[0] || null
  }

  get temporaryRemoteNodeConfig() {
    return this.activeAccount.wallet.temporaryRemoteNodeConfig
  }

  get isUnconfirmedDelegationRequestTransactionExisted(){
    // @todo use a better flag to get DelegationRequestTransaction in transaction list
    return this.activeAccount.transactionList
      .find( (item: any)=>item.isTxConfirmed === false
        && item.rawTx.type === TransactionType.TRANSFER
        && item.rawTx.mosaics.length === 0,
      )
  }

  getTransaction(): PersistentDelegationRequestTransaction {
    try {
      const {feeAmount, feeDivider} = this
      return new RemoteAccountService(this.wallet).getPersistentDelegationRequestTransaction(
        Deadline.create(),
        this.temporaryRemoteNodeConfig.publicKey,
        UInt64.fromUint(feeAmount / feeDivider),
        new Password(this.password),
      )
    } catch (error) {
      Notice.trigger(Message.REMOTE_ACCOUNT_NOT_FOUND, NoticeType.error, this.$store)
    }
  }

  async signAndAnnounce() {
    try {
      const transactionToSign = this.getTransaction()
      const account = new AppWallet(this.wallet).getAccount(new Password(this.password))
      const signedTransaction = account.sign(transactionToSign, this.app.networkProperties.generationHash)
      // this.$emit("nextClicked");
      new AppWallet(this.wallet).announceTransaction(signedTransaction, this.$store)
    } catch (error) {
      console.error('AccountLinkTransactionTs -> signAndAnnounce -> error', error)
    }
  }

  submit(password) {
    if (!password) return
    this.password = password
    this.signAndAnnounce()
  }
}
