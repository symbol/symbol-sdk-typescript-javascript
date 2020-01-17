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
import {DatabaseModel} from '@/core/services/database/DatabaseModel'

export interface IRepository<ModelImpl extends DatabaseModel> {
  /**
   * Check for existence of entity by \a id
   * @param {string} id 
   * @return {boolean}
   */
  find(key: string): boolean

  /**
   * Getter for the collection of items
   * @return {Map<string, ModelImpl>}
   */
  collect(): Map<string, ModelImpl>

  /// region CRUD
  /**
   * Create an entity
   * @param {Map<string, any>} values
   * @return {string} The assigned entity identifier
   */
  create(values: Map<string, any>): string

  /**
   * Getter for the collection of items
   * @param {string} identifier
   * @return {Map<string, IModel>}
   */
  read(identifier: string): ModelImpl

  /**
   * Update an entity
   * @param {string} identifier
   * @param {Map<string, any>} values
   * @return {ModelImpl} The new values
   */
  update(identifier: string, values: Map<string, any>): ModelImpl

  /**
   * Delete an entity
   * @param {string} identifier
   * @return {boolean} Whether an element was deleted
   */
  delete(identifier: string): boolean
  /// end-region CRUD
}