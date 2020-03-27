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
import {AbstractFormatter} from './AbstractFormatter'
import { DatabaseTable } from '../DatabaseTable'

export class JSONFormatter 
  extends AbstractFormatter {

  /**
   * Format an \a entity
   * @param {DatabaseModel} entity
   * @return {string}
   */
  public format(
    schema: DatabaseTable,
    entities: Map<string, DatabaseModel>,
  ): string {
    // format each entity individually
    const iterator = entities.keys()
    const data: {} = {}
    for (let i = 0, m = entities.size; i < m; i ++) {
      // read next identifier and model data
      const id = iterator.next().value
      if (!id.length) {
        continue
      }

      // read model
      const dto = entities.get(id)
      const identifier = dto.getIdentifier()

      // expose only "values" from model + add VERSION
      const raw = {}
      const row: Map<string, any> = dto.values
      const keys = row.keys()
      const values = row.values()
      for (let j = null; !(j = keys.next()).done;) {
        const field = j.value
        if (!field.length) {
          continue
        }
        raw[field] = values.next().value
      }

      // add schema version
      raw['version'] = schema.version

      // entities stored by id
      data[identifier] = raw
    }

    return JSON.stringify(data)
  }

  /**
   * Parse formatted \a data to entities
   * @param {string} data
   * @return {Map<string, ModelImpl>}
   */
  public parse(
    schema: DatabaseTable,
    data: string,
  ): Map<string, DatabaseModel> {
    let parsed = {}
    try { 
      parsed = JSON.parse(data) 
      if (!parsed || parsed === null) {
        return new Map<string, DatabaseModel>()
      }
    }
    catch(e) { return new Map<string, DatabaseModel>() }

    if (!Object.keys(parsed).length) {
      return new Map<string, DatabaseModel>()
    }

    // map entities to model instances by identifier
    const entities = new Map<string, DatabaseModel>()
    Object.keys(parsed).map((identifier: string) => {
      // read entity by identifier
      const entity = parsed[identifier]
      const fields = Object.keys(entity)
      const values = []
      fields.map(field => values.push([ field, entity[field] ]))

      // create model & populate fields
      const model = schema.createModel(new Map<string, any>(values))

      // store by identifier
      entities.set(model.getIdentifier(), model)
    })

    return entities
  }

  /**
   * Validate format of \a data
   * @param {string} data 
   * @return {boolean}
   */
  public validate(data: string): boolean {
    try {
      if (!data || data === null || !data.length) {
        return false
      }

      JSON.parse(data)
      return true
    }
    catch (e) {
      return false
    }

    return false
  }
}
