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
import { Deadline, NamespaceId, NetworkType, PlainMessage, TransferTransaction } from 'symbol-sdk'
import { createStore } from '@MOCKS/Store'
import { ViewUnknownTransaction } from '@/core/transactions/ViewUnknownTransaction'

const store = createStore({})
const transfer = TransferTransaction.create(
  Deadline.create(),
  new NamespaceId('alias'),
  [],
  PlainMessage.create('test-message'),
  NetworkType.MIJIN_TEST,
)

describe('transactions/TransactionView', () => {
  describe('use() should', () => {
    test('set transaction property', () => {
      // prepare
      const view = new ViewUnknownTransaction(store, transfer)

      // assert
      expect(view).toBeDefined()
      expect(view.transaction).toBeDefined()
    })
  })

  describe('initialize() should', () => {
    test('set common transaction fields', () => {
      // prepare + act
      const view = new ViewUnknownTransaction(store, transfer)

      // assert
      expect(view).toBeDefined()
      expect(view.detailItems.length).toBe(0)
      expect(view.headerItems.length).toBe(4)
    })
  })
})
