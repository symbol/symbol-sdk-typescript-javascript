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
import {DatabaseTable, DatabaseMigration} from '@/core/database/DatabaseTable'
import {DatabaseModel} from '@/core/database/DatabaseModel'
import {ObjectStorageBackend} from '@/core/database/backends/ObjectStorageBackend'
import {SimpleStorageAdapter} from '@/core/database/SimpleStorageAdapter'

/// region mocks
export class FakeAdapter extends SimpleStorageAdapter {}
export class FakeModel extends DatabaseModel {}
export class FakeTable extends DatabaseTable {
  public createModel(values: Map<string, any>): DatabaseModel {
    return new FakeModel(['id'], values)
  }

  public getMigrations(): DatabaseMigration[] {
    return []
  }
}
/// end-region mocks

/// region helpers
/**
 * Mock database adapter
 * @return {FakeAdapter}
 */
export const getAdapter = (data: any = undefined): FakeAdapter => {
  const adapter = new FakeAdapter(new ObjectStorageBackend(data || {
    accounts: '{'
      + '"1234":{"id":"1234","name":"one","version":0},'
      + '"5678":{"id":"5678","name":"two","version":0}'
    + '}',
    wallets: '{'
      + '"abcd":{"id":"abcd","name":"w_one","address":"w_addr","version":0},'
      + '"efgh":{"id":"efgh","name":"w_two","address":"w_addr2","version":0},'
      + '"ijkl":{"id":"ijkl","name":"w_thr","address":"w_addr3","version":0}'
    + '}',
    crashes: '[{item: "this is a corrupted table data format"}]'
  }))
  adapter.setSchemas(new Map<string, FakeTable>([
    ['accounts', new FakeTable('accounts', ['id', 'name'])],
    ['wallets', new FakeTable('wallets', ['id', 'name', 'address'])],
    ['endpoints', new FakeTable('endpoints', ['id', 'host', 'port'])],
    ['aliased', new FakeTable('crashes', ['id', 'time', 'error'])],
  ]))

  return adapter
}

/**
 * Mock database model
 * @return {FakeModel}
 */
export const getFakeModel = (identifier?: string, fields?: any[]): FakeModel => {
  return new FakeModel(['id'], new Map<string, any>(fields ? fields.concat([['id', identifier]]) : [
    ['fake_field_1', 'fake_value'],
    ['fake_field_2', 'fake_value2'],
    ['fake_field_3', 'fake_value3'],
    ['id', identifier],
  ]))
}
/// end-region helpers
