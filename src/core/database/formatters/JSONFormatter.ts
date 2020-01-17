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
import {IDataFormatter} from './IDataFormatter'
import {AbstractFormatter} from './AbstractFormatter'

export class JSONFormatter<ModelImpl extends DatabaseModel>
  extends AbstractFormatter<ModelImpl, string>
  implements IDataFormatter<ModelImpl, string> {

  /**
   * Format an \a entity
   * @param {ModelImpl} entity
   * @return {string}
   */
  public format(entities: Map<string, ModelImpl>): string {
    // format each entity individually
    let iterator = entities.keys()
    let data: Map<string, Map<string, any>> = new Map<string, Map<string, any>>()
    for (let i = 0, m = entities.size; i < m; i++) {
      const key = iterator.next()
      const dto = entities.get(key.value)
      const row = dto.values

      // expose only "values" from model
      data.set(key.value, row)
    }

    return JSON.stringify(data)
  }

  /**
   * Parse formatted \a data to entities
   * @param {string} data
   * @return {Map<string, ModelImpl>}
   */
  public parse(data: string): Map<string, ModelImpl> {
    let parsed = []
    try {
      parsed = JSON.parse(data)

      // if provided data is for singular entity, wrap in array
      if (!(parsed instanceof Array)) {
        parsed = [parsed]
      }
    }
    catch(e) {}

    if (!parsed.length) {
      return new Map<string, ModelImpl>()
    }

    // map entities to model instances by identifier
    const entities = new Map<string, ModelImpl>()
    parsed.map((entity: any) => {
      // create model
      let Activator: { new (): ModelImpl; }
      const model = Object.assign(new Activator(), entity)

      // populate fields
      model.values = new Map<string, any>(entity)
      model.identifier = model.values.get(model.primaryKey)

      // store by identifier
      entities.set(model.identifier, model)
    })

    return entities
  }

  /**
   * Validate format of \a data
   * @param {string} data 
   * @return {boolean}
   */
  public validate(data: string): boolean {
    try { 
      JSON.parse(data)
      return true
    }
    catch (e) {}
    return false;
  }
}
