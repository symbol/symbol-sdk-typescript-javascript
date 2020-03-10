/**
 * Copyright 2020 NEM Foundation (https://nem.io)
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
import {Transaction, TransferTransaction, UInt64, Deadline, EmptyMessage, NetworkType} from 'symbol-sdk'
import {TransactionView} from '@/core/transactions/TransactionView'
import {getTestAccount} from '@MOCKS/accounts'

/// region mocks
export type DummyTransactionFormFields = {
  maxFee: UInt64,
}

export class FakeTransactionView extends TransactionView<DummyTransactionFormFields> {
  /**
   * Fields that are specific to transfer transactions
   * @var {string[]}
   */
  protected readonly fields: string[] = [
    'maxFee',
  ]

  /**
   * Parse form items and return a FakeTransactionView
   * @param {DummyTransactionFormFields} formItems
   * @return {FakeTransactionView}
   */
  public parse(formItems: DummyTransactionFormFields): FakeTransactionView {
    // - instantiate new transaction view
    const view = new FakeTransactionView(this.$store)

    // - set fee and return
    view.values.set('maxFee', formItems.maxFee)
    return view
  }

  /**
   * Use a transaction object and return a FakeTransactionView
   * @param {Transaction} transaction
   * @return {FakeTransactionView}
   */
  public use(transaction: Transaction): FakeTransactionView {
    // - instantiate new transaction view
    const view = new FakeTransactionView(this.$store)

    // - set transaction
    view.transaction = transaction

    // - populate common values
    view.initialize(transaction)
    return view
  }
}
/// end-region mocks

/// region helpers
/**
 * Mock transfer transaction
 * @return {Transaction}
 */
export const getFakeTransaction = (data: any = undefined): Transaction => {
  return TransferTransaction.create(
    data && data.deadline ? data.deadline : Deadline.create(),
    data && data.recipient ? data.recipient : getTestAccount('cosigner1').address,
    data && data.mosaics ? data.mosaics : [],
    data && data.message ? data.message : EmptyMessage,
    data && data.networkType ? data.networkType : NetworkType.TEST_NET,
    data && data.hasOwnProperty('maxFee') ? data.maxFee : UInt64.fromUint(1234)
  )
}
/// end-region helpers
