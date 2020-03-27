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
import {SHA3Hasher, Convert} from 'symbol-sdk'

// internal dependencies
import {DatabaseRelation} from './DatabaseRelation'
import {AESEncryptionService} from '@/services/AESEncryptionService'

export abstract class DatabaseModel {
  /**
   * Entity identifier *field names*. The identifier
   * is a combination of the values separated by '-'
   * @var {string[]}
   */
  public primaryKeys: string[] = []

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
    primaryKeys: string[] = [],
    values: Map<string, any> = new Map<string, any>(),
  ) {
    this.primaryKeys = primaryKeys
    this.values = values
    this.identifier = this.getIdentifier()
    this.isDirty = false
  }

  /**
   * Getter for the *row* identifier
   * @return {string}
   */
  public getIdentifier(): string {
    if (!this.primaryKeys.length) {
      throw new Error('Primary keys must be described in derivate DatabaseModel classes.')
    }

    return this.primaryKeys.map(pk => {
      let val = this.values.get(pk)
      if (!val && pk === 'id') {
        val = this.generateIdentifier()
        this.values.set('id', val)
      }
      return val
    }).join('-')
  }

  /**
   * Returns true when all primary key *values* are set
   * @return {boolean}
   */
  public hasIdentifier(): boolean {
    if (!this.primaryKeys.length) {
      throw new Error('Primary keys must be described in derivate DatabaseModel classes.')
    }

    // check value of *all* primary keys
    for (let i = 0, m = this.primaryKeys.length; i < m; i ++) {
      if (!this.values.has(this.primaryKeys[i])) {
        return false
      }
    }

    return true
  }

  /**
   * Generate an identifier for a model instance from its fields
   * @return {string}
   */
  protected generateIdentifier(): string {
    const raw = {
      time: new Date().valueOf(),
      seed: AESEncryptionService.generateRandomBytes(8),
    }

    const fields = this.values.keys()
    const values = this.values.values()
    for (let j = null; !(j = fields.next()).done;) {
      const field = j.value
      if (!field.length) {
        continue
      }
      raw[field] = values.next().value
    }

    // to-json
    const json = JSON.stringify(raw)
    const hasher = SHA3Hasher.createHasher(64)
    hasher.reset()
    hasher.update(Convert.utf8ToHex(json))

    const hash = new Uint8Array(64)
    hasher.finalize(hash)
    return Convert.uint8ToHex(hash).substr(0, 16)
  }

  /**
   * Update values
   * @param {Map<string, any>} values 
   * @return {DatabaseModel}
   * @throws {Error} On overwrite of primary key with different value
   */
  public update(values: Map<string, any>): DatabaseModel {
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

  /**
   * Permits to return specific field's mapped object instances
   * @return any
   */
  public get objects(): any {
    return {}
  }
}
