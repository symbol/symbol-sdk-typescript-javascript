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
import {AccountsModel} from '@/core/database/entities/AccountsModel'

/// region database migrations
import {AccountsMigrations} from '@/core/database/migrations/accounts/AccountsMigrations'
/// end-region database migrations

export class AccountsTable extends DatabaseTable {
  public constructor() {
    super('accounts', [
      'accountName',
      'wallets',
      'password',
      'hint',
      'networkType',
      'seed',
      'generationHash',
    ], 2) // version=2
  }

  /**
   * Create a new model instance
   * @param {Map<string, any>} values
   * @return {AccountsModel}
   */
  public createModel(values: Map<string, any> = new Map<string, any>()): AccountsModel {
    return new AccountsModel(values)
  }

  /**
   * Returns a list of migration callbacks to execute
   * for database versioning.
   * @return {any[]}
   */
  public getMigrations(): DatabaseMigration[] {
    return [
      {version: 2, callback: AccountsMigrations.version2_addGenHash},
    ]
  }
}
