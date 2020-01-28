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
import {Component, Prop, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {Transaction, TransactionType, TransferTransaction, NetworkType} from 'nem2-sdk'

// internal dependencies
import {TransactionParams} from '@/core/transactions/TransactionParams'
import {TransferTransactionParams} from '@/core/transactions/TransferTransactionParams'
import {TransactionService} from '@/services/TransactionService'
import {Formatters} from '@/core/utils/Formatters'

// configuration
import networkConfig from '@/../config/network.conf.json'

// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'

@Component({
  components: {
    MosaicAmountDisplay,
  },
  computed: {...mapGetters({
    networkType: 'network/networkType',
    networkMosaicTicker: 'mosaic/networkMosaicTicker',
  })},
})
export class TransactionDetailsTs extends Vue {

  @Prop({
    default: null
  }) transaction: Transaction

  /**
   * Current network type
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Current network currency mosaic ticker
   * @see {Store.Mosaic}
   * @var {string}
   */
  public networkMosaicTicker: string

  /**
   * Explorer base path
   * @var {string}
   */
  public explorerBaseUrl: string = networkConfig.explorerUrl

  /**
   * Formatters
   * @var {Formatters}
   */
  public formatters = Formatters

  /**
   * Transaction service
   * @var {TransactionService}
   */
  public transactionService: TransactionService

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public mounted() {
    this.transactionService = new TransactionService(this.$store)
  }

/// region computed properties getter/setter
  public get parameters(): TransactionParams {
    switch(this.transaction.type) {
    default: throw new Error('Invalid transaction type in TransactionDetails')
    case TransactionType.TRANSFER:
      return TransferTransactionParams.createFromTransaction(this.transaction as TransferTransaction)
    }
  }
/// end-region computed properties getter/setter

  /**
   * Returns the effective fee paid if available
   * @return {number}
   */
  public getFeeAmount(): number {
    // - read per-transaction-type details
    const details = this.transactionService.getTransactionDetails(this.transaction)
    return details.effectiveFee || this.transaction.maxFee?.compact() || 0
  }

  /*
  get explorerBasePath() {
    return this.app.explorerBasePath
  }
  get networkCurrency() {
    return this.activeAccount.networkCurrency
  }

  get transactionDetails() {
    return this.transaction.formattedInnerTransactions ?
      this.transaction.formattedInnerTransactions.map(item => item.dialogDetailMap) :
      [this.transaction.dialogDetailMap]
  }

  getStatus(): string {
    if (!this.transaction.rawTx.signer) return null
    return this.transaction.transactionStatusGroup
  }

  openExplorer(transactionHash) {
    const {explorerBasePath} = this
    return explorerBasePath + transactionHash
  }
  */
}
