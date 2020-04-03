/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {Account, Transaction, SignedTransaction, PublicAccount, NetworkType} from 'symbol-sdk'

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {WalletsModel, WalletType} from '@/core/database/entities/WalletsModel'
import {TransactionService} from '@/services/TransactionService'
import {BroadcastResult} from '@/core/transactions/BroadcastResult'

// child components
// @ts-ignore
import TransactionDetails from '@/components/TransactionDetails/TransactionDetails.vue'
// @ts-ignore
import FormAccountUnlock from '@/views/forms/FormAccountUnlock/FormAccountUnlock.vue'
// @ts-ignore
import HardwareConfirmationButton from '@/components/HardwareConfirmationButton/HardwareConfirmationButton.vue'

@Component({
  components: {
    TransactionDetails,
    FormAccountUnlock,
    HardwareConfirmationButton,
  },
  computed: {...mapGetters({
    generationHash: 'network/generationHash',
    networkType: 'network/networkType',
    currentAccount: 'account/currentAccount',
    currentWallet: 'wallet/currentWallet',
    stagedTransactions: 'wallet/stagedTransactions',
    signedTransactions: 'wallet/signedTransactions',
  })},
})
export class ModalTransactionConfirmationTs extends Vue {

  @Prop({
    default: false,
  }) visible: boolean

  /**
   * Network generation hash
   * @var {string}
   */
  public generationHash: string

  /**
   * Network type
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountsModel}
   */
  public currentAccount: AccountsModel

  /**
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * List of transactions on-stage
   * @see {Store.Wallet}
   * @var {Transaction[]}
   */
  public stagedTransactions: Transaction[]

  /**
   * List of transactions that are signed
   * @see {Store.Wallet}
   * @var {SignedTransaction[]}
   */
  public signedTransactions: SignedTransaction[]

  /**
   * Transaction service
   * @var {TransactionService}
   */
  public service: TransactionService

  /// region computed properties getter/setter
  /**
   * Returns whether current wallets is a hardware wallet
   * @return {boolean}
   */
  public get isUsingHardwareWallet(): boolean {
    // XXX should use "stagedTransaction.signer" to identify wallet
    return WalletType.TREZOR === this.currentWallet.values.get('type')
  }

  /**
   * Visibility state
   * @type {boolean}
   */
  public get show(): boolean {
    return this.visible 
    // && !!this.stagedTransactions
    // && this.stagedTransactions.length > 0
  }

  /**
   * Emits close event
   */
  public set show(val) {
    if (!val) {
      this.$emit('close')
    }
  }
  /// end-region computed properties getter/setter

  /**
   * Hook called when child component HardwareConfirmationButton emits
   * the 'success' event.
   *
   * This hook shall *only announce* said \a transactions
   * which were signed using a hardware device.
   *
   * @param {SignedTransaction[]} transactions
   * @return {void}
   */
  public async onTransactionsSigned(transactions: SignedTransaction[]) {
    const service = new TransactionService(this.$store)

    // - log about transaction signature success
    this.$store.dispatch('diagnostic/ADD_INFO', `Signed ${transactions.length} Transaction(s) on stage with Hardware Wallet`)

    // - transactions are ready to be announced
    for (let i = 0, m = transactions.length; i < m; i ++) {
      const signed = transactions[i]
      this.$store.commit('wallet/addSignedTransaction', signed)
    }

    // - reset transaction stage
    await this.$store.dispatch('wallet/RESET_TRANSACTION_STAGE')

    // - broadcast signed transactions
    const results: BroadcastResult[] = await service.announceSignedTransactions()

    // - notify about errors
    const errors = results.filter(result => false === result.success)
    if (errors.length) {
      return errors.map(result => this.$store.dispatch('notification/ADD_ERROR', result.error))
    }

    this.$emit('success')
    this.show = false
  }

  /**
   * Hook called when child component FormAccountUnlock emits
   * the 'success' event.
   *
   * This hook shall *sign transactions* with the \a account
   * that has been unlocked. Subsequently it will also announce
   * the signed transaction.
   *
   * @param {Password} password 
   * @return {void}
   */
  public async onAccountUnlocked({account}: {account: Account}): Promise<void> {
    // - log about unlock success
    this.$store.dispatch('diagnostic/ADD_INFO', `Account ${account.address.plain()} unlocked successfully.`)
    
    // - get transaction stage config
    const options = this.$store.getters['wallet/stageOptions']
    const service = new TransactionService(this.$store)

    let signedTransactions: SignedTransaction[]

    // - case 1 "is multisig": must create hash lock (aggregate bonded pre-requirement)
    if (options.isMultisig) {
      // - multisig account "issues" aggregate bonded
      const currentSigner = this.$store.getters['wallet/currentSigner']
      const multisigAccount = PublicAccount.createFromPublicKey(
        currentSigner.values.get('publicKey'),
        this.networkType,
      )

      // - use multisig public account and cosignatory to sign
      signedTransactions = service.signMultisigStagedTransactions(multisigAccount, account)
    }
    // - case 2 "is aggregate": must aggregate staged transactions and sign
    else if (options.isAggregate) {
      signedTransactions = service.signAggregateStagedTransactions(account)
    }
    // - case 3 "normal": must sign staged transactions
    else {
      signedTransactions = service.signStagedTransactions(account)
    }

    // - reset transaction stage
    this.$store.dispatch('wallet/RESET_TRANSACTION_STAGE')

    // - notify about successful transaction announce
    const debug = `Count of transactions signed:  ${signedTransactions.length}`
    this.$store.dispatch('diagnostic/ADD_DEBUG', debug)
    this.$store.dispatch('notification/ADD_SUCCESS', 'success_transactions_signed')
    this.$emit('success', account.publicAccount)
    this.show = false
  }

  /**
   * Hook called when child component FormAccountUnlock or
   * HardwareConfirmationButton emit the 'error' event.
   * @param {string} message
   * @return {void}
   */
  public onError(error: string) {
    this.$emit('error', error)
  }
}
