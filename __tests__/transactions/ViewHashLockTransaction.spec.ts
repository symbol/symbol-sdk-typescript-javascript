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
import {Deadline, NetworkType, UInt64, TransactionType, MosaicId, HashLockTransaction, Mosaic} from 'symbol-sdk'
import {createStore} from '@MOCKS/Store'
import {getTestAccount} from '@MOCKS/accounts'
import {getFakeTransaction} from '@MOCKS/Transactions'
import {HashLockTransactionFormFieldsType, ViewHashLockTransaction} from '@/core/transactions/ViewHashLockTransaction'

const store = createStore({})
const aggregate = getFakeTransaction(TransactionType.AGGREGATE_BONDED, {})
const signedAggregate = getTestAccount('cosigner1').sign(aggregate, '')

describe('transactions/ViewHashLockTransaction', () => {
  describe('use() should', () => {
    test('populate hash lock transaction fields', () => {
      // prepare
      const view = new ViewHashLockTransaction(store)
      const hashLock = getFakeTransaction(TransactionType.HASH_LOCK, {
        deadline: Deadline.create(),
        networkType: NetworkType.TEST_NET,
        mosaic: new Mosaic(new MosaicId('747B276C30626442'), UInt64.fromUint(100)),
        duration: UInt64.fromUint(1000),
        parent: signedAggregate,
      }) as HashLockTransaction

      // act
      view.use(hashLock)

      // assert
      expect(view).toBeDefined()
      expect(view.transaction).toBeDefined()
      expect(view.values.has('mosaic')).toBe(true)
      expect(view.values.has('duration')).toBe(true)
      expect(view.values.has('signedTransaction')).toBe(true)
    })
  })

  describe('parse() should', () => {
    test('populate hash lock transaction fields', () => {
      // prepare
      const symbol = '747B276C30626442'
      const view = new ViewHashLockTransaction(store)
      const formItems: HashLockTransactionFormFieldsType = {
        mosaic: {mosaicHex: symbol, amount: 1},
        duration: 100,
        signedTransaction: signedAggregate,
        maxFee: 0,
      }

      // act
      view.parse(formItems)

      // assert
      expect(view.values).toBeDefined()
      expect(view.values.has('mosaic')).toBe(true)
      expect(view.values.has('duration')).toBe(true)
      expect(view.values.has('signedTransaction')).toBe(true)
      expect(view.values.get('mosaic').id.toHex()).toBe(symbol)
      expect(view.values.get('duration')).toBe(100)
      expect(view.values.get('signedTransaction').hash).toBe(signedAggregate.hash)
    })
  })
})
