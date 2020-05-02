/*
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
import { SimpleObjectStorage } from '@/core/database/backends/SimpleObjectStorage'

const getStorage = () => new SimpleObjectStorage<number>('SomeStorageKey')

describe('database/SimpleObjectStorage.spec ==>', () => {
  describe('constructor() should', () => {
    test('create instance given no data', () => {
      const storage = getStorage()
      expect(storage).toBeDefined()
    })

    test('Get/Set/Delete', () => {
      const storage = getStorage()
      expect(storage.get()).toBeUndefined()
      storage.set(123)
      expect(storage.get()).toBe(123)
      storage.set(456)
      expect(storage.get()).toBe(456)
      storage.remove()
      expect(storage.get()).toBeUndefined()
    })
  })
})
