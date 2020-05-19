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
  MosaicId,
  UInt64,
  AddressAliasTransaction,
  MosaicAliasTransaction,
  Address,
  AliasAction,
  NamespaceId,
} from 'symbol-sdk'

// internal dependencies
import { TransactionView } from './TransactionView'
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem'

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
  protected readonly fields: string[] = ['namespaceId', 'aliasTarget', 'aliasAction']

  /**
   * Parse form items and return a ViewAliasTransaction
   * @param {AliasFormFieldsType} formItems
   * @return {ViewAliasTransaction}
   */
  public parse(formItems: AliasFormFieldsType): ViewAliasTransaction {
    // - parse form items to view values
    this.values.set('namespaceId', formItems.namespaceId)
    this.values.set('aliasTarget', formItems.aliasTarget)
    this.values.set('aliasAction', formItems.aliasAction)

    // - set fee and return
    this.values.set('maxFee', formItems.maxFee)
    return this
  }

  /**
   * Use a transaction object and return a ViewAliasTransaction
   * @param {AliasTransaction} transaction
   * @return {ViewAliasTransaction}
   */
  public use(transaction: MosaicAliasTransaction | AddressAliasTransaction): ViewAliasTransaction {
    // - set transaction
    this.transaction = transaction

    // - populate common values
    this.initialize(transaction)

    if (transaction instanceof AddressAliasTransaction) {
      // - read transaction fields if transaction is an address alias transaction
      this.values.set('namespaceId', transaction.namespaceId)
      this.values.set('aliasTarget', transaction.address)
      this.values.set('aliasAction', transaction.aliasAction)
    }

    if (transaction instanceof MosaicAliasTransaction) {
      // - read transaction fields if transaction is a mosaic alias transaction
      this.values.set('namespaceId', transaction.namespaceId)
      this.values.set('aliasTarget', transaction.mosaicId)
      this.values.set('aliasAction', transaction.aliasAction)
    }

    return this
  }

  /**
   * Displayed items
   */
  public resolveDetailItems(): TransactionDetailItem[] {
    const namespaceId: NamespaceId = this.values.get('namespaceId')
    const displayName = namespaceId.fullName ? `${namespaceId.fullName} (${namespaceId.toHex()})` : namespaceId.toHex()
    const aliasTarget: Address | MosaicId = this.values.get('aliasTarget')
    const aliasAction: AliasAction = this.values.get('aliasAction')

    const targetKey = aliasTarget instanceof Address ? 'address' : 'mosaic'
    const targetValue = aliasTarget instanceof Address ? aliasTarget.pretty() : aliasTarget.toHex()

    return [
      { key: 'namespace', value: displayName },
      {
        key: 'action',
        value: aliasAction === AliasAction.Link ? 'Link' : 'Unlink',
      },
      { key: targetKey, value: targetValue },
    ]
  }
}
