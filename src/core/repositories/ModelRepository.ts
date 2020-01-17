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
import {DatabaseModel} from '@/core/services/database/DatabaseModel'
import {DatabaseTable} from '@/core/services/database/DatabaseTable'
import {BaseStorageAdapter} from '@/core/services/database/BaseStorageAdapter'
import {SimpleStorageAdapter} from '@/core/services/database/SimpleStorageAdapter'
import {IStorable} from './IStorable'

export abstract class ModelRepository<
  TableImpl extends DatabaseTable,
  ModelImpl extends DatabaseModel
> implements IStorable<ModelImpl, BaseStorageAdapter<ModelImpl>> {
  /**
   * Storage adapter
   * @see {IStorable}
   * @var {BaseStorageAdapter<ModelImpl>}
   */
  protected _adapter: BaseStorageAdapter<ModelImpl>

  /**
   * Collection of items
   * @see {IRepository}
   * @var {Map<string, ModelImpl>}
   */
  protected _collection: Map<string, ModelImpl>

  /**
   * Construct a repository around \a adapter storage adapter.
   * @param {BaseStorageAdapter} adapter 
   */
  public constructor(
    adapter: BaseStorageAdapter<ModelImpl> = new SimpleStorageAdapter<ModelImpl>()
  ) {
    this.setAdapter(adapter)
    this.fetch()
  }

  /**
   * Fetch items from storage
   * @return {Map<string, ModelImpl>}
   */
  protected fetch(): Map<string, ModelImpl> {
    // use DatabaseTable
    const table = this.getTable()

    // read items from storage
    this._collection = this._adapter.read(table.tableName)
    return this._collection
  }

  /**
   * Persist items to storage
   * @return {number}
   */
  protected persist(): number {
    // use DatabaseTable
    const table = this.getTable()

    // read items from storage
    return this._adapter.write(table.tableName, this._collection)
  }

  /// region abstract methods
  /**
   * Getter for the table name
   * @return {string}
   */
  public abstract getTableName(): string

  /**
   * Getter for the identifier name
   * @return {string}
   */
  public abstract getPrimaryKey(): string

  /**
   * Create a model instance
   * @param {Map<string, any>} values
   * @return {ModelImpl}
   */
  public abstract createModel(values: Map<string, any>): ModelImpl
  /// end-region abstract methods

  /// region implements IStorable
  /**
   * Getter for the adapter
   * @see {IStorable}
   * @return {BaseStorageAdapter}
   */
  public getAdapter(): BaseStorageAdapter<ModelImpl> {
    return this._adapter
  }

  /**
   * Setter for the storage adapter
   * @see {IStorable}
   * @param {StorageAdapterImpl} adapter
   * @return {ModelRepository<TableImpl, ModelImpl>}
   */
  public setAdapter(adapter: BaseStorageAdapter<ModelImpl>): ModelRepository<TableImpl, ModelImpl> {
    this._adapter = adapter
    return this
  }
  /// end-region implements IStorable

  /**
   * Getter for the database table
   * @return {DatabaseTable}
   * @throws {Error} On unregistered schema
   */
  public getTable(): DatabaseTable {
    const schema = this.getTableName()

    // catch unregistered schema
    if (!this._adapter.schemas.has(schema)) {
      throw new Error('Schema with name \'' + schema + '\' is not registered.')
    }

    return this._adapter.schemas.get(schema)
  }
}
