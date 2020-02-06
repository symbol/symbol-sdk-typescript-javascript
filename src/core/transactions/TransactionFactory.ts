/**
 * 
 * Copyright 2020 Grégory Saive for NEM (https://nem.io)
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
  Deadline,
  UInt64,
} from 'nem2-sdk'

// internal dependencies
import {TransactionParams} from '@/core/transactions/TransactionParams'
import {TransferTransactionParams} from '@/core/transactions/TransferTransactionParams'

export type TransactionImpl = Transaction

export class TransactionFactory {

  constructor(
    /**
     * Vuex Store instance
     * @var {Vuex.Store}
     */
    public readonly $store: Store<any>,) {}

  /// region specialised signatures
  public build(name: 'TransferTransaction', params: TransferTransactionParams): TransferTransaction
  /// end-region specialised signatures

  /**
   * Create a REST repository instance around \a serviceOpts
   * @param {string} name
   * @param {string} nodeUrl 
   */
  public build(
    name: string,
    params: TransactionParams
  ): TransactionImpl {

    const deadline = Deadline.create()
    const networkType = this.$store.getters['network/networkType']

    switch (name) {
      case 'TransferTransaction': 
        return TransferTransaction.create(
          deadline,
          params.getParam('recipient'),
          params.getParam('mosaics'),
          params.getParam('message'),
          networkType,
          params.getParam('maxFee'),
        );


      default: break
    }

    throw new Error('Could not find a REST repository by name \'' + name + ' \'')
  }
}
