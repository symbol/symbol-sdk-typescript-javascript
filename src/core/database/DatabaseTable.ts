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
import {DatabaseModel} from './DatabaseModel'

export abstract class DatabaseTable {
  /**
   * Table name
   * @var {string}
   */
  public tableName: string

  /**
   * List of column names (field names)
   * @var {string[]}
   */
  public columns: string[]

  /**
   * Construct a database table instance
   * @param tableName 
   * @param columns 
   * @param types 
   */
  public constructor(
    tableName: string,
    columns: string[] = [],
  ) {
    this.tableName = tableName
    this.columns = columns
  }

  /// region abstract methods
  /**
   * Create a new model instance
   * @return {DatabaseModel}
   */
  public abstract createModel(values: Map<string, any>): DatabaseModel
  /// end-region abstract methods
}
