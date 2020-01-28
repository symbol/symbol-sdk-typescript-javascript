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
  SignedTransaction,
  TransactionMapping,
  LockFundsTransaction,
} from 'nem2-sdk'
import {from, Observable} from 'rxjs'
import {map, flatMap} from 'rxjs/operators'

// internal dependencies
import {AbstractService} from './AbstractService'
import {WalletsModel} from '@/core/database/models/AppWallet'
import {BroadcastResult} from '@/core/transactions/BroadcastResult'

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
  constructor(store: Store<any>) {
    super(store)
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
    case TransactionType.TRANSFER: return transaction as TransferTransaction
    case TransactionType.ACCOUNT_RESTRICTION_ADDRESS: return transaction as AccountAddressRestrictionTransaction
    case TransactionType.LINK_ACCOUNT: return transaction as AccountLinkTransaction
    case TransactionType.ACCOUNT_METADATA_TRANSACTION: return transaction as AccountMetadataTransaction
    case TransactionType.ACCOUNT_RESTRICTION_MOSAIC: return transaction as AccountMosaicRestrictionTransaction
    case TransactionType.ACCOUNT_RESTRICTION_OPERATION: return transaction as AccountOperationRestrictionTransaction
    case TransactionType.ADDRESS_ALIAS: return transaction as AddressAliasTransaction
    case TransactionType.AGGREGATE_BONDED:
    case TransactionType.AGGREGATE_COMPLETE: return transaction as AggregateTransaction
    case TransactionType.LOCK: return transaction as HashLockTransaction
    case TransactionType.MOSAIC_ADDRESS_RESTRICTION: return transaction as MosaicAddressRestrictionTransaction
    case TransactionType.MOSAIC_ALIAS: return transaction as MosaicAliasTransaction
    case TransactionType.MOSAIC_DEFINITION: return transaction as MosaicDefinitionTransaction
    case TransactionType.MOSAIC_GLOBAL_RESTRICTION: return transaction as MosaicGlobalRestrictionTransaction
    case TransactionType.MOSAIC_METADATA_TRANSACTION: return transaction as MosaicMetadataTransaction
    case TransactionType.MOSAIC_SUPPLY_CHANGE: return transaction as MosaicSupplyChangeTransaction
    case TransactionType.MODIFY_MULTISIG_ACCOUNT: return transaction as MultisigAccountModificationTransaction
    case TransactionType.NAMESPACE_METADATA_TRANSACTION: return transaction as NamespaceMetadataTransaction
    case TransactionType.REGISTER_NAMESPACE: return transaction as NamespaceRegistrationTransaction
    case TransactionType.SECRET_LOCK: return transaction as SecretLockTransaction
    case TransactionType.SECRET_PROOF: return transaction as SecretProofTransaction
    case TransactionType.TRANSFER: return transaction as TransferTransaction
   }
  }

  /**
   * Returns true when \a transaction is an incoming transaction
   * @param {Transaction} transaction 
   * @return {boolean}
   */
  public getTransactionDetails(transaction: Transaction): {
    hasBlockInfo: boolean,
    isIncoming: boolean,
    maxFee: number,
    effectiveFee: number,
  } {
    // store shortcuts
    const currentWallet: WalletsModel = this.$store.getters['wallet/currentWallet']
    const knownWallets: WalletsModel[] = this.$store.getters['wallet/knownWallets']
    const knownBlocks: BlockInfo[] = this.$store.getters['network/knownBlocks']

    // try to find block for fee information
    const height = transaction.transactionInfo ? transaction.transactionInfo.height : undefined
    const block = knownBlocks.find((known: BlockInfo) => known.height.equals(height))

    const isAggregate = [
      TransactionType.AGGREGATE_BONDED,
      TransactionType.AGGREGATE_COMPLETE
    ].includes(transaction.type)

    let details = {
      isIncoming: false,
      maxFee: isAggregate ? 0 : transaction.maxFee.compact(),
      effectiveFee: 0,
      hasBlockInfo: undefined !== block
    }

    if (TransactionType.TRANSFER === transaction.type) {
      const transfer = this.getDerivateTransaction(transaction) as TransferTransaction
      details['isIncoming'] = transfer.recipientAddress.equals(currentWallet.address())
    }

    // - populate common transaction fields
    if (! isAggregate && details.hasBlockInfo) {
      details['effectiveFee'] = transaction.size * block.feeMultiplier
    }

    return details
  }

  /**
   * Announce any _signed_ transaction. This method uses the nem2-sdk
   * TransactionService to announce locks before aggregate bonded
   * transactions.
   * @return {Observable<BroadcastResult[]>}
   */
  public announceSignedTransactions(): Observable<BroadcastResult[]> {
    // shortcuts
    const signedTransactions = this.$store.getters['wallet/signedTransactions']
    
    // - simple transactions only
    const transactions = signedTransactions.filter(
      tx => ![
        TransactionType.AGGREGATE_BONDED,
        TransactionType.LOCK
      ].includes(tx.type))

    return transactions.map(transaction => { 
      return this.$store.dispatch('REST_ANNOUNCE_TRANSACTION', transaction)
    })
  }

}
