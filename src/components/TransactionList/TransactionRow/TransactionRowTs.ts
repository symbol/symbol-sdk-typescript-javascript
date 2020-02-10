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
import {
  Transaction,
  TransactionType,
  TransferTransaction,
  MosaicDefinitionTransaction,
  MosaicSupplyChangeTransaction,
  NamespaceRegistrationTransaction,
} from 'nem2-sdk'

// internal dependencies
import {TransactionService, TransactionViewType} from '@/services/TransactionService'
import {Formatters} from '@/core/utils/Formatters'

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
import {transferIcons, transactionTypeToIcon} from '@/views/resources/Images'

@Component({components: {
    AddressDisplay,
    ActionDisplay,
    MosaicAmountDisplay,
  }})
export class TransactionRowTs extends Vue {
  
  @Prop({
    default: []
  }) transaction: Transaction

  /**
   * Transaction service
   * @var {TransactionService}
   */
  public service: TransactionService
  
  /**
   * Formatters
   * @var {Formatters}
   */
  public formatters: Formatters = Formatters

  /**
   * Explorer base path
   * @var {string}
   */
  public explorerBaseUrl: string = networkConfig.explorerUrl

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public async mounted() {
    this.service = new TransactionService(this.$store)
  }

/// region computed properties getter/setter
  public get view(): TransactionViewType {
    switch (this.transaction.type) {
      case TransactionType.MOSAIC_DEFINITION: 
        return this.service.getView(this.transaction as MosaicDefinitionTransaction)
      case TransactionType.MOSAIC_SUPPLY_CHANGE:
        return this.service.getView(this.transaction as MosaicSupplyChangeTransaction)
      case TransactionType.REGISTER_NAMESPACE:
        return this.service.getView(this.transaction as NamespaceRegistrationTransaction)
      case TransactionType.TRANSFER:
        return this.service.getView(this.transaction as TransferTransaction)
    }
  }
/// end-region computed properties getter/setter

  /**
   * Get icon per-transaction
   * @param {Transaction} transaction 
   * @return {string}
   */
  public getIcon() {
    // - read per-transaction-type details
    const view = this.view

    // - transfers have specific incoming/outgoing icons
    if (view.transaction.type === TransactionType.TRANSFER) {
      return view.values.get('isIncoming') 
          ? transferIcons.transferReceived
          : transferIcons.transferSent
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
    return this.view.values.get('effectiveFee')
        || this.view.values.get('maxFee').compact()
        || 0
  }

  /**
   * Returns the transaction height or number of confirmations
   * @param transaction 
   */
  public getHeight(): number | string {
    return this.view.info?.height.compact() 
        || this.$t('unconfirmed').toString()
  }
}
