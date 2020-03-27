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
import {Deadline, NetworkType, PlainMessage, TransferTransaction, UInt64, TransactionType} from 'symbol-sdk'
import {createStore} from '@MOCKS/Store'
import {getTestAccount} from '@MOCKS/accounts'
import {getFakeTransaction} from '@MOCKS/Transactions'
import {TransferFormFieldsType, ViewTransferTransaction} from '@/core/transactions/ViewTransferTransaction'

const store = createStore({})

describe('transactions/ViewTransferTransaction', () => {
  describe('use() should', () => {
    test('populate transfer transaction fields', () => {
      // prepare
      const view = new ViewTransferTransaction(store)
      const transfer2 = getFakeTransaction(TransactionType.TRANSFER, {
        deadline: Deadline.create(),
        networkType: NetworkType.TEST_NET,
        recipient: getTestAccount('cosigner1').address,
        mosaics: [],
        message: PlainMessage.create('ViewTransferTransaction'),
      }) as TransferTransaction

      // act
      view.use(transfer2)

      // assert
      expect(view).toBeDefined()
      expect(view.transaction).toBeDefined()
      expect(view.values.has('recipient')).toBe(true)
      expect(view.values.has('mosaics')).toBe(true)
      expect(view.values.has('message')).toBe(true)
    })

    // XXX test recognition of Namespace vs Address for recipient
    // XXX test recognition of Namespace vs MosaicId for mosaics
  })

  describe('parse() should', () => {
    test('populate transfer transaction fields', () => {
      // prepare
      const view = new ViewTransferTransaction(store)
      const formItems: TransferFormFieldsType = {
        recipient: getTestAccount('cosigner1').address,
        mosaics: [],
        message: 'ViewTransferTransaction',
        maxFee: UInt64.fromUint(0),
      }

      // act
      view.parse(formItems)

      // assert
      expect(view.values).toBeDefined()
      expect(view.values.has('recipient')).toBe(true)
      expect(view.values.has('mosaics')).toBe(true)
      expect(view.values.has('message')).toBe(true)
      expect(view.values.get('recipient').plain()).toBe(getTestAccount('cosigner1').address.plain())
      expect(view.values.get('message').payload).toBe('ViewTransferTransaction')
    })
  })
})
