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
import {WalletsTable} from '@/core/database/entities/WalletsTable'
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {ModelRepository} from './ModelRepository'

export class WalletsRepository
  extends ModelRepository {

  /// region abstract methods
  /**
   * Create a table instance
   * @return {WalletsTable}
   */
  public createTable(): WalletsTable {
    return new WalletsTable()
  }

  /**
   * Create a model instance
   * @param {Map<string, any>} values
   * @return {ModelImpl}
   */
  public createModel(values: Map<string, any>): WalletsModel {
    return new WalletsModel(values)
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
   * @return {WalletsModel[]}
   */
  public collect(): WalletsModel[] {
    return Array.from(this._collection.values())
  }

  /**
   * Getter for the collection of items
   * mapped by identifier
   * @return {Map<string, WalletsModel>}
   */
  public entries(
    filterFn: (
      value: WalletsModel,
      index: number,
      array: WalletsModel[]
    ) => boolean = () => true,
  ): Map<string, WalletsModel> {
    const filtered = this.collect().filter(filterFn)
    const mapped = new Map<string, WalletsModel>()

    // map by identifier
    filtered.map(f => mapped.set(f.getIdentifier(), f))
    return mapped
  }

  /**
   * Create an entity
   * @param {Map<string, any>} values
   * @return {string} The assigned entity identifier
   */
  create(values: Map<string, any>): string {
    const mapped = this.createModel(values)

    // created object must contain values for all primary keys
    if (!mapped.hasIdentifier()) {
      throw new Error(`Missing value for mandatory identifier fields '${mapped.primaryKeys.join(', ')}'.`)
    }

    // verify uniqueness
    const identifier = mapped.getIdentifier()
    if (this.find(identifier)) {
      throw new Error(`Wallet with name '${identifier}' already exists.`)
    }

    // update collection
    this._collection.set(identifier, new WalletsModel(values))

    // persist to storage
    this.persist()
    return identifier
  }

  /**
   * Getter for the collection of items
   * @param {string} identifier
   * @return {WalletsModel}
   */
  public read(identifier: string): WalletsModel {
    // verify existence
    if (!this.find(identifier)) {
      throw new Error(`Wallet with name '${identifier}' does not exist.`)
    }

    return this._collection.get(identifier)
  }

  /**
   * Update an entity
   * @param {string} identifier
   * @param {Map<string, any>} values
   * @return {WalletsModel} The new values
   */
  public update(identifier: string, values: Map<string, any>): WalletsModel {
    // require existing
    const previous = this.read(identifier)

    // populate/update values
    const iterator = values.keys()
    for (let i = 0, m = values.size; i < m; i ++) {
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
      throw new Error(`Wallet with name '${identifier}' does not exist.`)
    }

    // update collection
    if(!this._collection.delete(identifier)) {
      return false
    }

    // persist to storage
    this.persist()
    return true
  }
  /// end-region implements IRepository
}
