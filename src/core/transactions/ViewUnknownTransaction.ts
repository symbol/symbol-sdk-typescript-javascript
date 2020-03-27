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
import {UInt64, Transaction} from 'symbol-sdk'

// internal dependencies
import {TransactionView} from './TransactionView'

/// region custom types
export type UnknownTransactionFormFields = {
  maxFee: UInt64
}
/// end-region custom types

export class ViewUnknownTransaction extends TransactionView<UnknownTransactionFormFields> {
  /**
   * Fields that are specific to transfer transactions
   * @var {string[]}
   */
  protected readonly fields: string[] = [
    'maxFee',
  ]

  /**
   * Parse form items and return a ViewUnknownTransaction
   * @param {UnknownTransactionFormFields} formItems
   * @return {ViewUnknownTransaction}
   */
  public parse(formItems: UnknownTransactionFormFields): ViewUnknownTransaction {
    // - set fee and return
    this.values.set('maxFee', formItems.maxFee)
    return this
  }

  /**
   * Use a transaction object and return a ViewUnknownTransaction
   * @param {Transaction} transaction
   * @return {ViewUnknownTransaction}
   */
  public use(transaction: Transaction): ViewUnknownTransaction {
    // - set transaction
    this.transaction = transaction

    // - populate common values
    this.initialize(transaction)
    return this
  }
}
