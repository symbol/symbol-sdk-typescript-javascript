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
import {Deadline, NetworkType, TransactionType} from 'symbol-sdk'
import {createStore} from '@MOCKS/Store'
import {FakeTransactionView, getFakeTransaction} from '@MOCKS/Transactions'

const store = createStore({})
const transfer = getFakeTransaction(TransactionType.TRANSFER, {})

describe('transactions/TransactionView', () => {
  describe('constructor() should', () => {
    test('initialize empty values map', () => {
      // prepare + act
      const view = new FakeTransactionView(store)

      // assert
      expect(view).toBeDefined()
      expect(view.values).toBeDefined()
      expect(view.values.size).toBe(0)
    })
  })

  describe('use() should', () => {
    test('set transaction property', () => {
      // prepare
      const view = new FakeTransactionView(store)

      // act
      view.use(transfer)

      // assert
      expect(view).toBeDefined()
      expect(view.transaction).toBeDefined()
    })
  })

  describe('initialize() should', () => {
    test('set common transaction fields', () => {
      // prepare + act
      const view = new FakeTransactionView(store)
      view.use(transfer)

      // assert
      expect(view).toBeDefined()
      expect(view.values).toBeDefined()
      expect(view.values.size).toBe(5)
      expect(view.values.has('signature')).toBe(true)
      expect(view.values.has('networkType')).toBe(true)
      expect(view.values.has('type')).toBe(true)
      expect(view.values.has('deadline')).toBe(true)
      expect(view.values.has('maxFee')).toBe(true)
    })

    test('populate common transaction fields correctly', () => {
      // prepare
      const deadline = Deadline.create()
      const transfer2 = getFakeTransaction(TransactionType.TRANSFER, {
        deadline,
        networkType: NetworkType.TEST_NET,
      })

      // act
      const view = new FakeTransactionView(store)
      view.use(transfer2)

      // assert
      expect(view).toBeDefined()
      expect(view.values).toBeDefined()
      expect(view.values.size).toBe(5)
      expect(view.values.get('signature')).toBe(undefined)
      expect(view.values.get('networkType')).toBe(NetworkType.TEST_NET)
      expect(view.values.get('deadline').value).toBe(deadline.value)
    })
  })
})
