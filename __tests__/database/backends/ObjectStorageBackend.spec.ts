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
import {ObjectStorageBackend} from '@/core/database/backends/ObjectStorageBackend'

const getBackend = (data?: any) => new ObjectStorageBackend(data)

describe('database/ObjectStorageBackend ==>', () => {
  describe('constructor() should', () => {
    test('create instance given no data', () => {
      const backend = getBackend()
      expect(backend).toBeDefined()
    })

    test('create instances given any data', () => {
      const b1 = getBackend(false)
      const b2 = getBackend([ 1, 2, 3 ])
      const b3 = getBackend({field: 'value'})
      const b4 = getBackend('text')

      expect(b1).toBeDefined()
      expect(b2).toBeDefined()
      expect(b3).toBeDefined()
      expect(b4).toBeDefined()
    })
  })

  describe('length property should', () => {
    test('contain 0 given no data', () => {
      const backend = getBackend()
      expect(backend.length).toBe(0)
    })

    test('contain correct item lengths', () => {
      const b1 = getBackend({item: 'value'})
      const b2 = getBackend({item: 'value', item2: 'value'})
      const b3 = getBackend({item: 'value', item2: 'value', item3: false})
      expect(b1.length).toBe(1)
      expect(b2.length).toBe(2)
      expect(b3.length).toBe(3)
    })
  })

  describe('isAvailable() should', () => {
    test('always return true', () => {
      const backend = getBackend()
      expect(backend.isAvailable()).toBe(true)
    })
  })

  describe('getItem() should', () => {
    test('return null given unknown item name', () => {
      const backend = getBackend()
      expect(backend.getItem('unknown')).toBe(null)
    })

    test('return value given known item names', () => {
      const backend = getBackend({
        boolField: true,
        numberField: 1,
        stringField: 'value',
        arrayField: [ 1, 2, 3 ],
        objectField: {item: 'value'},
      })
      expect(backend.length).toBe(5)
      expect(backend.getItem('boolField')).toBe(true)
      expect(backend.getItem('numberField')).toBe(1)
      expect(backend.getItem('stringField')).toBe('value')
      expect(backend.getItem('arrayField')).toMatchObject([ 1, 2, 3 ])
      expect(backend.getItem('objectField')).toMatchObject({item: 'value'})
    })
  })

  describe('setItem() should', () => {
    test('set values in storage', () => {
      const backend = getBackend()
      backend.setItem('boolField', true)
      backend.setItem('numberField', 1)
      backend.setItem('stringField', 'value')
      backend.setItem('arrayField', [ 1, 2, 3 ])
      backend.setItem('objectField', {item: 'value'})

      expect(backend.length).toBe(5)
      expect(backend.getItem('boolField')).toBe(true)
      expect(backend.getItem('numberField')).toBe(1)
      expect(backend.getItem('stringField')).toBe('value')
      expect(backend.getItem('arrayField')).toMatchObject([ 1, 2, 3 ])
      expect(backend.getItem('objectField')).toMatchObject({item: 'value'})
    })

    test('set new value given known item name', () => {
      const backend = getBackend({item: 'value'})
      backend.setItem('item', 'newValue')

      expect(backend.getItem('item')).toBe('newValue')
    })
  })
})
