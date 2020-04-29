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
import {NetworkBasedObjectStorage} from '@/core/database/backends/NetworkBasedObjectStorage'
import {SimpleObjectStorage} from '@/core/database/backends/SimpleObjectStorage'

const getStorage = () => new NetworkBasedObjectStorage<number>(new SimpleObjectStorage('SomeStorageKey'))

describe('database/NetworkBasedObjectStorage.spec ==>', () => {
  describe('constructor() should', () => {
    test('create instance given no data', () => {
      const storage = getStorage()
      expect(storage).toBeDefined()
    })

    test('Get/Set/Delete same generation hash', () => {
      const storage = getStorage()
      const generationHash = 'abc'
      expect(storage.get(generationHash)).toBeUndefined()
      storage.set(generationHash, 123)
      expect(storage.get(generationHash)).toBe(123)
      storage.set(generationHash, 456)
      expect(storage.get(generationHash)).toBe(456)
      storage.remove(generationHash)
      storage.remove(generationHash)
      storage.remove(generationHash)
      expect(storage.get(generationHash)).toBeUndefined()
    })
  })

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) )
  }

  test('Get/Set/Delete same generation hash different generation hash', async () => {
    const storage = getStorage()
    const generationHash1 = 'abc1'
    const generationHash2 = 'abc2'
    expect(storage.get(generationHash1)).toBeUndefined()
    expect(storage.get(generationHash2)).toBeUndefined()
    storage.set(generationHash1, 123)
    await delay(1)
    expect(storage.getLatest()).toBe(123)
    expect(storage.get(generationHash1)).toBe(123)
    storage.set(generationHash2, 345)

    await delay(1)
    expect(storage.getLatest()).toBe(345)

    expect(storage.get(generationHash2)).toBe(345)
    expect(storage.get(generationHash1)).toBe(123)
    storage.set(generationHash1, 456)
    await delay(1)
    expect(storage.getLatest()).toBe(456)
    expect(storage.get(generationHash1)).toBe(456)
    storage.remove(generationHash1)
    storage.remove(generationHash1)
    storage.remove(generationHash1)
    expect(storage.get(generationHash1)).toBeUndefined()

    storage.set(generationHash2, 456)
    await delay(1)
    expect(storage.get(generationHash2)).toBe(456)
    storage.remove(generationHash2)
    storage.remove(generationHash2)
    storage.remove(generationHash2)
    expect(storage.get(generationHash2)).toBeUndefined()

  })
})
