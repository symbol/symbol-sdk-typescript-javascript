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
import {
  FakeAdapter,
  FakeTable,
  FakeModel,
  getAdapter,
} from '@MOCKS/Database'
import {JSONFormatter} from '@/core/database/formatters/JSONFormatter'

describe('database/BaseStorageAdapter ==>', () => {
  describe('constructor() should', () => {
    test('set default backend given no parameters', () => {
      const adapter = new FakeAdapter()
      expect(adapter).toBeDefined()
      expect(adapter.storage).toBeDefined()
    })

    test('set default formatter given no parameters', () => {
      const adapter = new FakeAdapter()
      expect(adapter).toBeDefined()
      expect(adapter.formatter).toBeDefined()
      expect(adapter.formatter).toBeInstanceOf(JSONFormatter)
    })
  })

  describe('setSchemas() should', () => {
    test('map schemas to names', () => {
      const adapter = getAdapter()

      expect(adapter.schemas.has('accounts')).toBe(true)
      expect(adapter.schemas.has('wallets')).toBe(true)
      expect(adapter.schemas.has('endpoints')).toBe(true)
      expect(adapter.schemas.has('aliased')).toBe(true)
      expect(adapter.schemas.get('accounts')).toBeInstanceOf(FakeTable)
      expect(adapter.schemas.get('accounts').tableName).toBe('accounts')
      expect(adapter.schemas.get('wallets')).toBeInstanceOf(FakeTable)
      expect(adapter.schemas.get('wallets').tableName).toBe('wallets')
      expect(adapter.schemas.get('endpoints')).toBeInstanceOf(FakeTable)
      expect(adapter.schemas.get('endpoints').tableName).toBe('endpoints')

      // test schema aliases too
      expect(adapter.schemas.get('aliased')).toBeInstanceOf(FakeTable)
      expect(adapter.schemas.get('aliased').tableName).toBe('crashes')
    })
  })

  describe('getSchema() should', () => {
    test('throw given unregistered schema', () => {
      const adapter = getAdapter()
      expect(() => {
        adapter.write('unknown_table', new Map<string, FakeModel>())
      }).toThrow('Schema with identifier \'unknown_table\' is not registered.')
    })
  })

  describe('read() should', () => {
    test('throw given corrupted/invalid JSON data', () => {
      const adapter = getAdapter()
      expect(() => {
        adapter.read('crashes')
      }).toThrow('Data stored for schema \'crashes\' does not comply with JSONFormatter derivate.')
    })

    test('return empty map given empty table', () => {
      const adapter = getAdapter()
      const peers = adapter.read('endpoints')
      expect(peers.size).toBe(0)
    })

    test('return correct rows count given populated table', () => {
      const adapter = getAdapter()
      const accounts = adapter.read('accounts')
      const wallets = adapter.read('wallets')
      expect(accounts.size).toBe(2)
      expect(wallets.size).toBe(3)
    })

    test('return correct values given populated table', () => {
      const adapter = getAdapter()
      const accounts = adapter.read('accounts')
      const wallets = adapter.read('wallets')

      // first table
      expect(accounts.size).toBe(2)
      expect(wallets.size).toBe(3)
      expect(accounts.has('1234')).toBe(true)
      expect(accounts.has('5678')).toBe(true)
      expect(accounts.get('1234')).toBeInstanceOf(FakeModel)
      expect(accounts.get('1234').values.has('id')).toBe(true)
      expect(accounts.get('1234').values.get('id')).toBe('1234')
      expect(accounts.get('1234').values.has('name')).toBe(true)
      expect(accounts.get('1234').values.get('name')).toBe('one')
      // second table
      expect(wallets.has('abcd')).toBe(true)
      expect(wallets.has('efgh')).toBe(true)
      expect(wallets.has('ijkl')).toBe(true)
      expect(wallets.get('ijkl')).toBeInstanceOf(FakeModel)
      expect(wallets.get('ijkl').values.has('id')).toBe(true)
      expect(wallets.get('ijkl').values.get('id')).toBe('ijkl')
      expect(wallets.get('ijkl').values.has('name')).toBe(true)
      expect(wallets.get('ijkl').values.get('name')).toBe('w_thr')
      expect(wallets.get('ijkl').values.has('address')).toBe(true)
      expect(wallets.get('ijkl').values.get('address')).toBe('w_addr3')
    })
  })

  describe('write() should', () => {
    test('write empty table given no values', () => {
      const adapter = getAdapter()
      const entries = adapter.write('endpoints', new Map<string, FakeModel>())
      expect(entries).toBe(0)
    })

    test('update storage during write operation', () => {
      const adapter = getAdapter()
      const entries = adapter.write('endpoints', new Map<string, FakeModel>([
        [ 'http://localhost:3000', new FakeModel(['host'], new Map<string, any>([
          [ 'host', 'http://localhost:3000' ],
          [ 'port', '3000' ],
        ])) ],
        [ 'http://localhost:3001', new FakeModel(['host'], new Map<string, any>([
          [ 'host', 'http://localhost:3001' ],
          [ 'port', '3001' ],
        ])) ],
      ]))
      expect(entries).toBe(2)

      // re-read storage and check mapped rows
      const mapped = adapter.read('endpoints')
      const keys = [...mapped.keys()]
      expect(mapped.size).toBe(2)
      expect(mapped.get(keys[0])).toBeInstanceOf(FakeModel)
      expect(mapped.get(keys[0]).values.has('id')).toBe(true)
      expect(mapped.get(keys[0]).values.has('host')).toBe(true)
      expect(mapped.get(keys[0]).values.has('port')).toBe(true)
      expect(mapped.get(keys[0]).values.get('host')).toBe('http://localhost:3000')
      expect(mapped.get(keys[0]).values.get('port')).toBe('3000')
      expect(mapped.get(keys[1])).toBeInstanceOf(FakeModel)
      expect(mapped.get(keys[1]).values.has('id')).toBe(true)
      expect(mapped.get(keys[1]).values.has('host')).toBe(true)
      expect(mapped.get(keys[1]).values.has('port')).toBe(true)
      expect(mapped.get(keys[1]).values.get('host')).toBe('http://localhost:3001')
      expect(mapped.get(keys[1]).values.get('port')).toBe('3001')
    })
  })
})
