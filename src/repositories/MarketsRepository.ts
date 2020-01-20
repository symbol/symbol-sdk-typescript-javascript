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
// internal dependencies
import {
  ExchangeRatesTable,
  ExchangeRatesModel,
} from '@/core/database/models/AppMarket'
import {SimpleStorageAdapter} from '@/core/database/SimpleStorageAdapter'
import {IRepository} from './IRepository'
import {ModelRepository} from './ModelRepository'

export class MarketsRepository
  extends ModelRepository<ExchangeRatesTable, ExchangeRatesModel>
  implements IRepository<ExchangeRatesModel> {

  /**
   * Construct a repository around \a adapter storage adapter.
   * @param {SimpleStorageAdapter<ExchangeRatesModel>} adapter 
   */
  public constructor(
    adapter: SimpleStorageAdapter<ExchangeRatesModel> = new SimpleStorageAdapter<ExchangeRatesModel>(),
  ) {
    super(adapter)
  }

  /// region abstract methods
  /**
   * Create a table instance
   * @return {ExchangeRatesTable}
   */
  public createTable(): ExchangeRatesTable {
    return new ExchangeRatesTable()
  }

  /**
   * Create a model instance
   * @param {Map<string, any>} values
   * @return {ModelImpl}
   */
  public createModel(values: Map<string, any>): ExchangeRatesModel {
    return new ExchangeRatesModel(values)
  }
  /// end-region abstract methods

  /// region implements IRepository
  /**
   * Check for existence of entity by \a identifier
   * @param {string} identifier 
   * @return {boolean}
   */
  public find(identifier: string): boolean {
    return this._collection.has(identifier)
  }

  /**
   * Getter for the collection of items
   * @return {Map<string, ExchangeRatesModel>}
   */
  public collect(): Map<string, ExchangeRatesModel> {
    return this._collection
  }

  /**
   * Create an entity
   * @param {Map<string, any>} values
   * @return {string} The assigned entity identifier
   */
  create(values: Map<string, any>): string {
    const mapped = this.createModel(values)

    // created object must contain values for all primary keys
    if (! mapped.hasIdentifier()) {
      throw new Error('Missing value for mandatory identifier fields \'' + mapped.primaryKeys.join(', ') + '\'.')
    }

    // verify uniqueness
    const identifier = mapped.getIdentifier()
    if (this.find(identifier)) {
      throw new Error('Exchange rate with timestamp \'' + identifier + '\' already exists.')
    }

    // update collection
    this._collection.set(identifier, new ExchangeRatesModel(values))

    // persist to storage
    this.persist()
    return identifier
  }

  /**
   * Getter for the collection of items
   * @param {string} identifier
   * @return {ExchangeRatesModel}
   */
  public read(identifier: string): ExchangeRatesModel {
    // verify existence
    if (!this.find(identifier)) {
      throw new Error('Exchange rate with timestamp \'' + identifier + '\' does not exist.')
    }

    return this._collection.get(identifier)
  }

  /**
   * Update an entity
   * @param {string} identifier
   * @param {Map<string, any>} values
   * @return {ExchangeRatesModel} The new values
   */
  public update(identifier: string, values: Map<string, any>): ExchangeRatesModel {
    // require existing
    const previous = this.read(identifier)

    // populate/update values
    let iterator = values.keys()
    for (let i = 0, m = values.size; i < m; i++) {
      const key = iterator.next()
      const value = values.get(key.value)

      // expose only "values" from model
      previous.values.set(key.value, value)
    }

    // update collection
    this._collection.set(identifier, previous)

    // persist to storage
    this.persist()
    return previous
  }

  /**
   * Delete an entity
   * @param {string} identifier
   * @return {boolean} Whether an element was deleted
   */
  public delete(identifier: string): boolean {
    // require existing
    if (!this.find(identifier)) {
      throw new Error('Exchange rate with timestamp \'' + identifier + '\' does not exist.')
    }

    // update collection
    if(! this._collection.delete(identifier)) {
      return false
    }

    // persist to storage
    this.persist()
    return true
  }
  /// end-region implements IRepository
}