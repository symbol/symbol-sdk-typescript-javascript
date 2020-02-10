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
import {Account, Transaction, SignedTransaction} from 'nem2-sdk'

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {AppWalletType} from '@/core/database/models/AppWallet'
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

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public mounted() {
    this.service = new TransactionService(this.$store)
  }

/// region computed properties getter/setter
  public get isUsingHardwareWallet(): boolean {
    return AppWalletType.TREZOR === this.currentWallet.values.get('type')
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
  public onTransactionsSigned(transactions: SignedTransaction[]) {
    // - log about transaction signature success
    this.$store.dispatch('diagnostic/ADD_INFO', 'Signed ' + transactions.length + ' Transaction(s) on stage with Hardware Wallet')

    // - transactions are ready to be announced
    transactions.map(async (signed) => await this.$store.commit('wallet/addSignedTransaction', signed))

    // - reset transaction stage
    this.$store.dispatch('wallet/RESET_TRANSACTION_STAGE')

    // - broadcast signed transactions
    this.service.announceSignedTransactions().subscribe((results: BroadcastResult[]) => {
      // - notify about errors
      const errors = results.filter(result => false === result.success)
      if (errors.length) {
        return errors.map(result => this.$store.dispatch('notification/ADD_ERROR', result.error))
      }

      return this.$emit('success')
    })
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
  public onAccountUnlocked(account: Account) {
    // - log about unlock success
    this.$store.dispatch('diagnostic/ADD_INFO', 'Account ' + account.address.plain() + ' unlocked successfully.')

    // - get staged transactions and sign
    this.stagedTransactions.map(async (staged) => {
      const signedTx = account.sign(staged, this.generationHash)
      await this.$store.commit('wallet/addSignedTransaction', signedTx)
    })

    // - reset transaction stage
    this.$store.dispatch('wallet/RESET_TRANSACTION_STAGE')

    // - broadcast signed transactions
    this.service.announceSignedTransactions().subscribe((results: BroadcastResult[]) => {
      // - notify about errors
      const errors = results.filter(result => false === result.success)
      if (errors.length) {
        return errors.map(result => this.$store.dispatch('notification/ADD_ERROR', result.error))
      }

      return this.$emit('success')
    })
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
