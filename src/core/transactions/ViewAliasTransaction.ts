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
  Address,
  AddressAliasTransaction,
  AliasAction,
  MosaicAliasTransaction,
  MosaicId,
  NamespaceId,
} from 'symbol-sdk'
// internal dependencies
import { TransactionView } from './TransactionView'
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem'

/// end-region custom types

export class ViewAliasTransaction extends TransactionView<MosaicAliasTransaction | AddressAliasTransaction> {
  /**
   * Displayed items
   */
  protected resolveDetailItems(): TransactionDetailItem[] {
    const transaction = this.transaction
    const namespaceId: NamespaceId = transaction.namespaceId
    let aliasTarget: Address | MosaicId
    if (transaction instanceof AddressAliasTransaction) {
      aliasTarget = transaction.address
    }
    if (transaction instanceof MosaicAliasTransaction) {
      aliasTarget = transaction.namespaceId
    }
    const displayName = namespaceId.fullName ? `${namespaceId.fullName} (${namespaceId.toHex()})` : namespaceId.toHex()
    const targetKey = aliasTarget instanceof Address ? 'address' : 'mosaic'
    const targetValue = aliasTarget instanceof Address ? aliasTarget.pretty() : aliasTarget.toHex()
    const aliasAction = this.transaction.aliasAction
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
