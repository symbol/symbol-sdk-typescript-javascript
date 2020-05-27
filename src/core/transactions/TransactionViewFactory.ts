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
import {
  AddressAliasTransaction,
  HashLockTransaction,
  MosaicAliasTransaction,
  MosaicDefinitionTransaction,
  MosaicSupplyChangeTransaction,
  MultisigAccountModificationTransaction,
  NamespaceRegistrationTransaction,
  Transaction,
  TransactionType,
  TransferTransaction,
} from 'symbol-sdk'
import { ViewUnknownTransaction } from '@/core/transactions/ViewUnknownTransaction'
import { ViewHashLockTransaction } from '@/core/transactions/ViewHashLockTransaction'
import { ViewMultisigAccountModificationTransaction } from '@/core/transactions/ViewMultisigAccountModificationTransaction'
import { ViewMosaicDefinitionTransaction } from '@/core/transactions/ViewMosaicDefinitionTransaction'
import { ViewMosaicSupplyChangeTransaction } from '@/core/transactions/ViewMosaicSupplyChangeTransaction'
import { ViewNamespaceRegistrationTransaction } from '@/core/transactions/ViewNamespaceRegistrationTransaction'
import { ViewTransferTransaction } from '@/core/transactions/ViewTransferTransaction'
import { ViewAliasTransaction } from '@/core/transactions/ViewAliasTransaction'
import { Store } from 'vuex'
import { TransactionView } from '@/core/transactions/TransactionView'

/**
 * Transaction view factory.
 */
export class TransactionViewFactory {
  /**
   * It creates the view for the given transaction.
   *
   * @param $store the vue store.
   * @param transaction the transaction.
   */
  public static getView($store: Store<any>, transaction: Transaction): TransactionView<Transaction> {
    switch (transaction.type) {
      /// region XXX views for transaction types not yet implemented
      case TransactionType.ACCOUNT_ADDRESS_RESTRICTION:
      case TransactionType.ACCOUNT_KEY_LINK:
      case TransactionType.VOTING_KEY_LINK:
      case TransactionType.VRF_KEY_LINK:
      case TransactionType.NODE_KEY_LINK:
      case TransactionType.ACCOUNT_METADATA:
      case TransactionType.ACCOUNT_MOSAIC_RESTRICTION:
      case TransactionType.ACCOUNT_OPERATION_RESTRICTION:
      case TransactionType.AGGREGATE_BONDED:
      case TransactionType.AGGREGATE_COMPLETE:
      case TransactionType.MOSAIC_ADDRESS_RESTRICTION:
      case TransactionType.MOSAIC_GLOBAL_RESTRICTION:
      case TransactionType.MOSAIC_METADATA:
      case TransactionType.NAMESPACE_METADATA:
      case TransactionType.SECRET_LOCK:
      case TransactionType.SECRET_PROOF:
        return new ViewUnknownTransaction($store, transaction)
      /// end-region XXX views for transaction types not yet implemented
      case TransactionType.HASH_LOCK:
        return new ViewHashLockTransaction($store, transaction as HashLockTransaction)
      case TransactionType.MULTISIG_ACCOUNT_MODIFICATION:
        return new ViewMultisigAccountModificationTransaction(
          $store,
          transaction as MultisigAccountModificationTransaction,
        )
      case TransactionType.MOSAIC_DEFINITION:
        return new ViewMosaicDefinitionTransaction($store, transaction as MosaicDefinitionTransaction)
      case TransactionType.MOSAIC_SUPPLY_CHANGE:
        return new ViewMosaicSupplyChangeTransaction($store, transaction as MosaicSupplyChangeTransaction)
      case TransactionType.NAMESPACE_REGISTRATION:
        return new ViewNamespaceRegistrationTransaction($store, transaction as NamespaceRegistrationTransaction)
      case TransactionType.TRANSFER:
        return new ViewTransferTransaction($store, transaction as TransferTransaction)
      case TransactionType.MOSAIC_ALIAS:
        return new ViewAliasTransaction($store, transaction as MosaicAliasTransaction)
      case TransactionType.ADDRESS_ALIAS:
        return new ViewAliasTransaction($store, transaction as AddressAliasTransaction)
      default:
        throw new Error(`View not implemented for transaction type '${transaction.type}'`)
    }
  }
}
