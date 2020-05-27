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
import {
  AggregateTransaction,
  Deadline,
  LockFundsTransaction,
  NetworkCurrencyLocal,
  NetworkType,
  UInt64,
} from 'symbol-sdk'
import { createStore } from '@MOCKS/Store'
import { getTestAccount } from '@MOCKS/profiles'
import { ViewHashLockTransaction } from '@/core/transactions/ViewHashLockTransaction'

const store = createStore({})

describe('transactions/ViewHashLockTransaction', () => {
  describe('use() should', () => {
    test('populate hash lock transaction fields', () => {
      const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6'
      const aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(), [], NetworkType.MIJIN_TEST, [])
      const signedTransaction = getTestAccount('cosigner1').sign(aggregateTransaction, generationHash)
      const hashLock = LockFundsTransaction.create(
        Deadline.create(),
        NetworkCurrencyLocal.createRelative(10),
        UInt64.fromUint(10),
        signedTransaction,
        NetworkType.MIJIN_TEST,
      )

      // act
      const view = new ViewHashLockTransaction(store, hashLock)

      // assert
      expect(view).toBeDefined()
      expect(view.transaction).toBeDefined()
      expect(view.detailItems.length).toBe(3)
    })
  })
})
