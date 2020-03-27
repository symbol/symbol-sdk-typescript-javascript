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
import {FakeModel} from '@MOCKS/Database'

describe('database/DatabaseModel', () => {
  describe('constructor() should', () => {
    test('set primary keys given array', () => {
      const model = new FakeModel([ 'pk1', 'pk2' ])
      expect(model).toBeDefined()
      expect(model.primaryKeys).toMatchObject([ 'pk1', 'pk2' ])
    })

    test('set values given map', () => {
      const model = new FakeModel(['pk1'], new Map<string, any>([
        [ 'pk1', 'id_value' ],
        [ 'db_field2', true ],
      ]))

      expect(model.values.get('pk1')).toBe('id_value')
      expect(model.values.get('db_field2')).toBe(true)
    })

    test('set identifier given primary key value', () => {
      const model = new FakeModel(['pk1'], new Map<string, any>([
        [ 'pk1', 'id_value' ],
      ]))

      expect(model.identifier).toBe('id_value')
    })

    test('auto-generate identifier given \'id\' primary key', () => {
      const model = new FakeModel(['id'], new Map<string, any>([
        [ 'other', 'field_value' ],
      ]))

      expect(model.identifier).toBeDefined()
      expect(model.identifier.length).toBe(16)
    })
  })

  describe('generatedIdentifier() should', () => {
    test('generate distinct identifier values always', () => {
      const model1 = new FakeModel(['id'], new Map<string, any>([]))
      const model2 = new FakeModel(['id'], new Map<string, any>([]))
      const model3 = new FakeModel(['id'], new Map<string, any>([]))
      const model4 = new FakeModel(['id'], new Map<string, any>([]))

      const id1 = model1.getIdentifier()
      const id2 = model2.getIdentifier()
      const id3 = model3.getIdentifier()
      const id4 = model4.getIdentifier()

      expect(id1 === id2).toBe(false)
      expect(id1 === id3).toBe(false)
      expect(id1 === id4).toBe(false)
      expect(id2 === id3).toBe(false)
      expect(id2 === id4).toBe(false)
      expect(id3 === id4).toBe(false)
    })
  })

  describe('hasIdentifier() should', () => {
    test('return false given custom primary key and no value', () => {
      const model = new FakeModel(['pk1'], new Map<string, any>())
      expect(model.hasIdentifier()).toBe(false)
    })

    test('return true given custom primary key and value', () => {
      const model = new FakeModel(['pk1'], new Map<string, any>([
        [ 'pk1', 'id_value' ],
      ]))
      expect(model.hasIdentifier()).toBe(true)
    })

    test('return true given \'id\' primary key and no value', () => {
      const model = new FakeModel(['id'], new Map<string, any>())
      expect(model.hasIdentifier()).toBe(true)
    })
  })

  describe('getIdentifier() should', () => {
    test('get identifier value given primary key value', () => {
      const model = new FakeModel(['pk1'], new Map<string, any>([
        [ 'pk1', 'id_value' ],
      ]))

      expect(model).toBeDefined()
      expect(model.getIdentifier()).toBe('id_value')
    })

    test('get dash-separated identifier value given multiple primary key values', () => {
      const model = new FakeModel([ 'pk1', 'pk2' ], new Map<string, any>([
        [ 'pk1', 'id_value_part1' ],
        [ 'pk2', 'id_value_part2' ],
      ]))

      expect(model).toBeDefined()
      expect(model.getIdentifier()).toBe('id_value_part1-id_value_part2')
    })

    test('get pre-defined identifier value given \'id\' primary key', () => {
      const model = new FakeModel(['id'], new Map<string, any>([
        [ 'id', 'id_value' ],
      ]))

      expect(model).toBeDefined()
      expect(model.getIdentifier()).toBe('id_value')
    })

    test('get auto-generated identifier value given \'id\' primary key and no value', () => {
      const model = new FakeModel(['id'], new Map<string, any>([]))

      expect(model).toBeDefined()
      expect(model.getIdentifier()).toBeDefined()
      expect(model.getIdentifier().length).toBe(16)
    })
  })
})
