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
// external dependencies
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {Transaction, TransactionType, MosaicId} from 'symbol-sdk'

// internal dependencies
import {TransactionService, TransactionViewType} from '@/services/TransactionService'
import {Formatters} from '@/core/utils/Formatters'
import {TimeHelpers} from '@/core/utils/TimeHelpers'

// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'
// @ts-ignore
import AddressDisplay from '@/components/AddressDisplay/AddressDisplay.vue'
// @ts-ignore
import ActionDisplay from '@/components/ActionDisplay/ActionDisplay.vue'

// configuration
import networkConfig from '@/../config/network.conf.json'

// resources
import {transactionTypeToIcon, officialIcons} from '@/views/resources/Images'

@Component({
  components: {
    AddressDisplay,
    ActionDisplay,
    MosaicAmountDisplay,
  },
  computed: {...mapGetters({networkMosaic: 'mosaic/networkMosaic'})},
})
export class TransactionRowTs extends Vue {

  @Prop({
    default: [],
  }) transaction: Transaction

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
   * @param {Transaction} transaction 
   * @return {string}
   */
  public getIcon() {
    // - read per-transaction-type details@
    const view = this.view

    // - transfers have specific incoming/outgoing icons
    if (view.transaction.type === this.transactionType.TRANSFER) {
      return view.values.get('isIncoming')
        ? officialIcons.incoming
        : officialIcons.outgoing
    }

    // - otherwise use per-type icon
    return transactionTypeToIcon[view.transaction.type]
  }

  /**
   * Returns true if \a transaction is an incoming transaction
   * @return {boolean}
   */
  public isIncomingTransaction(): boolean {
    // - read per-transaction-type details
    return this.view.values.get('isIncoming')
  }

  /**
   * Returns the effective fee paid if available
   * @return {number}
   */
  public getFeeAmount(): number {
    this.view.values

    if (this.view.values.get('effectiveFee') !== undefined) return this.view.values.get('effectiveFee')
    if (this.view.values.get('maxFee') !== undefined) return this.view.values.get('maxFee')
    return 0
  }

  /**
   * Returns the transaction height or number of confirmations
   * @param transaction 
   */
  public getHeight(): string {
    return this.view.info?.height.compact().toLocaleString()
      || this.$t('unconfirmed').toString()
  }
}
