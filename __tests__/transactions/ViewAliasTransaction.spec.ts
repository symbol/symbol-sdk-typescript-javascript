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
import { AliasAction, Deadline, MosaicAliasTransaction, MosaicId, NamespaceId, NetworkType } from 'symbol-sdk'
import { createStore } from '@MOCKS/Store'
import { ViewAliasTransaction } from '@/core/transactions/ViewAliasTransaction'

const store = createStore({})

describe('transactions/ViewAliasTransaction', () => {
  describe('use() should', () => {
    test('populate mosaic alias transaction fields', () => {
      const namespaceId = new NamespaceId('alias')
      const mosaicId = new MosaicId('747B276C30626442')
      const alias = MosaicAliasTransaction.create(
        Deadline.create(),
        AliasAction.Link,
        namespaceId,
        mosaicId,
        NetworkType.MIJIN_TEST,
      )

      const view = new ViewAliasTransaction(store, alias)

      // assert
      expect(view).toBeDefined()
      expect(view.transaction).toBeDefined()
      expect(view.detailItems.length).toBe(3)
    })

    // XXX test recognition of Namespace vs Address for recipient
    // XXX test recognition of Namespace vs MosaicId for mosaics
  })
})
