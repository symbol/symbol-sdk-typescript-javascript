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
import {Deadline, NetworkType, UInt64, NamespaceId, AliasAction, TransactionType, MosaicId, MosaicAliasTransaction} from 'symbol-sdk'
import {createStore} from '@MOCKS/Store'
import {getTestAccount} from '@MOCKS/accounts'
import {getFakeTransaction} from '@MOCKS/Transactions'
import {AliasFormFieldsType, ViewAliasTransaction} from '@/core/transactions/ViewAliasTransaction'

const store = createStore({})

describe('transactions/ViewAliasTransaction', () => {
  describe('use() should', () => {
    test('populate mosaic alias transaction fields', () => {
      // prepare
      const view = new ViewAliasTransaction(store)
      const alias = getFakeTransaction(TransactionType.MOSAIC_ALIAS, {
        deadline: Deadline.create(),
        networkType: NetworkType.TEST_NET,
        namespaceId: new NamespaceId('symbol.xym'),
        aliasAction: AliasAction.Link,
        mosaicId: new MosaicId('747B276C30626442'),
      }) as MosaicAliasTransaction

      // act
      view.use(alias)

      // assert
      expect(view).toBeDefined()
      expect(view.transaction).toBeDefined()
      expect(view.values.has('namespaceId')).toBe(true)
      expect(view.values.has('aliasTarget')).toBe(true)
      expect(view.values.has('aliasAction')).toBe(true)
    })

    // XXX test recognition of Namespace vs Address for recipient
    // XXX test recognition of Namespace vs MosaicId for mosaics
  })

  describe('parse() should', () => {
    test('populate mosaic alias transaction fields', () => {
      // prepare
      const symbol = new NamespaceId('symbol.xym')
      const view = new ViewAliasTransaction(store)
      const formItems: AliasFormFieldsType = {
        namespaceId: symbol,
        aliasTarget: getTestAccount('cosigner1').address,
        aliasAction: AliasAction.Unlink,
        maxFee: UInt64.fromUint(0),
      }

      // act
      view.parse(formItems)

      // assert
      expect(view.values).toBeDefined()
      expect(view.values.has('namespaceId')).toBe(true)
      expect(view.values.has('aliasTarget')).toBe(true)
      expect(view.values.has('aliasAction')).toBe(true)
      expect(view.values.get('namespaceId').toHex()).toBe(symbol.toHex())
      expect(view.values.get('aliasTarget').plain()).toBe(getTestAccount('cosigner1').address.plain())
      expect(view.values.get('aliasAction')).toBe(AliasAction.Unlink)
    })
  })
})
