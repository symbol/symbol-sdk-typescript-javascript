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
import {
  Transaction,
  TransferTransaction,
  UInt64,
  Deadline,
  EmptyMessage,
  NetworkType,
  TransactionType,
  MosaicAliasTransaction,
  AliasAction,
  NamespaceId,
  MosaicId,
  Mosaic,
  HashLockTransaction,
  LockFundsTransaction,
  AggregateTransaction,
} from 'symbol-sdk'
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
    // - set fee and return
    this.values.set('maxFee', formItems.maxFee)
    return this
  }

  /**
   * Use a transaction object and return a FakeTransactionView
   * @param {Transaction} transaction
   * @return {FakeTransactionView}
   */
  public use(transaction: Transaction): FakeTransactionView {
    // - set transaction
    this.transaction = transaction

    // - populate common values
    this.initialize(transaction)
    return this
  }
}
/// end-region mocks

/// region helpers
/**
 * Mock transfer transaction
 * @return {Transaction}
 */
export const getFakeTransaction = (type: number, data: any = undefined): Transaction => {
  switch(type) {
    default:
    case TransactionType.AGGREGATE_BONDED: return getFakeAggregateBondedTransaction(data)
    case TransactionType.MOSAIC_ALIAS: return getFakeMosaicAliasTransaction(data)
    case TransactionType.HASH_LOCK: return getFakeHashLockTransaction(data)
    case TransactionType.TRANSFER: return getFakeTransferTransaction(data)
  }
}

export const getFakeAggregateBondedTransaction = (data: any = undefined): AggregateTransaction => {
  return AggregateTransaction.createBonded(
    data && data.deadline ? data.deadline : Deadline.create(),
    data && data.transactions ? data.transactions : [],
    data && data.networkType ? data.networkType : NetworkType.TEST_NET,
    data && data.cosignatures ? data.cosignatures : [],
    data && data.hasOwnProperty('maxFee') ? data.maxFee : UInt64.fromUint(1234)
  )
}

export const getFakeHashLockTransaction = (data: any = undefined): HashLockTransaction => {
  return LockFundsTransaction.create(
    data && data.deadline ? data.deadline : Deadline.create(),
    data && data.mosaic ? data.mosaic : new Mosaic(new NamespaceId('symbol.xym'), UInt64.fromUint(100)),
    data && data.duration ? data.duration : UInt64.fromUint(1000),
    data && data.parent ? data.parent : null,
    data && data.networkType ? data.networkType : NetworkType.TEST_NET,
    data && data.hasOwnProperty('maxFee') ? data.maxFee : UInt64.fromUint(1234)
  )
}

export const getFakeMosaicAliasTransaction = (data: any = undefined): MosaicAliasTransaction => {
  return MosaicAliasTransaction.create(
    data && data.deadline ? data.deadline : Deadline.create(),
    data && data.aliasAction ? data.aliasAction : AliasAction.Link,
    data && data.namespaceId ? data.namespaceId : new NamespaceId('symbol.xym'),
    data && data.mosaicId ? data.mosaicId : new MosaicId('747B276C30626442'),
    data && data.networkType ? data.networkType : NetworkType.TEST_NET,
    data && data.hasOwnProperty('maxFee') ? data.maxFee : UInt64.fromUint(1234)
  )
}

export const getFakeTransferTransaction = (data: any = undefined): TransferTransaction => {
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
