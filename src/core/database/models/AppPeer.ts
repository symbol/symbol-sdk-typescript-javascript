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
import {Store} from 'vuex'
import {NetworkType} from 'nem2-sdk'

// internal dependencies
import {DatabaseTable} from '@/core/database/DatabaseTable'
import {DatabaseModel} from '@/core/database/DatabaseModel'
import {DatabaseRelation} from '@/core/database/DatabaseRelation'
import {SimpleStorageAdapter} from '@/core/database/SimpleStorageAdapter'
import {ServiceFactory} from '@/services/ServiceFactory'
import {DatabaseService} from '@/services/DatabaseService'

/// region database entities
export class PeersModel extends DatabaseModel {
  /**
   * Entity identifier *field names*. The identifier
   * is a combination of the values separated by '-'
   * @var {string[]}
   */
  public primaryKeys: string[] = [
    'host',
  ]

  /**
   * Entity relationships
   * @var {Map<string, DatabaseRelation>}
   */
  public relations: Map<string, DatabaseRelation> = new Map<string, DatabaseRelation>()

  /**
   * Get peer full url
   * @return {string}
   */
  public toURL(): string {
    return this.values.get('protocol')
        + this.values.get('host') + ':'
        + this.values.get('port')
  }
}

export class PeersTable extends DatabaseTable {
  public constructor() {
    super('accounts', [
      'host',
      'port',
      'protocol',
      'networkType',
    ])
  }

  /**
   * Create a new model instance
   * @return {PeersModel}
   */
  public createModel(): PeersModel {
    return new PeersModel()
  }
}
/// end-region database entities

export class AppPeer {
  /**
   * Model instance
   * @var {PeersModel}
   */
  public model: PeersModel

  /**
   * Database service
   * @var {DatabaseService}
   */
  protected dbService: DatabaseService

  /**
   * Storage adapter
   * @var {SimpleStorageAdapter<PeersModel>}
   */
  protected adapter: SimpleStorageAdapter<PeersModel>

  constructor(
    public store: Store<any>,
    public host: string,
    public port: number,
    public protocol: string,
    public networkType: NetworkType,
  ) {
    // initialize service
    this.dbService = ServiceFactory.create('database', store)

    // get storage adapter
    this.adapter = this.dbService.getAdapter<PeersModel>()

    // populate model
    this.model = new PeersModel(new Map<string, any>([
      ['host', this.host],
      ['port', this.port],
      ['protocol', this.protocol],
      ['networkType', this.networkType],
    ]))
  }
}
