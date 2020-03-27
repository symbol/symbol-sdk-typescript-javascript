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
import {DatabaseModel} from '@/core/database/DatabaseModel'
import {DatabaseTable} from '@/core/database/DatabaseTable'
import {AppDatabase} from '@/core/database/AppDatabase'
import {SimpleStorageAdapter} from '@/core/database/SimpleStorageAdapter'
import {IStorable} from './IStorable'

export abstract class ModelRepository implements IStorable<SimpleStorageAdapter> {
  /**
   * Storage adapter
   * @see {IStorable}
   * @var {SimpleStorageAdapter}
   */
  protected _adapter: SimpleStorageAdapter

  /**
   * Collection of items
   * @see {IRepository}
   * @var {Map<string, DatabaseModel>}
   */
  protected _collection: Map<string, DatabaseModel>

  /**
   * Construct a repository around \a adapter storage adapter.
   * @param {SimpleStorageAdapter} adapter 
   */
  public constructor() {
    this.setAdapter(AppDatabase.getAdapter())
    this.fetch()
  }

  /// region implements IStorable
  /**
   * Getter for the adapter
   * @see {IStorable}
   * @return {SimpleStorageAdapter}
   */
  public getAdapter(): SimpleStorageAdapter {
    return this._adapter
  }

  /**
   * Setter for the storage adapter
   * @see {IStorable}
   * @param {SimpleStorageAdapter} adapter
   * @return {ModelRepository}
   */
  public setAdapter(adapter: SimpleStorageAdapter): ModelRepository {
    this._adapter = adapter
    return this
  }

  /**
   * Fetch items from storage
   * @see {IStorable}
   * @return {Map<string, DatabaseModel>}
   */
  public fetch(): Map<string, DatabaseModel> {
    // use DatabaseTable
    const table = this.createTable()

    // read items from storage
    this._collection = this._adapter.read(table.tableName)
    return this._collection
  }

  /**
   * Persist items to storage
   * @see {IStorable}
   * @return {number}
   */
  public persist(): number {
    // use DatabaseTable
    const table = this.createTable()

    // read items from storage
    return this._adapter.write(table.tableName, this._collection)
  }

  /**
   * Reset storage (empty)
   * @see {IStorable}
   * @return boolean
   */
  public reset() {
    this._collection.clear()
    this.persist()
    return true
  }
  /// end-region implements IStorable

  /**
   * Fetch many relations using \a repository and values from \a model
   * @param {ModelRepository} repository
   * @param {DatabaseModel} model 
   * @param {string} fieldName
   * @return {Map<string, DatabaseModel>} Collection of objects mapped by identifier
   */
  public fetchRelations(
    repository: ModelRepository,
    model: DatabaseModel,
    fieldName: string,
  ): Map<string, DatabaseModel> {
    const resolved = new Map<string, DatabaseModel>()

    // resolve object by identifier list stored in values
    // with field name \a fieldName
    const ids = model.values.get(fieldName)
    ids.map(id => resolved.set(id, repository.read(id)))
    return resolved
  }

  /**
   * Fetch one relation using \a repository and values from \a model
   * @access protected
   * @param {ModelRepository} repository
   * @param {DatabaseModel} model 
   * @param {string} fieldName
   * @return {DatabaseModel} Sub class Model instance
   */
  public fetchRelation(
    repository: ModelRepository,
    model: DatabaseModel,
    fieldName: string,
  ): DatabaseModel {
    return repository.read(model.values.get(fieldName))
  }

  /// region abstract methods
  /**
   * Create a table instance
   * @return {DatabaseTable}
   */
  public abstract createTable(): DatabaseTable

  /**
   * Create a model instance
   * @param {Map<string, any>} values
   * @return {DatabaseModel}
   */
  public abstract createModel(values: Map<string, any>): DatabaseModel

  /**
   * Check for existence of entity by \a id
   * @param {string} id 
   * @return {boolean}
   */
  public abstract find(key: string): boolean

  /**
   * Getter for the collection of items
   * @return {ModelImpl[]}
   */
  public abstract collect(): DatabaseModel[]

  /**
   * Getter for the collection of items
   * mapped by identifier
   * @return {Map<string, DatabaseModel>}
   */
  public abstract entries(): Map<string, DatabaseModel>

  /**
   * Getter for the collection of items
   * mapped by identifier
   * @return {Map<string, DatabaseModel>}
   */
  public abstract entries(
    filterFn?: (
      value: DatabaseModel,
      index: number,
      array: DatabaseModel[]
    ) => boolean
  ): Map<string, DatabaseModel>

  /// region CRUD
  /**
   * Create an entity
   * @param {Map<string, any>} values
   * @return {string} The assigned entity identifier
   */
  public abstract create(values: Map<string, any>): string

  /**
   * Getter for the collection of items
   * @param {string} identifier
   * @return {Map<string, DatabaseModel>}
   */
  public abstract read(identifier: string): DatabaseModel

  /**
   * Update an entity
   * @param {string} identifier
   * @param {Map<string, any>} values
   * @return {DatabaseModel} The new values
   */
  public abstract update(identifier: string, values: Map<string, any>): DatabaseModel

  /**
   * Delete an entity
   * @param {string} identifier
   * @return {boolean} Whether an element was deleted
   */
  public abstract delete(identifier: string): boolean
  /// end-region CRUD
  /// end-region abstract methods

  /**
   * Getter for the table name
   * @return {string}
   */
  public getTableName(): string {
    return this.createTable().tableName
  }

  /**
   * Getter for the identifier names
   * @return {string[]}
   */
  public getPrimaryKeys(): string[] {
    // proxy object to read primary keys
    return this.createModel(new Map<string, any>()).primaryKeys
  }
}
