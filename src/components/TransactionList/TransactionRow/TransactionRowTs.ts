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
import { TransactionService, TransactionViewType } from '@/services/TransactionService'
import { Formatters } from '@/core/utils/Formatters'
import { TimeHelpers } from '@/core/utils/TimeHelpers'
// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'

// @ts-ignore
import ActionDisplay from '@/components/ActionDisplay/ActionDisplay.vue'

// configuration
import networkConfig from '@/../config/network.conf.json'

// resources
import { transactionTypeToIcon, officialIcons, dashboardImages } from '@/views/resources/Images'

@Component({
  components: {
    ActionDisplay,
    MosaicAmountDisplay,
  },
  computed: { ...mapGetters({ networkMosaic: 'mosaic/networkMosaic' }) },
})
export class TransactionRowTs extends Vue {
  @Prop({ default: [] })
  public transaction: Transaction

  @Prop({ default: false })
  public isPartial: boolean

  /**
   * Transaction service
   * @var {TransactionService}
   */
  public service: TransactionService = new TransactionService(this.$store)

  /**
   * Network mosaic id
   * @private
   * @type {MosaicId}
   */
  protected networkMosaic: MosaicId

  /**
   * Transaction type from SDK
   * @type {TransactionType}
   */
  private transactionType = TransactionType

  /**
   * Formatters
   * @var {Formatters}
   */
  public formatters: Formatters = Formatters

  /**
   * Time helpers
   * @var {Formatters}
   */
  protected timeHelpers: TimeHelpers = TimeHelpers

  /**
   * Explorer base path
   * @var {string}
   */
  public explorerBaseUrl: string = networkConfig.explorerUrl

  /// region computed properties getter/setter
  public get view(): TransactionViewType {
    return this.service.getView(this.transaction as any)
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
        return view.values.get('isIncoming') ? officialIcons.incoming : officialIcons.outgoing
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
    // - read per-transaction-type details
    return this.view.values.get('isIncoming')
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
    // https://github.com/nemfoundation/nem2-desktop-account/issues/879
    // We may want to show N/A instead of the paid fee
    if (!this.view) return 0
    const effectiveFee = this.view.values.get('effectiveFee')
    if (effectiveFee !== undefined) {
      return effectiveFee
    }
    const maxFee = this.view.values.get('maxFee')
    if (maxFee !== undefined) {
      return maxFee
    }
    return 0
  }

  /**
   * Returns the color of the balance
   */
  public getAmountColor(): string {
    // https://github.com/nemfoundation/nem2-desktop-account/issues/879
    if (this.transaction.type === TransactionType.TRANSFER) {
      return this.isIncomingTransaction() ? 'green' : 'red'
    }
    return 'red'
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
    if (this.isPartial) {
      return 'partial'
    } else {
      return this.view.info?.height.compact().toLocaleString() || this.$t('unconfirmed').toString()
    }
  }
}
