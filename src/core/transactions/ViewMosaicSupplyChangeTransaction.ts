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
import {MosaicId, UInt64, MosaicSupplyChangeAction, MosaicSupplyChangeTransaction} from 'symbol-sdk'

// internal dependencies
import {TransactionView} from './TransactionView'

/// region custom types
export type MosaicSupplyChangeFormFieldsType = {
  mosaicId: MosaicId
  action: MosaicSupplyChangeAction
  delta: UInt64
  maxFee: UInt64
}
/// end-region custom types

export class ViewMosaicSupplyChangeTransaction extends TransactionView<MosaicSupplyChangeFormFieldsType> {
  /**
   * Fields that are specific to transfer transactions
   * @var {string[]}
   */
  protected readonly fields: string[] = [
    'mosaicId',
    'MosaicSupplyChangeAction',
    'delta',
  ]

  /**
   * Parse form items and return a ViewMosaicSupplyChangeTransaction
   * @param {MosaicSupplyChangeFormFieldsType} formItems
   * @return {ViewMosaicSupplyChangeTransaction}
   */
  public parse(formItems: MosaicSupplyChangeFormFieldsType): ViewMosaicSupplyChangeTransaction {
    // - parse form items to view values
    this.values.set('mosaicId', formItems.mosaicId)
    this.values.set('action', formItems.action)
    this.values.set('delta', formItems.delta)

    // - set fee and return
    this.values.set('maxFee', formItems.maxFee)
    return this
  }

  /**
   * Use a transaction object and return a ViewMosaicSupplyChangeTransaction
   * @param {MosaicSupplyChangeTransaction} transaction
   * @return {ViewMosaicSupplyChangeTransaction}
   */
  public use(transaction: MosaicSupplyChangeTransaction): ViewMosaicSupplyChangeTransaction {
    // - set transaction
    this.transaction = transaction

    // - populate common values
    this.initialize(transaction)

    // - read transaction fields
    this.values.set('mosaicId', transaction.mosaicId)
    this.values.set('action', transaction.action)
    this.values.set('delta', transaction.delta)
    return this
  }
}
