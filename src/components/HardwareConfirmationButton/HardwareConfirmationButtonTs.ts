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
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {Transaction, SignedTransaction, NetworkType} from 'symbol-sdk'

// internal dependencies
import {AccountModel} from '@/core/database/entities/AccountModel'
import {TransactionService} from '@/services/TransactionService'
import TrezorConnect from '@/core/utils/TrezorConnect'

@Component({
  computed: {
    ...mapGetters({
      networkType: 'network/networkType',
      currentAccount: 'account/currentAccount',
      stagedTransactions: 'account/stagedTransactions',
    }),
  },
})
export class HardwareConfirmationButtonTs extends Vue {
  /**
   * Current network type
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountModel}
   */
  public currentAccount: AccountModel

  /**
   * Staged transactions (to-be-signed)
   * @see {Store.Account}
   * @var {Transaction[]}
   */
  public stagedTransactions: Transaction[]

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

  /**
   * Process with hardware confirmation (currently trezor only)
   * @return {void}
   */
  public async processHardware() {
    // - read transaction stage
    const transactions = this.stagedTransactions
    if (!transactions.length) {
      this.$emit('error', this.$t('no_transaction_on_stage'))
      return this.$store.dispatch('notification/ADD_ERROR', this.$t('no_transaction_on_stage'))
    }

    const countStaged: number = transactions.length
    const signedTxes: SignedTransaction[] = []
    for (let i = 0, m = transactions.length; i < m; i ++) {
      // - order matters, get first transaction on-stage
      const stagedTx = transactions.shift()

      // - sign each transaction with TrezorConnect
      const result = await TrezorConnect.nemSignTransaction({
        path: this.currentAccount.path,
        transaction: stagedTx,
      })

      // - in case of error, display notification and exit
      if (!result.success) {
        this.$emit('error', result.payload.error)
        return this.$store.dispatch('notification/ADD_ERROR', result.payload.error)
      }

      // - transaction is signed
      const signedTx = new SignedTransaction(
        result.payload.data,
        stagedTx.transactionInfo.hash,
        stagedTx.signer.publicKey,
        stagedTx.type,
        this.networkType,
      )

      signedTxes.push(signedTx)
    }

    if (signedTxes.length === countStaged) {
      return this.$emit('success', signedTxes)
    }

    this.$emit('error', this.$t('at_least_one_error_produced_during_sign_attempt'))
    return this.$store.dispatch('notification/ADD_ERROR', this.$t('at_least_one_error_produced_during_sign_attempt'))
  }
}
