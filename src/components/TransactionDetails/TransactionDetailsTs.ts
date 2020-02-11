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
import {
  Transaction,
  TransactionType,
  NetworkType,
  MosaicId,
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
  MosaicMetadataTransaction,
  MosaicSupplyChangeTransaction,
  MultisigAccountModificationTransaction,
  NamespaceMetadataTransaction,
  NamespaceRegistrationTransaction,
  SecretLockTransaction,
  SecretProofTransaction,
  TransferTransaction,
} from 'nem2-sdk'

// internal dependencies
import {TransactionService, TransactionViewType} from '@/services/TransactionService'
import {Formatters} from '@/core/utils/Formatters'

// configuration
import networkConfig from '@/../config/network.conf.json'

// child components
// @ts-ignore
import TransactionDetailsHeader from '@/components/TransactionDetailsHeader/TransactionDetailsHeader.vue'
// @ts-ignore
import TransactionDetailsTransfer from '@/components/TransactionDetails/Transfer/Transfer.vue'
// @ts-ignore
import TransactionDetailsMosaicDefinition from '@/components/TransactionDetails/MosaicDefinition/MosaicDefinition.vue'
// @ts-ignore
import TransactionDetailsMosaicSupplyChange from '@/components/TransactionDetails/MosaicSupplyChange/MosaicSupplyChange.vue'
// @ts-ignore
import TransactionDetailsNamespaceRegistration from '@/components/TransactionDetails/NamespaceRegistration/NamespaceRegistration.vue'

@Component({
  components: {
    TransactionDetailsHeader,
    TransactionDetailsTransfer,
    TransactionDetailsMosaicDefinition,
    TransactionDetailsMosaicSupplyChange,
    TransactionDetailsNamespaceRegistration,
  },
  computed: {...mapGetters({
    networkType: 'network/networkType',
    networkMosaic: 'mosaic/networkMosaic',
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

  public created() {
    if (!!this.transaction) {
      this.view = this.getView()
    }
  }

  public getView(): TransactionViewType {
    this.service = new TransactionService(this.$store)

    switch (this.transaction.type) {
      case TransactionType.MOSAIC_DEFINITION: 
        return this.service.getView(this.transaction as MosaicDefinitionTransaction)
      case TransactionType.MOSAIC_SUPPLY_CHANGE:
        return this.service.getView(this.transaction as MosaicSupplyChangeTransaction)
      case TransactionType.REGISTER_NAMESPACE:
        return this.service.getView(this.transaction as NamespaceRegistrationTransaction)
      case TransactionType.TRANSFER:
        return this.service.getView(this.transaction as TransferTransaction)
      case TransactionType.ACCOUNT_RESTRICTION_ADDRESS:
        return this.service.getView(this.transaction as AccountAddressRestrictionTransaction)
      case TransactionType.LINK_ACCOUNT:
        return this.service.getView(this.transaction as AccountLinkTransaction)
      case TransactionType.ACCOUNT_METADATA_TRANSACTION:
        return this.service.getView(this.transaction as AccountMetadataTransaction)
      case TransactionType.ACCOUNT_RESTRICTION_MOSAIC:
        return this.service.getView(this.transaction as AccountMosaicRestrictionTransaction)
      case TransactionType.ACCOUNT_RESTRICTION_OPERATION:
        return this.service.getView(this.transaction as AccountOperationRestrictionTransaction)
      case TransactionType.ADDRESS_ALIAS:
        return this.service.getView(this.transaction as AddressAliasTransaction)
      case TransactionType.AGGREGATE_BONDED:
      case TransactionType.AGGREGATE_COMPLETE:
        return this.service.getView(this.transaction as AggregateTransaction)
      case TransactionType.LOCK:
        return this.service.getView(this.transaction as HashLockTransaction)
      case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
        return this.service.getView(this.transaction as MosaicAddressRestrictionTransaction)
      case TransactionType.MOSAIC_ALIAS:
        return this.service.getView(this.transaction as MosaicAliasTransaction)
      case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
        return this.service.getView(this.transaction as MosaicGlobalRestrictionTransaction)
      case TransactionType.MOSAIC_METADATA_TRANSACTION:
        return this.service.getView(this.transaction as MosaicMetadataTransaction)
      case TransactionType.MODIFY_MULTISIG_ACCOUNT:
        return this.service.getView(this.transaction as MultisigAccountModificationTransaction)
      case TransactionType.NAMESPACE_METADATA_TRANSACTION:
        return this.service.getView(this.transaction as NamespaceMetadataTransaction)
      case TransactionType.SECRET_LOCK:
        return this.service.getView(this.transaction as SecretLockTransaction)
      case TransactionType.SECRET_PROOF:
        return this.service.getView(this.transaction as SecretProofTransaction)
    }
  }

  /**
   * Whether set transaction is of type \a type
   * @param {TransactionType} type 
   * @return {boolean}
   */
  public isType(type): boolean {
    return !!this.transaction && this.transaction.type === type
  }
}
