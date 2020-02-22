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
import {
  MosaicId, UInt64, AddressAliasTransaction,
  MosaicAliasTransaction, Address, AliasAction, NamespaceId,
} from 'nem2-sdk'

// internal dependencies
import {TransactionView} from './TransactionView'

/// region custom types
export type AliasFormFieldsType = {
  namespaceId: NamespaceId
  aliasTarget: MosaicId | Address
  aliasAction: AliasAction
  maxFee: UInt64
}
/// end-region custom types

export class ViewAliasTransaction extends TransactionView<AliasFormFieldsType> {
  /**
   * Fields that are specific to alias transactions
   * @var {string[]}
   */
  protected readonly fields: string[] = [
    'namespaceId',
    'aliasTarget',
    'aliasAction',
  ]

  /**
   * Parse form items and return a ViewAliasTransaction
   * @param {AliasFormFieldsType} formItems
   * @return {ViewAliasTransaction}
   */
  public parse(formItems: AliasFormFieldsType): ViewAliasTransaction {
    // - instantiate new transaction view
    const view = new ViewAliasTransaction(this.$store)

    // - parse form items to view values
    view.values.set('namespaceId', formItems.namespaceId)
    view.values.set('aliasTarget', formItems.aliasTarget)
    view.values.set('aliasAction', formItems.aliasAction)

    // - set fee and return
    view.values.set('maxFee', formItems.maxFee)
    return view
  }

  /**
   * Use a transaction object and return a ViewAliasTransaction
   * @param {AliasTransaction} transaction
   * @return {ViewAliasTransaction}
   */
  public use(transaction: MosaicAliasTransaction | AddressAliasTransaction): ViewAliasTransaction {
    // - instantiate new transaction view
    const view = new ViewAliasTransaction(this.$store)

    // - set transaction
    view.transaction = transaction

    // - populate common values
    view.initialize(transaction)

    if (transaction instanceof AddressAliasTransaction) {
      // - read transaction fields if transaction is an address alias transaction
      view.values.set('namespaceId', transaction.namespaceId)
      view.values.set('aliasTarget', transaction.address)
      view.values.set('aliasAction', transaction.aliasAction)
    }

    if (transaction instanceof MosaicAliasTransaction) {
      // - read transaction fields if transaction is a mosaic alias transaction
      view.values.set('namespaceId', transaction.namespaceId)
      view.values.set('aliasTarget', transaction.mosaicId)
      view.values.set('aliasAction', transaction.aliasAction)
    }

    return view
  }
}
