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
import { PublicAccount, MultisigAccountModificationTransaction, UInt64, Address } from 'symbol-sdk'

// internal dependencies
import { TransactionView } from './TransactionView'
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem'
import i18n from '@/language'
/// region custom types
export interface CosignatoryModification {
  addOrRemove: 'add' | 'remove'
  cosignatory: PublicAccount
}

export type CosignatoryModifications = {
  [publicKey: string]: CosignatoryModification
}

export type MultisigAccountModificationFormFieldsType = {
  signerPublicKey: string
  minApprovalDelta: number
  minRemovalDelta: number
  cosignatoryModifications: CosignatoryModifications
  maxFee: number
}
/// end-region custom types

// eslint-disable-next-line max-len
export class ViewMultisigAccountModificationTransaction extends TransactionView<
  MultisigAccountModificationFormFieldsType
> {
  /**
   * Fields that are specific to transfer transactions
   * @var {string[]}
   */
  protected readonly fields: string[] = [
    'minApprovalDelta',
    'minRemovalDelta',
    'publicKeyAdditions',
    'publicKeyDeletions',
    'maxFee',
  ]

  /**
   * Parse form items and return a ViewMultisigAccountModificationTransaction
   * @param {MultisigAccountModificationFormFieldsType} formItems
   * @return {ViewMultisigAccountModificationTransaction}
   */
  public parse(formItems: MultisigAccountModificationFormFieldsType): ViewMultisigAccountModificationTransaction {
    // set approval and removal deltas
    this.values.set('minApprovalDelta', formItems.minApprovalDelta)
    this.values.set('minRemovalDelta', formItems.minRemovalDelta)

    // get public keys additions and deletions
    const publicKeyAdditions = Object.values(formItems.cosignatoryModifications)
      .filter(({ addOrRemove }) => addOrRemove === 'add')
      .map(({ cosignatory }) => cosignatory)

    const publicKeyDeletions = Object.values(formItems.cosignatoryModifications)
      .filter(({ addOrRemove }) => addOrRemove === 'remove')
      .map(({ cosignatory }) => cosignatory)

    // set public keys additions and deletions
    this.values.set('publicKeyAdditions', publicKeyAdditions)
    this.values.set('publicKeyDeletions', publicKeyDeletions)

    // - set fee and return
    this.values.set('maxFee', UInt64.fromUint(formItems.maxFee))
    return this
  }

  /**
   * Use a transaction object and return a ViewTransferTransaction
   * @param {ViewMultisigAccountModificationTransaction} transaction
   * @returns {ViewMultisigAccountModificationTransaction}
   */
  public use(transaction: MultisigAccountModificationTransaction): ViewMultisigAccountModificationTransaction {
    // - set transaction
    this.transaction = transaction

    // - populate common values
    this.initialize(transaction)

    // set approval and removal deltas
    this.values.set('minApprovalDelta', transaction.minApprovalDelta)
    this.values.set('minRemovalDelta', transaction.minRemovalDelta)

    // set public keys additions and deletions
    this.values.set('publicKeyAdditions', transaction.publicKeyAdditions)
    this.values.set('publicKeyDeletions', transaction.publicKeyDeletions)

    return this
  }

  public resolveDetailItems(): TransactionDetailItem[] {
    // get data from view values
    const networkType = this.$store.getters['network/networkType']
    const minApprovalDelta: number = this.values.get('minApprovalDelta')
    const minRemovalDelta: number = this.values.get('minRemovalDelta')
    const publicKeyAdditions: PublicAccount[] = this.values.get('publicKeyAdditions')
    const publicKeyDeletions: PublicAccount[] = this.values.get('publicKeyDeletions')

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

    // push rendered public key additions and deletions to the view items
    if (additions.length) items.push(...additions)
    if (deletions.length) items.push(...deletions)

    return items
  }
}
