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
// external dependencies
import { Address, MultisigAccountModificationTransaction, NetworkType } from 'symbol-sdk'
// internal dependencies
import { TransactionView } from './TransactionView'
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem'
import i18n from '@/language'

// eslint-disable-next-line max-len
export class ViewMultisigAccountModificationTransaction extends TransactionView<
  MultisigAccountModificationTransaction
> {
  protected resolveDetailItems(): TransactionDetailItem[] {
    // get data from view values
    const networkType: NetworkType = this.$store.getters['network/networkType']
    const minApprovalDelta = this.transaction.minApprovalDelta
    const minRemovalDelta = this.transaction.minRemovalDelta
    const publicKeyAdditions = this.transaction.publicKeyAdditions
    const publicKeyDeletions = this.transaction.publicKeyDeletions

    // push approval and removal deltas to view items
    const items = [
      { key: 'minApprovalDelta', value: `${minApprovalDelta}` },
      { key: 'minRemovalDelta', value: `${minRemovalDelta}` },
    ]

    // render views for public key additions and deletions
    const additions = publicKeyAdditions.map(({ publicKey }, index, self) => {
      return {
        key: `${i18n.t('public_key_addition')} (${index + 1}/${self.length})`,
        value: Address.createFromPublicKey(publicKey, networkType).pretty(),
      }
    })

    const deletions = publicKeyDeletions.map(({ publicKey }, index, self) => {
      return {
        key: `${i18n.t('public_key_deletion')} (${index + 1}/${self.length})`,
        value: Address.createFromPublicKey(publicKey, networkType).pretty(),
      }
    })

    return [...items, ...additions, ...deletions]
  }
}
