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
import {MosaicId, UInt64, MosaicDefinitionTransaction, MosaicFlags, MosaicNonce} from 'nem2-sdk'

// internal dependencies
import {TransactionView} from './TransactionView'

/// region custom types
export type MosaicDefinitionFormFieldsType = {
  nonce: MosaicNonce,
  mosaicId: MosaicId,
  mosaicFlags: MosaicFlags,
  divisibility: number,
  permanent: boolean,
  duration: number,
  maxFee: UInt64,
}
/// end-region custom types

export class ViewMosaicDefinitionTransaction extends TransactionView<MosaicDefinitionFormFieldsType> {
  /**
   * Fields that are specific to mosaic definition transactions
   * @var {string[]}
   */
  protected readonly fields: string[] = [
    'nonce',
    'mosaicId',
    'mosaicFlags',
    'divisibility',
    'duration',
  ]

  /**
   * Parse form items and return a ViewMosaicDefinitionTransaction
   * @param {MosaicDefinitionFormFieldsType} formItems
   * @return {ViewMosaicDefinitionTransaction}
   */
  public parse(formItems: MosaicDefinitionFormFieldsType): ViewMosaicDefinitionTransaction {
    // - instantiate new transaction view
    const view = new ViewMosaicDefinitionTransaction(this.$store)

    // - parse form items to view values
    view.values.set('nonce', formItems.nonce)
    view.values.set('mosaicId', formItems.mosaicId)
    view.values.set('mosaicFlags', formItems.mosaicFlags)
    view.values.set('divisibility', formItems.divisibility)
    view.values.set('duration', formItems.permanent ? undefined : UInt64.fromUint(formItems.duration))

    // - set fee and return
    view.values.set('maxFee', formItems.maxFee)
    return view
  }

  /**
   * Use a transaction object and return a ViewMosaicDefinitionTransaction
   * @param {MosaicDefinitionTransaction} transaction
   * @return {ViewMosaicDefinitionTransaction}
   */
  public use(transaction: MosaicDefinitionTransaction): ViewMosaicDefinitionTransaction {
    // - instantiate new transaction view
    const view = new ViewMosaicDefinitionTransaction(this.$store)

    // - set transaction
    view.transaction = transaction

    // - populate common values
    view.initialize(transaction)

    // - read transaction fields
    view.values.set('nonce', transaction.nonce)
    view.values.set('mosaicId', transaction.mosaicId)
    view.values.set('mosaicFlags', transaction.flags)
    view.values.set('divisibility', transaction.divisibility)

    // - set duration if applying
    const isPermanent = 0 === transaction.duration.compact()
    view.values.set('duration', isPermanent ? undefined : transaction.duration)
    return view
  }
}
