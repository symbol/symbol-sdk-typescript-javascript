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
import {Store} from 'vuex'
import {
  Transaction,
  TransactionType,
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
  BlockInfo,
} from 'nem2-sdk'

// internal dependencies
import {AbstractService} from './AbstractService'
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {BroadcastResult} from '@/core/transactions/BroadcastResult'
import {ViewMosaicDefinitionTransaction} from '@/core/transactions/ViewMosaicDefinitionTransaction'
import {ViewMosaicSupplyChangeTransaction} from '@/core/transactions/ViewMosaicSupplyChangeTransaction'
import {ViewNamespaceRegistrationTransaction} from '@/core/transactions/ViewNamespaceRegistrationTransaction'
import {ViewTransferTransaction} from '@/core/transactions/ViewTransferTransaction'
import {ViewUnknownTransaction} from '@/core/transactions/ViewUnknownTransaction'
import {ViewAliasTransaction} from '@/core/transactions/ViewAliasTransaction'

/// region custom types
export type TransactionViewType = ViewMosaicDefinitionTransaction
| ViewMosaicSupplyChangeTransaction
| ViewNamespaceRegistrationTransaction
| ViewTransferTransaction
| ViewUnknownTransaction
| ViewAliasTransaction
/// end-region custom types

export class TransactionService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'transaction'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store?: Store<any>) {
    super()
    this.$store = store
  }

  /**
   * Cast \a transaction to its specialized derivate class
   * @param {Transaction} transaction 
   * @return {Transaction}
   */
  public getDerivateTransaction(transaction: Transaction): Transaction {
    switch(transaction.type) {
      default:
        throw new Error('Transaction type not supported yet.')
      case TransactionType.ACCOUNT_ADDRESS_RESTRICTION: return transaction as AccountAddressRestrictionTransaction
      case TransactionType.ACCOUNT_LINK: return transaction as AccountLinkTransaction
      case TransactionType.ACCOUNT_METADATA: return transaction as AccountMetadataTransaction
      case TransactionType.ACCOUNT_MOSAIC_RESTRICTION: return transaction as AccountMosaicRestrictionTransaction
      case TransactionType.ACCOUNT_OPERATION_RESTRICTION: return transaction as AccountOperationRestrictionTransaction
      case TransactionType.ADDRESS_ALIAS: return transaction as AddressAliasTransaction
      case TransactionType.AGGREGATE_BONDED:
      case TransactionType.AGGREGATE_COMPLETE: return transaction as AggregateTransaction
      case TransactionType.HASH_LOCK: return transaction as HashLockTransaction
      case TransactionType.MOSAIC_ADDRESS_RESTRICTION: return transaction as MosaicAddressRestrictionTransaction
      case TransactionType.MOSAIC_ALIAS: return transaction as MosaicAliasTransaction
      case TransactionType.MOSAIC_DEFINITION: return transaction as MosaicDefinitionTransaction
      case TransactionType.MOSAIC_GLOBAL_RESTRICTION: return transaction as MosaicGlobalRestrictionTransaction
      case TransactionType.MOSAIC_METADATA: return transaction as MosaicMetadataTransaction
      case TransactionType.MOSAIC_SUPPLY_CHANGE: return transaction as MosaicSupplyChangeTransaction
      case TransactionType.MULTISIG_ACCOUNT_MODIFICATION: return transaction as MultisigAccountModificationTransaction
      case TransactionType.NAMESPACE_METADATA: return transaction as NamespaceMetadataTransaction
      case TransactionType.NAMESPACE_REGISTRATION: return transaction as NamespaceRegistrationTransaction
      case TransactionType.SECRET_LOCK: return transaction as SecretLockTransaction
      case TransactionType.SECRET_PROOF: return transaction as SecretProofTransaction
      case TransactionType.TRANSFER: return transaction as TransferTransaction
    }
  }

  /// region specialised signatures
  public getView(transaction: MosaicDefinitionTransaction): ViewMosaicDefinitionTransaction
  public getView(transaction: MosaicSupplyChangeTransaction): ViewMosaicSupplyChangeTransaction
  public getView(transaction: NamespaceRegistrationTransaction): ViewNamespaceRegistrationTransaction
  public getView(transaction: TransferTransaction): ViewTransferTransaction
  public getView(transaction: MosaicAliasTransaction): ViewAliasTransaction
  public getView(transaction: AddressAliasTransaction): ViewAliasTransaction
  // XXX not implemented yet
  public getView(transaction: AccountAddressRestrictionTransaction): ViewUnknownTransaction
  public getView(transaction: AccountLinkTransaction): ViewUnknownTransaction
  public getView(transaction: AccountMetadataTransaction): ViewUnknownTransaction
  public getView(transaction: AccountMosaicRestrictionTransaction): ViewUnknownTransaction
  public getView(transaction: AccountOperationRestrictionTransaction): ViewUnknownTransaction
  public getView(transaction: AggregateTransaction): ViewUnknownTransaction
  public getView(transaction: HashLockTransaction): ViewUnknownTransaction
  public getView(transaction: MosaicAddressRestrictionTransaction): ViewUnknownTransaction
  public getView(transaction: MosaicGlobalRestrictionTransaction): ViewUnknownTransaction
  public getView(transaction: MosaicMetadataTransaction): ViewUnknownTransaction
  public getView(transaction: MultisigAccountModificationTransaction): ViewUnknownTransaction
  public getView(transaction: NamespaceMetadataTransaction): ViewUnknownTransaction
  public getView(transaction: SecretLockTransaction): ViewUnknownTransaction
  public getView(transaction: SecretProofTransaction): ViewUnknownTransaction
  /// end-region specialised signatures

  /**
   * Returns true when \a transaction is an incoming transaction
   * @param {Transaction} transaction 
   * @return {TransactionViewType}
   * @throws {Error} On unrecognized transaction type (view not implemented)
   */
  public getView(transaction: Transaction): TransactionViewType {
    // - store shortcuts
    const currentWallet: WalletsModel = this.$store.getters['wallet/currentWallet']
    const knownBlocks: {[h: number]: BlockInfo} = this.$store.getters['network/knownBlocks']

    // - interpret transaction type and initialize view
    let view: TransactionViewType

    switch (transaction.type) {
    /// region XXX views for transaction types not yet implemented
      case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
      case TransactionType.ACCOUNT_LINK:
      case TransactionType.ACCOUNT_METADATA:
      case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
      case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
      case TransactionType.AGGREGATE_BONDED:
      case TransactionType.AGGREGATE_COMPLETE:
      case TransactionType.HASH_LOCK:
      case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
      case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
      case TransactionType.MOSAIC_METADATA:
      case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
      case TransactionType.NAMESPACE_METADATA:
      case TransactionType.SECRET_LOCK:
      case TransactionType.SECRET_PROOF:
        view = new ViewUnknownTransaction(this.$store)
        view = view.use(transaction)
        break

        /// end-region XXX views for transaction types not yet implemented
      case TransactionType.MOSAIC_DEFINITION:
        view = new ViewMosaicDefinitionTransaction(this.$store)
        view = view.use(transaction as MosaicDefinitionTransaction)
        break
      case TransactionType.MOSAIC_SUPPLY_CHANGE:
        view = new ViewMosaicSupplyChangeTransaction(this.$store) 
        view = view.use(transaction as MosaicSupplyChangeTransaction)
        break
      case TransactionType.NAMESPACE_REGISTRATION:
        view = new ViewNamespaceRegistrationTransaction(this.$store)
        view = view.use(transaction as NamespaceRegistrationTransaction)
        break
      case TransactionType.TRANSFER:
        view = new ViewTransferTransaction(this.$store)
        view = view.use(transaction as TransferTransaction)
        break
      case TransactionType.MOSAIC_ALIAS:
        view = new ViewAliasTransaction(this.$store)
        view = view.use(transaction as MosaicAliasTransaction)
        break
      case TransactionType.ADDRESS_ALIAS:
        view = new ViewAliasTransaction(this.$store)
        view = view.use(transaction as AddressAliasTransaction)
        break
      default:
      // - throw on transaction view not implemented 
        const errorMessage = `View not implemented for transaction type '${transaction.type} '`
        this.$store.dispatch('diagnostic/ADD_ERROR', errorMessage)
        throw new Error(errorMessage)
    }

    // - try to find block for fee information
    const height = transaction.transactionInfo ? transaction.transactionInfo.height : undefined
    const block: BlockInfo = !height ? undefined : Object.keys(knownBlocks).filter(
      k => knownBlocks[k].height.equals(height),
    ).map(k => knownBlocks[k]).shift()

    const isAggregate = [
      TransactionType.AGGREGATE_BONDED,
      TransactionType.AGGREGATE_COMPLETE,
    ].includes(transaction.type)

    // - set helper fields
    view.values.set('isIncoming', false)
    view.values.set('hasBlockInfo', undefined !== block)

    // - initialize fee fields
    view.values.set('maxFee', isAggregate ? 0 : transaction.maxFee.compact())
    view.values.set('effectiveFee', 0)
    if (!isAggregate && view.values.get('hasBlockInfo')) {
      view.values.set('effectiveFee', transaction.size * block.feeMultiplier)
    }

    // - update helper fields by transaction type
    if (TransactionType.TRANSFER === transaction.type) {
      const transfer = this.getDerivateTransaction(transaction) as TransferTransaction
      view.values.set('isIncoming', transfer.recipientAddress.equals(currentWallet.objects.address))
    }

    return view
  }

  /**
   * Announce any _signed_ transaction. This method uses the nem2-sdk
   * TransactionService to announce locks before aggregate bonded
   * transactions.
   * @return {Observable<BroadcastResult[]>}
   */
  public async announceSignedTransactions(): Promise<BroadcastResult[]> {
    // shortcuts
    const signedTransactions = this.$store.getters['wallet/signedTransactions']

    // - simple transactions only
    const transactions = signedTransactions.filter(
      tx => ![
        TransactionType.AGGREGATE_BONDED,
        TransactionType.HASH_LOCK,
      ].includes(tx.type))

    const results: BroadcastResult[] = []
    for (let i = 0, m = transactions.length; i < m; i ++) {
      const transaction = transactions[i]
      const result = await this.$store.dispatch('wallet/REST_ANNOUNCE_TRANSACTION', transaction)
      results.push(result)
    }
    
    return results
  }
}
