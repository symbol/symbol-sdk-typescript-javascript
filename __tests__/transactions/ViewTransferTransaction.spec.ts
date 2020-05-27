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
import { Account, Deadline, NamespaceId, NetworkType, PlainMessage, TransferTransaction } from 'symbol-sdk'
import { createStore } from '@MOCKS/Store'
import { ViewTransferTransaction } from '@/core/transactions/ViewTransferTransaction'

const store = createStore({})

describe('transactions/ViewTransferTransaction', () => {
  describe('use() should', () => {
    test('populate transfer transaction fields', () => {
      // prepare
      const alias = new NamespaceId('test')

      const transferTransaction = TransferTransaction.create(
        Deadline.create(),
        alias,
        [],
        PlainMessage.create('test-message'),
        NetworkType.MIJIN_TEST,
      )

      store.getters['account/currentSignerAddress'] = Account.generateNewAccount(NetworkType.MAIN_NET).address

      // act
      const view = new ViewTransferTransaction(store, transferTransaction)

      // assert
      expect(view).toBeDefined()
      expect(view.transaction).toBeDefined()

      expect(view.detailItems.length).toBe(3)
    })
  })
})
