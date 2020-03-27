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
import {FakeTable} from '@MOCKS/Database'

describe('database/DatabaseTable ==>', () => {
  describe('constructor() should', () => {
    test('set table name', () => {
      const table = new FakeTable('table')
      expect(table).toBeDefined()
      expect(table.tableName).toBe('table')
    })

    test('set columns names', () => {
      const table = new FakeTable('table', [ 'col1', 'col2', 'col3' ])
      expect(table).toBeDefined()
      expect(table.columns).toMatchObject([ 'col1', 'col2', 'col3' ])
    })
  })
})
