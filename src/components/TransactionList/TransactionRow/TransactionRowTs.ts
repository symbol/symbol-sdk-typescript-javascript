/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { MosaicId, NamespaceId, Transaction, TransactionType, TransferTransaction } from 'symbol-sdk'
// internal dependencies
import { Formatters } from '@/core/utils/Formatters'
import { TimeHelpers } from '@/core/utils/TimeHelpers'
// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'
// @ts-ignore
import ActionDisplay from '@/components/ActionDisplay/ActionDisplay.vue'
// resources
import { dashboardImages, officialIcons, transactionTypeToIcon } from '@/views/resources/Images'
import { TransactionViewFactory } from '@/core/transactions/TransactionViewFactory'
import { TransactionView } from '@/core/transactions/TransactionView'
import { TransactionStatus } from '@/core/transactions/TransactionStatus'

@Component({
  components: {
    ActionDisplay,
    MosaicAmountDisplay,
  },
  computed: mapGetters({
    networkMosaic: 'mosaic/networkMosaic',
    explorerBaseUrl: 'app/explorerUrl',
  }),
})
export class TransactionRowTs extends Vue {
  @Prop({ default: [] })
  public transaction: Transaction

  /**
   * Explorer base path
   */
  protected explorerBaseUrl: string

  /**
   * Network mosaic id
   * @private
   */
  protected networkMosaic: MosaicId

  /**
   * Transaction type from SDK
   */
  private transactionType = TransactionType

  /**
   * Formatters
   */
  public formatters: Formatters = Formatters

  /**
   * Time helpers
   */
  protected timeHelpers: TimeHelpers = TimeHelpers

  /// region computed properties getter/setter
  public get view(): TransactionView<Transaction> {
    return TransactionViewFactory.getView(this.$store, this.transaction)
  }

  /// end-region computed properties getter/setter

  /**
   * Get icon per-transaction
   * @return an icon.
   */
  public getIcon() {
    if (this.transaction.isConfirmed()) {
      // - read per-transaction-type details@
      const view = this.view

      // - transfers have specific incoming/outgoing icons
      if (view.transaction.type === this.transactionType.TRANSFER) {
        return view.isIncoming ? officialIcons.incoming : officialIcons.outgoing
      }

      // - otherwise use per-type icon
      return transactionTypeToIcon[view.transaction.type]
    } else {
      return this.getTransactionStatusIcon()
    }
  }
  public getTransactionStatusIcon(): string {
    return dashboardImages.dashboardUnconfirmed
  }
  /**
   * Returns true if \a transaction is an incoming transaction
   */
  public isIncomingTransaction(): boolean {
    return this.view.isIncoming
  }

  /**
   * Returns the amount to be shown. The first mosaic or the paid fee.
   */
  public getAmount(): number {
    if (this.transaction.type === TransactionType.TRANSFER) {
      // We may prefer XYM over other mosaic if XYM is 2nd+
      const transferTransaction = this.transaction as TransferTransaction
      return (transferTransaction.mosaics.length && transferTransaction.mosaics[0].amount.compact()) || 0
    }
    return undefined
  }

  /**
   * Returns the color of the balance
   */
  public getAmountColor(): string {
    // https://github.com/nemfoundation/nem2-desktop-account/issues/879
    if (this.transaction.type === TransactionType.TRANSFER) {
      return this.isIncomingTransaction() ? 'green' : 'red'
    }
    return undefined
  }

  /**
   * Returns the mosaic id of the balance or undefined for the network.
   */
  public getAmountMosaicId(): MosaicId | NamespaceId | undefined {
    if (this.transaction.type === TransactionType.TRANSFER) {
      // We may prefer XYM over other mosaic if XYM is 2nd+
      const transferTransaction = this.transaction as TransferTransaction
      return (transferTransaction.mosaics.length && transferTransaction.mosaics[0].id) || undefined
    }
    return undefined
  }

  /**
   * Should he ticker be shown in the amount column
   */
  public isAmountShowTicker(): boolean {
    // if (this.transaction.type === TransactionType.TRANSFER) {
    //   const transferTransaction = this.transaction as TransferTransaction
    //   return !!transferTransaction.mosaics.length
    // }
    // return true
    return false
  }

  /**
   * Returns the transaction height or number of confirmations
   */
  public getHeight(): string {
    const transactionStatus = TransactionView.getTransactionStatus(this.transaction)
    if (transactionStatus == TransactionStatus.confirmed) {
      return this.view.info?.height.compact().toLocaleString()
    } else {
      return this.$t(`transaction_status_${transactionStatus}`).toString()
    }
  }
}
