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
import DatabaseStore from '@/store/Database'

describe('store/Database', () => {
  describe('action "SYNCHRONIZE" should', () => {
    test('mutate hasFeed and dataFeed', () => {
      // prepare
      const commit = jest.fn()

      // act
      DatabaseStore.actions.SYNCHRONIZE({commit})

      // assert
      expect(commit).toHaveBeenCalledTimes(2)
      expect(commit).toHaveBeenNthCalledWith(1, 'setHasFeed', false) // no accounts = no feed
      expect(commit).toHaveBeenNthCalledWith(2, 'setFeed', {
        'accounts': [],
        'endpoints': [],
        'mosaics': [],
        'namespaces': [],
        'settings': [],
        'wallets': [],
      })
    })
  })
})
