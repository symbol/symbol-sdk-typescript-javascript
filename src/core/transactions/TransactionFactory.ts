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
  NamespaceRegistrationType,
} from 'nem2-sdk'

// internal dependencies
import {TransactionParams} from '@/core/transactions/TransactionParams'
import {TransferTransactionParams} from '@/core/transactions/TransferTransactionParams'
import {MosaicDefinitionTransactionParams} from './MosaicDefinitionTransactionParams'
import {MosaicSupplyChangeTransactionParams} from './MosaicSupplyChangeTransactionParams'
import {NamespaceRegistrationTransactionParams} from './NamespaceRegistrationTransactionParams'

export type TransactionImpl = Transaction

export class TransactionFactory {

  constructor(
    /**
     * Vuex Store instance
     * @var {Vuex.Store}
     */
    public readonly $store: Store<any>) {}

  /// region specialised signatures
  public build(name: 'TransferTransaction', params: TransferTransactionParams): TransferTransaction
  public build(name: 'MosaicDefinitionTransaction', params: MosaicDefinitionTransactionParams): MosaicDefinitionTransaction
  public build(name: 'MosaicSupplyChangeTransaction', params: MosaicSupplyChangeTransactionParams): MosaicSupplyChangeTransaction
  public build(name: 'NamespaceRegistrationTransaction', params: NamespaceRegistrationTransactionParams): NamespaceRegistrationTransaction
  /// end-region specialised signatures

  /**
   * Create a REST repository instance around \a serviceOpts
   * @param {string} name
   * @param {string} nodeUrl 
   */
  public build(
    name: string,
    params: TransactionParams,
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
        )

      case 'MosaicDefinitionTransaction': 
        return MosaicDefinitionTransaction.create(
          deadline,
          params.getParam('nonce'),
          params.getParam('mosaicId'),
          params.getParam('mosaicFlags'),
          params.getParam('divisibility'),
          params.getParam('duration'),
          networkType,
          params.getParam('maxFee'),
        )
      
      case 'MosaicSupplyChangeTransaction': 
        return MosaicSupplyChangeTransaction.create(
          deadline,
          params.getParam('Id'),
          params.getParam('mosaicSupplyChangeAction'),
          params.getParam('supply'),
          networkType,
          params.getParam('maxFee'),
        )

      case 'NamespaceRegistrationTransaction':
        switch (params.getParam('namespaceRegistrationType')) {
          case NamespaceRegistrationType.SubNamespace:
            return NamespaceRegistrationTransaction.createSubNamespace(
              deadline,
              params.getParam('subNamespaceName'),
              params.getParam('rootNamespaceName'),
              networkType,
              params.getParam('maxFee'),
            )

          case NamespaceRegistrationType.RootNamespace:
          default: 
            return NamespaceRegistrationTransaction.createRootNamespace(
              deadline,
              params.getParam('rootNamespaceName'),
              params.getParam('duration'),
              networkType,
              params.getParam('maxFee'),
            )
        }


      default: break
    }
    
    throw new Error(`Could not find a REST repository by name '${name}'`)
  }
}
