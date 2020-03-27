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
import {MosaicsTable} from '@/core/database/entities/MosaicsTable'
import {MosaicsModel} from '@/core/database/entities/MosaicsModel'
import {ModelRepository} from './ModelRepository'

export class MosaicsRepository
  extends ModelRepository {

  /// region abstract methods
  /**
   * Create a table instance
   * @return {MosaicsTable}
   */
  public createTable(): MosaicsTable {
    return new MosaicsTable()
  }

  /**
   * Create a model instance
   * @param {Map<string, any>} values
   * @return {MosaicsModel}
   */
  public createModel(values: Map<string, any>): MosaicsModel {
    return new MosaicsModel(values)
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
   * @return {MosaicsModel[]}
   */
  public collect(): MosaicsModel[] {
    return Array.from(this._collection.values())
  }

  /**
   * Getter for the collection of items
   * mapped by identifier
   * @return {Map<string, MosaicsModel>}
   */
  public entries(
    filterFn: (
      value: MosaicsModel,
      index: number,
      array: MosaicsModel[]
    ) => boolean = () => true,
  ): Map<string, MosaicsModel> {
    const filtered = this.collect().filter(filterFn)
    const mapped = new Map<string, MosaicsModel>()

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
      throw new Error(`Mosaic with identifier '${identifier}' already exists.`)
    }

    // update collection
    this._collection.set(identifier, new MosaicsModel(values))

    // persist to storage
    this.persist()
    return identifier
  }

  /**
   * Getter for the collection of items
   * @param {string} identifier
   * @return {MosaicsModel}
   */
  public read(identifier: string): MosaicsModel {
    // verify existence
    if (!this.find(identifier)) {
      throw new Error(`Mosaic with identifier '${identifier}' does not exist.`)
    }

    return this._collection.get(identifier)
  }

  /**
   * Update an entity
   * @param {string} identifier
   * @param {Map<string, any>} values
   * @return {MosaicsModel} The new values
   */
  public update(identifier: string, values: Map<string, any>): MosaicsModel {
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
      throw new Error(`Mosaic with identifier '${identifier}' does not exist.`)
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
