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
  AccountsTable,
  AccountsModel,
} from '@/core/model/AppAccount'
import {SimpleStorageAdapter} from '@/core/services/database/SimpleStorageAdapter'
import {IRepository} from './IRepository'
import {ModelRepository} from './ModelRepository'

export class AccountsRepository
  extends ModelRepository<AccountsTable, AccountsModel>
  implements IRepository<AccountsModel> {

  /**
   * Construct a repository around \a adapter storage adapter.
   * @param {SimpleStorageAdapter<AccountsModel>} adapter 
   */
  public constructor(
    adapter: SimpleStorageAdapter<AccountsModel> = new SimpleStorageAdapter<AccountsModel>(),
  ) {
    super(adapter)
  }

  /// region abstract methods
  /**
   * Getter for the table name
   * @return {string}
   */
  public getTableName(): string {
    return 'accounts'
  }

  /**
   * Getter for the identifier name
   * @return {string}
   */
  public getPrimaryKey(): string {
    return 'accountName'
  }

  /**
   * Create a model instance
   * @param {Map<string, any>} values
   * @return {ModelImpl}
   */
  public createModel(values: Map<string, any>): AccountsModel {
    return new AccountsModel(values)
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
   * @return {Map<string, AccountsModel>}
   */
  public collect(): Map<string, AccountsModel> {
    return this._collection
  }


  /**
   * Create an entity
   * @param {Map<string, any>} values
   * @return {string} The assigned entity identifier
   */
  create(values: Map<string, any>): string {
    const identifier = values.get(this.getPrimaryKey())
    if (!identifier || !identifier.length) {
      throw new Error('Missing value for mandatory identifier \'' + this.getPrimaryKey() + '\'.')
    }

    // verify uniqueness
    if (this.find(identifier)) {
      throw new Error('Account with name \'' + identifier + '\' already exists.')
    }

    // update collection
    this._collection.set(identifier, new AccountsModel(values))

    // persist to storage
    this.persist()
    return identifier
  }

  /**
   * Getter for the collection of items
   * @param {string} identifier
   * @return {AccountsModel}
   */
  public read(identifier: string): AccountsModel {
    // verify existence
    if (!this.find(identifier)) {
      throw new Error('Account with name \'' + identifier + '\' does not exist.')
    }

    return this._collection.get(identifier)
  }

  /**
   * Update an entity
   * @param {string} identifier
   * @param {Map<string, any>} values
   * @return {AccountsModel} The new values
   */
  public update(identifier: string, values: Map<string, any>): AccountsModel {
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
      throw new Error('Account with name \'' + identifier + '\' does not exist.')
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
