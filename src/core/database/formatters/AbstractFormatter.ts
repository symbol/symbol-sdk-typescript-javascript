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
import {DatabaseModel} from '../DatabaseModel'
import {DatabaseTable} from '../DatabaseTable'

export abstract class AbstractFormatter {

  /**
   * The schema used for instance creation
   * @var {DatabaseTable}
   */
  protected $schema: DatabaseTable

  /**
   * Setter for active database table (schema)
   * @param {DatabaseTable} schema 
   * @return {AbstractFormatter}
   */
  public setSchema(schema: DatabaseTable): AbstractFormatter {
    this.$schema = schema
    return this
  }

  /**
   * Getter for active database table (schema)
   * @return {DatabaseTable}
   */
  public getSchema(): DatabaseTable {
    return this.$schema
  }

  /**
   * Validate format of \a data and throw exception
   * if not valid.
   * @param {string} data 
   * @return {boolean}
   * @throws {Error} On invalid JSON \a data
   */
  public assertFormat(data: string): boolean {
    if (this.validate(data) === true) {
      return true
    }

    throw new Error(`Expected JSON format for data but got: ${data}`)
  }

  /// region abstract methods
  /**
   * Format an \a entity
   * @param {DatabaseModel} entity
   * @return {string}
   */
  public abstract format(
    schema: DatabaseTable,
    entities: Map<string, DatabaseModel>
  ): string

  /**
   * Parse formatted \a data to entities
   * @param {string} data
   * @return {Map<string, DatabaseModel>}
   */
  public abstract parse(
    schema: DatabaseTable,
    data: string
  ): Map<string, DatabaseModel>

  /**
   * Validate format of \a data
   * @param {string} data 
   * @return {boolean}
   */
  public abstract validate(data: string): boolean
  /// end-region abstract methods
}
