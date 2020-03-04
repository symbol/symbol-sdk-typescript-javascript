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
// external dependencies
import {PublicAccount, MultisigAccountModificationTransaction, UInt64} from 'symbol-sdk'

// internal dependencies
import {TransactionView} from './TransactionView'

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
export class ViewMultisigAccountModificationTransaction extends TransactionView<MultisigAccountModificationFormFieldsType> {
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
    // - instantiate new transaction view
    const view = new ViewMultisigAccountModificationTransaction(this.$store)

    // set approval and removal deltas
    view.values.set('minApprovalDelta', formItems.minApprovalDelta)
    view.values.set('minRemovalDelta', formItems.minRemovalDelta)

    // get public keys additions and deletions
    const publicKeyAdditions = Object
      .values(formItems.cosignatoryModifications)
      .filter(({addOrRemove}) => addOrRemove === 'add')
      .map(({cosignatory}) => cosignatory)

    const publicKeyDeletions = Object
      .values(formItems.cosignatoryModifications)
      .filter(({addOrRemove}) => addOrRemove === 'remove')
      .map(({cosignatory}) => cosignatory)


    // set public keys additions and deletions
    view.values.set('publicKeyAdditions', publicKeyAdditions)
    view.values.set('publicKeyDeletions', publicKeyDeletions)

    // - set fee and return
    view.values.set('maxFee', UInt64.fromUint(formItems.maxFee))
    return view
  }

  /**
   * Use a transaction object and return a ViewTransferTransaction
   * @param {ViewMultisigAccountModificationTransaction} transaction
   * @returns {ViewMultisigAccountModificationTransaction}
   */
  public use(transaction: MultisigAccountModificationTransaction): ViewMultisigAccountModificationTransaction {
    // - instantiate new transaction view
    const view = new ViewMultisigAccountModificationTransaction(this.$store)

    // - set transaction
    view.transaction = transaction

    // - populate common values
    view.initialize(transaction)

    // set approval and removal deltas
    view.values.set('minApprovalDelta', transaction.minApprovalDelta)
    view.values.set('minRemovalDelta', transaction.minRemovalDelta)

    // set public keys additions and deletions
    view.values.set('publicKeyAdditions', transaction.publicKeyAdditions)
    view.values.set('publicKeyDeletions', transaction.publicKeyDeletions)

    return view
  }
}
