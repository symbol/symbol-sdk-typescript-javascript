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
import {PeersModel} from '@/core/database/entities/PeersModel'

/// region database migrations
import {PeersMigrations} from '@/core/database/migrations/endpoints/PeersMigrations'
/// end-region database migrations

export class PeersTable extends DatabaseTable {
  public constructor() {
    super('endpoints', [
      'id',
      'rest_url',
      'host',
      'port',
      'protocol',
      'networkType',
      'generationHash',
      'roles',
      'is_default',
      'friendly_name',
    ], 2) // version=2
  }

  /**
   * Create a new model instance
   * @return {PeersModel}
   */
  public createModel(values: Map<string, any> = new Map<string, any>()): PeersModel {
    return new PeersModel(values)
  }

  /**
   * Returns a list of migration callbacks to execute
   * for database versioning.
   * @return {any[]}
   */
  public getMigrations(): DatabaseMigration[] {
    return [
      {version: 2, callback: PeersMigrations.version2_addGenHash},
    ]
  }
}
