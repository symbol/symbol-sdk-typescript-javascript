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

import {Migration, VersionedObjectStorage} from '@/core/database/backends/VersionedObjectStorage'

describe('database/SimpleObjectStorage.spec ==>', () => {
  describe('constructor() should', () => {

    test('Get/Set/Delete', () => {
      const storageKey = 'someTable'
      const storage1 = new VersionedObjectStorage<number>(storageKey)
      expect(storage1.get()).toBeUndefined()
      expect(storage1.getVersion()).toBeUndefined()
      storage1.set(123)
      expect(storage1.get()).toBe(123)
      storage1.set(456)
      expect(storage1.getVersion()).toBe(1)
      expect(storage1.get()).toBe(456)
      storage1.remove()
      expect(storage1.get()).toBeUndefined()
      expect(storage1.getVersion()).toBeUndefined()
    })


    test('Get/Set/Delete Migration', () => {
      const storageKey = 'someTable'
      const storage1 = new VersionedObjectStorage<number>(storageKey)
      storage1.set(123)
      expect(storage1.getVersion()).toBe(1)
      expect(storage1.get()).toBe(123)

      const migration1: Migration = {
        description: 'toString',
        migrate(from: any): any {
          return from.toString()
        },
      }

      const migration2: Migration = {
        description: 'add A',
        migrate(from: any): any {
          return from + 'A'
        },
      }

      const migration3: Migration = {
        description: 'add Z',
        migrate(from: any): any {
          return from + 'Z'
        },
      }
      // Migrate to string
      const storage2 = new VersionedObjectStorage<string>(storageKey, [migration1])
      expect(storage2.get()).toBe('123')
      expect(storage2.getVersion()).toBe(2)

      // No Migration
      const storage3 = new VersionedObjectStorage<string>(storageKey, [migration1])
      expect(storage3.get()).toBe('123')
      expect(storage3.getVersion()).toBe(2)

      // Double Migration (append A and append Z)
      const storage4 = new VersionedObjectStorage<string>(storageKey, [ migration1, migration2, migration3 ])
      expect(storage4.get()).toBe('123AZ')
      expect(storage4.getVersion()).toBe(4)
    })
  })


})
