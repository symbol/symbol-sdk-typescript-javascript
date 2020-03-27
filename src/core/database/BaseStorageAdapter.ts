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
import {IStorageAdapter} from './IStorageAdapter'
import {DatabaseTable} from './DatabaseTable'
import {DatabaseModel} from './DatabaseModel'
import {IStorageBackend} from './backends/IStorageBackend'
import {LocalStorageBackend} from './backends/LocalStorageBackend'
import {ObjectStorageBackend} from './backends/ObjectStorageBackend'
import {AbstractFormatter} from './formatters/AbstractFormatter'
import {JSONFormatter} from './formatters/JSONFormatter'

export abstract class BaseStorageAdapter 
implements IStorageAdapter {
  /**
   * Storage backend
   * @var {IStorageBackend}
   */
  public readonly storage: IStorageBackend

  /**
   * Data formatter
   * @var {AbstractFormatter}
   */
  public readonly formatter: AbstractFormatter

  /**
   * List of database table schemas
   * @var {Map<string, DatabaseTable}
   */
  public schemas: Map<string, DatabaseTable>

  /**
   * Private constructor (singleton pattern)
   * @access private
   */
  public constructor(
    storageBackend: IStorageBackend = !!localStorage ? new LocalStorageBackend() : new ObjectStorageBackend(),
    dataFormatter: AbstractFormatter = new JSONFormatter(),
  ) {
    this.storage = storageBackend
    this.formatter = dataFormatter
    this.schemas = new Map<string, DatabaseTable>()
  }

  /**
   * Getter for table schemas
   * @return {BaseStorageAdapter}
   */
  public setSchemas(schemas: Map<string, DatabaseTable>): BaseStorageAdapter {
    this.schemas = schemas
    return this
  }

  /**
   * Find schema by *alias* or by *table name*.
   * @param {string} schemaId 
   * @return {DatabaseTable}
   */
  public getSchema(schemaId: string): DatabaseTable {
    let schemaKey: string = schemaId
    if (!this.schemas.has(schemaKey)) {
      // try to find aliased schema
      schemaKey = [...this.schemas.keys()].find(
        s => this.schemas.get(s).tableName === schemaId,
      )

      // catch unregistered schema
      if (schemaKey === undefined) {
        throw new Error(`Schema with identifier '${schemaId}' is not registered.`)
      }
    }

    return this.schemas.get(schemaKey)
  }

  /**
   * Read and parse data for schema with \a schemaId
   * @param {string} schemaId 
   * @return {Map<string, DatabaseModel>}
   */
  public read(schemaId: string): Map<string, DatabaseModel> {
    // key can be alias or table name
    // read schema from storage backend
    const schema = this.getSchema(schemaId)

    // read from storage
    const data = this.storage.getItem(schema.tableName)
    if (!data || data === null || !data.length) {
      return new Map<string, DatabaseModel>()
    }

    // valid stored data to identify invalid data format
    if (!this.formatter.validate(data)) {
      throw new Error(`Data stored for schema '${schemaId}' does not comply with JSONFormatter derivate.`)
    }

    // map on-the-fly + validate singular entities format
    const rows: Map<string, DatabaseModel> = this.formatter.parse(schema, data)

    // identify out-of-date entities and run migrations
    if (!this.checkSchemaVersion(schema, rows)) {
      // there is at least one out-of-date entity, database needs migration(s)
      const migratedRows = schema.migrateRows(rows)

      // persist migrated rows
      this.write(schemaId, migratedRows)
      return migratedRows // return *up-to-date* always
    }

    return rows
  }

  /**
   * Read and parse data for schema with \a schemaId
   * @param {Map<string, DatabaseModel>} entities
   * @return {number} The count of entities written
   */
  public write(schemaId: string, entities: Map<string, DatabaseModel>): number {
    // key can be alias or table name
    // read schema from storage backend
    const schema = this.getSchema(schemaId)

    // format data
    const data = this.formatter.format(schema, entities)

    // persist formatted data to storage
    this.storage.setItem(schemaId, data)
    return entities.size
  }

  /**
   * Iterates entities to find *out-of-date* data schemas.
   * @param {DatabaseTable} schema 
   * @param {Map<string, DatabaseModel>} rows 
   * @return {boolean}  True if rows are up to date, false if any requires migration
   */
  protected checkSchemaVersion(
    schema: DatabaseTable,
    rows: Map<string, DatabaseModel>,
  ): boolean {
    const migratees = Array.from(rows.values()).filter(
      model => !model.values.has('version') 
             || model.values.get('version') < schema.version,
    )

    return !migratees.length
  }
}
