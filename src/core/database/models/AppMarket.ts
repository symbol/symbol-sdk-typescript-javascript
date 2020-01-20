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
export class ExchangeRatesModel extends DatabaseModel {
  /**
   * Entity identifier *field names*. The identifier
   * is a combination of the values separated by '-'
   * @var {string[]}
   */
  public primaryKeys: string[] = [
    'timestamp',
  ]

  /**
   * Entity relationships
   * @var {Map<string, DatabaseRelation>}
   */
  public relations: Map<string, DatabaseRelation> = new Map<string, DatabaseRelation>()
}

export class ExchangeRatesTable extends DatabaseTable {
  public constructor() {
    super('exchange_rates', [
      'timestamp',
      'price_usd',
    ])
  }

  /**
   * Create a new model instance
   * @return {PeersModel}
   */
  public createModel(): ExchangeRatesModel {
    return new ExchangeRatesModel()
  }
}
/// end-region database entities

export class AppMarket {
  /**
   * Model instance
   * @var {PeersModel}
   */
  public model: ExchangeRatesModel

  /**
   * Database service
   * @var {DatabaseService}
   */
  protected dbService: DatabaseService

  /**
   * Storage adapter
   * @var {SimpleStorageAdapter<ExchangeRatesModel>}
   */
  protected adapter: SimpleStorageAdapter<ExchangeRatesModel>

  constructor(
    public store: Store<any>,
    public timestamp: number,
    public priceUsd: number,
  ) {
    // initialize service
    this.dbService = ServiceFactory.create('database', store)

    // get storage adapter
    this.adapter = this.dbService.getAdapter<ExchangeRatesModel>()

    // populate model
    this.model = new ExchangeRatesModel(new Map<string, any>([
      ['timestamp', this.timestamp],
      ['price_usd', this.priceUsd],
    ]))
  }
}
