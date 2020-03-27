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

/// region custom types
export type DatabaseMigration = {
  version: number
  callback: (rows: Map<string, DatabaseModel>) => Map<string, DatabaseModel>
}
/// end-region custom types

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
   * Version of the table schema
   * @var {number}
   */
  public version: number

  /**
   * Construct a database table instance
   * @param tableName 
   * @param columns 
   * @param types 
   */
  public constructor(
    tableName: string,
    columns: string[] = [],
    version: number = 0,
  ) {
    this.tableName = tableName
    this.columns = columns
    this.version = version
  }

  /// region abstract methods
  /**
   * Create a new model instance
   * @return {DatabaseModel}
   */
  public abstract createModel(values: Map<string, any>): DatabaseModel

  /**
   * Returns a list of migration callbacks to execute
   * for database versioning.
   * @return {any[]}
   */
  public abstract getMigrations(): DatabaseMigration[]
  /// end-region abstract methods

  /**
   * Execute database migrations if any are needed
   * @param {Map<string, DatabaseModel>} rows 
   * @return {Map<string, DatabaseModel>} Migrated rows
   */
  public migrateRows(
    rows: Map<string, DatabaseModel>,
  ): Map<string, DatabaseModel> {
    if (!rows.size) {
      // no migration needed
      return rows
    }

    // always check if rows schema are up to date
    const tempRow = rows.values().next().value
    const dataVersion = tempRow.values.has('version')
      ? tempRow.values.has('version')
      : 0

    // filter migration by min version
    const migrations = this.getMigrations().filter(m => m.version >= dataVersion)
    const migratees = Array.from(rows.values()).filter(
      model => !model.values.has('version') 
             || model.values.get('version') < this.version,
    )

    console.log(`migrating ${migratees.length} rows for table ${this.tableName} to version ${this.version}`)

    if (!migratees.length || !migrations.length) {
      // no migration needed
      return rows
    }

    for (let i = 0, m = migrations.length; i < m; i ++) {
      const migration = migrations[i]

      // execute migration
      rows = migration.callback(rows)
    }

    return rows
  }
}
