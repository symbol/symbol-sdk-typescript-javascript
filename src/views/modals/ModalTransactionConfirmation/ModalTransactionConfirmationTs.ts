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
import {Account, Transaction, SignedTransaction, Password} from 'nem2-sdk'

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
import { NotificationType } from '@/core/utils/NotificationType'

@Component({
  components: {
    TransactionDetails,
    FormAccountUnlock,
    HardwareConfirmationButton,
  },
  computed: {...mapGetters({
    generationHash: 'network/generationHash',
    currentAccount: 'account/currentAccount',
    currentWallet: 'wallet/currentWallet',
    stagedTransactions: 'wallet/stagedTransactions',
    signedTransactions: 'wallet/signedTransactions',
  })},
})
export class ModalTransactionConfirmationTs extends Vue {

  @Prop({
    default: false
  }) visible: boolean

  /**
   * Network generation hash
   * @var {string}
   */
  public generationHash: string

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
    //XXX should use "stagedTransaction.signer" to identify wallet
    return WalletType.TREZOR === this.currentWallet.values.get('type')
  }

  /**
   * Visibility state
   * @type {boolean}
   */
  public get show(): boolean {
    return this.visible 
        //&& !!this.stagedTransactions
        //&& this.stagedTransactions.length > 0
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
    this.service = new TransactionService(this.$store)

    // - log about transaction signature success
    this.$store.dispatch('diagnostic/ADD_INFO', 'Signed ' + transactions.length + ' Transaction(s) on stage with Hardware Wallet')

    // - transactions are ready to be announced
    transactions.map(async (signed) => await this.$store.commit('wallet/addSignedTransaction', signed))

    // - reset transaction stage
    this.show = false
    this.$store.dispatch('wallet/RESET_TRANSACTION_STAGE')

    // - XXX end-user should be able to uncheck "announce now"

    // - broadcast signed transactions
    const results: BroadcastResult[] = await this.service.announceSignedTransactions()

    // - notify about errors
    const errors = results.filter(result => false === result.success)
    if (errors.length) {
      return errors.map(result => this.$store.dispatch('notification/ADD_ERROR', result.error))
    }

    return this.$emit('success')
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
  public async onAccountUnlocked({account, password}: {account: Account, password: Password}) {
    this.service = new TransactionService(this.$store)

    // - log about unlock success
    this.$store.dispatch('diagnostic/ADD_INFO', 'Account ' + account.address.plain() + ' unlocked successfully.')

    // - get staged transactions and sign
    await this.stagedTransactions.map(async (staged) => {
      const signedTx = account.sign(staged, this.generationHash)
      this.$store.dispatch('diagnostic/ADD_DEBUG', 'Signed transaction with account ' + account.address.plain() + ' and result: ' + JSON.stringify({
        hash: signedTx.hash,
        payload: signedTx.payload
      }))
      await this.$store.commit('wallet/addSignedTransaction', signedTx)
    })

    // - reset transaction stage
    this.$store.dispatch('wallet/RESET_TRANSACTION_STAGE')

    // - XXX end-user should be able to uncheck "announce now"
    // - broadcast signed transactions
    const results: BroadcastResult[] = await this.service.announceSignedTransactions()
    
    // - notify about errors
    const errors = results.filter(result => false === result.success)
    if (errors.length) {
      return errors.map(result => this.$store.dispatch('notification/ADD_ERROR', result.error))
    }

    this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
    this.show = false
    return this.$emit('success')
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
