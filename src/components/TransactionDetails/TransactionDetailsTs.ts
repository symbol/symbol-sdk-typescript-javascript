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
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import {
  AccountAddressRestrictionTransaction,
  AccountLinkTransaction,
  AccountMetadataTransaction,
  AccountMosaicRestrictionTransaction,
  AccountOperationRestrictionTransaction,
  AddressAliasTransaction,
  AggregateTransaction,
  HashLockTransaction,
  MosaicAddressRestrictionTransaction,
  MosaicAliasTransaction,
  MosaicDefinitionTransaction,
  MosaicGlobalRestrictionTransaction,
  MosaicId,
  MosaicMetadataTransaction,
  MosaicSupplyChangeTransaction,
  MultisigAccountModificationTransaction,
  NamespaceMetadataTransaction,
  NamespaceRegistrationTransaction,
  NetworkType,
  SecretLockTransaction,
  SecretProofTransaction,
  Transaction,
  TransactionType,
  TransferTransaction,
} from 'symbol-sdk'

// internal dependencies
import { TransactionService, TransactionViewType } from '@/services/TransactionService'
import { Formatters } from '@/core/utils/Formatters'

// child components
// @ts-ignore
import DetailView from './DetailView.vue'
// @ts-ignore
import TransactionDetailsHeader from '@/components/TransactionDetailsHeader/TransactionDetailsHeader.vue'

//@ts-ignore
@Component({
  components: { DetailView, TransactionDetailsHeader },
  computed: {
    ...mapGetters({
      networkType: 'network/networkType',
      networkMosaic: 'mosaic/networkMosaic',
      networkMosaicTicker: 'mosaic/networkMosaicTicker',
    }),
  },
})
export class TransactionDetailsTs extends Vue {
  /**
   * Transaction to render
   * @type {Transaction}
   */
  @Prop({ default: null }) transaction: Transaction

  protected views: TransactionViewType[] = []

  /**
   * Current network type
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Network mosaic id
   * @see {Store.Mosaic}
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Current network currency mosaic ticker
   * @see {Store.Mosaic}
   * @var {string}
   */
  public networkMosaicTicker: string

  /**
   * Formatters
   * @var {Formatters}
   */
  public formatters = Formatters

  /**
   * Transaction service
   * @var {TransactionService}
   */
  public service: TransactionService

  /**
   * Transaction view instance
   * @var {TransactionViewType}
   */
  public view: TransactionViewType

  /**
   * Expose transaction types to view
   * @var {TransactionType}
   */
  public types = TransactionType

  public mounted() {
    this.service = new TransactionService(this.$store)

    if (this.transaction instanceof AggregateTransaction) {
      this.views = [this.getView(this.transaction), ...this.transaction.innerTransactions.map((tx) => this.getView(tx))]
      return
    }

    this.views = [this.getView(this.transaction)]
  }

  private getView(transaction: Transaction): TransactionViewType {
    switch (transaction.type) {
      case TransactionType.MOSAIC_DEFINITION:
        return this.service.getView(transaction as MosaicDefinitionTransaction)
      case TransactionType.MOSAIC_SUPPLY_CHANGE:
        return this.service.getView(transaction as MosaicSupplyChangeTransaction)
      case TransactionType.NAMESPACE_REGISTRATION:
        return this.service.getView(transaction as NamespaceRegistrationTransaction)
      case TransactionType.TRANSFER:
        return this.service.getView(transaction as TransferTransaction)
      case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
        return this.service.getView(transaction as AccountAddressRestrictionTransaction)
      case TransactionType.ACCOUNT_LINK:
        return this.service.getView(transaction as AccountLinkTransaction)
      case TransactionType.ACCOUNT_METADATA:
        return this.service.getView(transaction as AccountMetadataTransaction)
      case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
        return this.service.getView(transaction as AccountMosaicRestrictionTransaction)
      case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
        return this.service.getView(transaction as AccountOperationRestrictionTransaction)
      case TransactionType.ADDRESS_ALIAS:
        return this.service.getView(transaction as AddressAliasTransaction)
      case TransactionType.AGGREGATE_BONDED:
      case TransactionType.AGGREGATE_COMPLETE:
        return this.service.getView(transaction as AggregateTransaction)
      case TransactionType.HASH_LOCK:
        return this.service.getView(transaction as HashLockTransaction)
      case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
        return this.service.getView(transaction as MosaicAddressRestrictionTransaction)
      case TransactionType.MOSAIC_ALIAS:
        return this.service.getView(transaction as MosaicAliasTransaction)
      case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
        return this.service.getView(transaction as MosaicGlobalRestrictionTransaction)
      case TransactionType.MOSAIC_METADATA:
        return this.service.getView(transaction as MosaicMetadataTransaction)
      case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
        return this.service.getView(transaction as MultisigAccountModificationTransaction)
      case TransactionType.NAMESPACE_METADATA:
        return this.service.getView(transaction as NamespaceMetadataTransaction)
      case TransactionType.SECRET_LOCK:
        return this.service.getView(transaction as SecretLockTransaction)
      case TransactionType.SECRET_PROOF:
        return this.service.getView(transaction as SecretProofTransaction)
    }
  }
}
