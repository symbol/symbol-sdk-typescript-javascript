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
import {DatabaseTable} from './DatabaseTable'
import {DatabaseModel} from './DatabaseModel'
import {IStorageBackend} from './backends/IStorageBackend'
import {IDataFormatter} from './formatters/IDataFormatter'

export interface IStorageAdapter {
  /**
   * Storage backend
   * @var {IStorageBackend}
   */
  storage: IStorageBackend

  /**
   * Data formatter
   * @var {IDataFormatter}
   */
  formatter: IDataFormatter

  /**
   * List of database table schemas
   * @var {Map<string, DatabaseTable}
   */
  schemas: Map<string, DatabaseTable>

  /**
   * Getter for table schemas
   * @return {Map<string, DatabaseTable>}
   */
  setSchemas(schemas: Map<string, DatabaseTable>): IStorageAdapter

  /**
   * Read and parse data for schema with \a schemaId
   * @param {string} schemaId 
   * @return {Map<string, ModelImpl>}
   */
  read<ModelImpl extends DatabaseModel>(schemaId: string): Map<string, ModelImpl>

  /**
   * Read and parse data for schema with \a schemaId
   * @param {Map<string, ModelImpl>} entities
   * @return {number} The count of entities written
   */
  write<ModelImpl extends DatabaseModel>(schemaId: string, entities: Map<string, ModelImpl>): number
}
