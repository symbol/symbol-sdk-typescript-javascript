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
import {DatabaseRelation} from './DatabaseRelation'

export class DatabaseModel {
  /**
   * Entity identifier *field name*
   * @var {string}
   */
  public primaryKey: string

  /** 
   * Entity relationships
   * @var {Map<string, DatabaseRelation>}
   */
  public relations: Map<string, DatabaseRelation>

  /**
   * Values of the model instance
   * @var {Map<string, any>}
   */
  public values: Map<string, any>

  /**
   * Whether the current instance has dirty fields
   * @var {boolean}
   */
  public isDirty: boolean

  /**
   * Entity identifier
   * @var {string}
   */
  public identifier: string

  /**
   * Construct a database model instance
   * @param tableName 
   * @param columns 
   * @param types 
   */
  public constructor(
    values: Map<string, any> = new Map<string, any>()
  ) {
    this.values = values
    this.identifier = values.get(this.primaryKey)
    this.isDirty = false
  }

  /**
   * Update values
   * @param {Map<string, any>} values 
   * @return {DatabaseModel}
   * @throws {Error} On overwrite of primary key with different value
   */
  public update(values: Map<string, any>): DatabaseModel {
    if (values.has(this.primaryKey) && this.identifier !== values.get(this.primaryKey)) {
      throw new Error('Primary key cannot be modified.')
    }

    this.values = values
    this.isDirty = true
    return this
  }

  /**
   * Update one field's value
   * @param {string} field
   * @param {any} value
   * @return {DatabaseModel}
   */
  public updateField(field: string, value: any): DatabaseModel {
    this.values.set(field, value)
    this.isDirty = true
    return this
  }
}
