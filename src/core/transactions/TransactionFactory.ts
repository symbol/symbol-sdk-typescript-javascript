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
  Address,
  AddressAliasTransaction,
  AliasTransaction,
  Deadline,
  EmptyMessage,
  MosaicAliasTransaction,
  MosaicDefinitionTransaction,
  MosaicSupplyChangeTransaction,
  MultisigAccountModificationTransaction,
  NamespaceRegistrationTransaction,
  NamespaceRegistrationType,
  Transaction,
  TransferTransaction,
} from 'symbol-sdk'

// internal dependencies
import {ViewAliasTransaction} from './ViewAliasTransaction'
import {ViewMosaicDefinitionTransaction} from './ViewMosaicDefinitionTransaction'
import {ViewMosaicSupplyChangeTransaction} from './ViewMosaicSupplyChangeTransaction'
import {ViewMultisigAccountModificationTransaction} from './ViewMultisigAccountModificationTransaction'
import {ViewNamespaceRegistrationTransaction} from './ViewNamespaceRegistrationTransaction'
import {ViewTransferTransaction} from '@/core/transactions/ViewTransferTransaction'
import {ViewUnknownTransaction} from '@/core/transactions/ViewUnknownTransaction'

/// region custom types
export type TransactionImpl = Transaction
type TransactionViewType = ViewAliasTransaction
| ViewMosaicDefinitionTransaction
| ViewMosaicSupplyChangeTransaction
| ViewMultisigAccountModificationTransaction
| ViewNamespaceRegistrationTransaction
| ViewTransferTransaction
| ViewUnknownTransaction
/// end-region custom types

export class TransactionFactory {

  constructor(
    /**
     * Vuex Store instance
     * @var {Vuex.Store}
     */
    public readonly $store: Store<any>) {}

  /// region specialised signatures
  public build(view: ViewAliasTransaction): AliasTransaction
  public build(view: ViewMosaicDefinitionTransaction): MosaicDefinitionTransaction
  public build(view: ViewMosaicSupplyChangeTransaction): MosaicSupplyChangeTransaction
  public build(view: ViewMultisigAccountModificationTransaction): MultisigAccountModificationTransaction
  public build(view: ViewNamespaceRegistrationTransaction): NamespaceRegistrationTransaction
  public build(view: ViewTransferTransaction): TransferTransaction
  
  /// end-region specialised signatures

  /**
   * Create a REST repository instance around \a serviceOpts
   * @param {string} name
   * @param {string} nodeUrl 
   */
  public build(
    view: TransactionViewType,
  ): TransactionImpl {

    const deadline = Deadline.create()
    const networkType = this.$store.getters['network/networkType']

    if (view instanceof ViewMosaicDefinitionTransaction) {
      return MosaicDefinitionTransaction.create(
        deadline,
        view.values.get('nonce'),
        view.values.get('mosaicId'),
        view.values.get('mosaicFlags'),
        view.values.get('divisibility'),
        view.values.get('duration'),
        networkType,
        view.values.get('maxFee'),
      )
    }
    else if (view instanceof ViewMosaicSupplyChangeTransaction) {
      return MosaicSupplyChangeTransaction.create(
        deadline,
        view.values.get('mosaicId'),
        view.values.get('action'),
        view.values.get('delta'),
        networkType,
        view.values.get('maxFee'),
      )
    }
    else if (view instanceof ViewNamespaceRegistrationTransaction) {
      // - sub namespace
      if (NamespaceRegistrationType.SubNamespace === view.values.get('registrationType')) {
        return NamespaceRegistrationTransaction.createSubNamespace(
          deadline,
          view.values.get('subNamespaceName'),
          view.values.get('rootNamespaceName'),
          networkType,
          view.values.get('maxFee'),
        )
      }
      // - root namespace
      return NamespaceRegistrationTransaction.createRootNamespace(
        deadline,
        view.values.get('rootNamespaceName'),
        view.values.get('duration'),
        networkType,
        view.values.get('maxFee'),
      )
    }
    else if (view instanceof ViewTransferTransaction) {
      return TransferTransaction.create(
        deadline,
        view.values.get('recipient'),
        view.values.get('mosaics'),
        view.values.get('message') || EmptyMessage,
        networkType,
        view.values.get('maxFee'),
      )
    }
    else if (view instanceof ViewMultisigAccountModificationTransaction) {
      return MultisigAccountModificationTransaction.create(
        deadline,
        parseInt(view.values.get('minApprovalDelta'), 10),
        parseInt(view.values.get('minRemovalDelta'), 10),
        view.values.get('publicKeyAdditions'),
        view.values.get('publicKeyDeletions'),
        networkType,
        view.values.get('maxFee'),
      )
    }
    else if (view instanceof ViewAliasTransaction) {
      if (view.values.get('aliasTarget') instanceof Address) {
        return AddressAliasTransaction.create(
          deadline,
          view.values.get('aliasAction'),
          view.values.get('namespaceId'),
          view.values.get('aliasTarget'),
          networkType,
          view.values.get('maxFee'),
        ) as AliasTransaction
      }

      return MosaicAliasTransaction.create(
        deadline,
        view.values.get('aliasAction'),
        view.values.get('namespaceId'),
        view.values.get('aliasTarget'),
        networkType,
        view.values.get('maxFee'),
      )
    }

    throw new Error('Transaction type not yet implemented in TransactionFactory')
  }
}
