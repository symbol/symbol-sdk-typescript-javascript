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
import {PeersTable} from '@/core/database/entities/PeersTable'
import {PeersModel} from '@/core/database/entities/PeersModel'
import {ModelRepository} from './ModelRepository'

import {URLHelpers} from '@/core/utils/URLHelpers'

// configuration
import networkConfig from '@/../config/network.conf.json'

export class PeersRepository
  extends ModelRepository {

  /// region abstract methods
  /**
   * Create a table instance
   * @return {PeersTable}
   */
  public createTable(): PeersTable {
    return new PeersTable()
  }

  /**
   * Create a model instance
   * @param {Map<string, any>} values
   * @return {ModelImpl}
   */
  public createModel(values: Map<string, any>): PeersModel {
    return new PeersModel(values)
  }
  /// end-region abstract methods

  /// region implements IRepository
  /**
   * Check for existence of entity by \a identifier
   * @param {string} identifier 
   * @return {boolean}
   */
  public find(identifier: string): boolean {
    return this._collection.has(identifier)
  }

  /**
   * Getter for the collection of items
   * @return {PeersModel[]}
   */
  public collect(): PeersModel[] {
    return Array.from(this._collection.values())
  }

  /**
   * Getter for the collection of items
   * mapped by identifier
   * @return {Map<string, PeersModel>}
   */
  public entries(
    filterFn: (
      value: PeersModel,
      index: number,
      array: PeersModel[]
    ) => boolean = () => true,
  ): Map<string, PeersModel> {
    const filtered = this.collect().filter(filterFn)
    const mapped = new Map<string, PeersModel>()

    // map by identifier
    filtered.map(f => mapped.set(f.getIdentifier(), f))
    return mapped
  }

  /**
   * Create an entity
   * @param {Map<string, any>} values
   * @return {string} The assigned entity identifier
   */
  create(values: Map<string, any>): string {
    const mapped = this.createModel(values)

    // created object must contain values for all primary keys
    if (!mapped.hasIdentifier()) {
      throw new Error(`Missing value for mandatory identifier fields '${mapped.primaryKeys.join(', ')}'.`)
    }

    // verify uniqueness
    const identifier = mapped.getIdentifier()
    if (this.find(identifier)) {
      throw new Error(`Peer with host '${identifier}' already exists.`)
    }

    // update collection
    this._collection.set(identifier, new PeersModel(values))

    // persist to storage
    this.persist()
    return identifier
  }

  /**
   * Getter for the collection of items
   * @param {string} identifier
   * @return {PeersModel}
   */
  public read(identifier: string): PeersModel {
    // verify existence
    if (!this.find(identifier)) {
      throw new Error(`Peer with host '${identifier}' does not exist.`)
    }

    return this._collection.get(identifier)
  }

  /**
   * Update an entity
   * @param {string} identifier
   * @param {Map<string, any>} values
   * @return {PeersModel} The new values
   */
  public update(identifier: string, values: Map<string, any>): PeersModel {
    // require existing
    const previous = this.read(identifier)

    // populate/update values
    const iterator = values.keys()
    for (let i = 0, m = values.size; i < m; i ++) {
      const key = iterator.next()
      const value = values.get(key.value)

      // expose only "values" from model
      previous.values.set(key.value, value)
    }

    // update collection
    this._collection.set(identifier, previous)

    // persist to storage
    this.persist()
    return previous
  }

  /**
   * Delete an entity
   * @param {string} identifier
   * @return {boolean} Whether an element was deleted
   */
  public delete(identifier: string): boolean {
    // require existing
    if (!this.find(identifier)) {
      throw new Error(`Peer with host '${identifier}' does not exist.`)
    }

    // update collection
    if(!this._collection.delete(identifier)) {
      return false
    }

    // persist to storage
    this.persist()
    return true
  }
  /// end-region implements IRepository

  /**
   * Populates the database from configuration file network.conf.json
   * @param {string} generationHash 
   * @return {PeersModel[]}
   */
  public repopulateFromConfig(
    generationHash: string,
  ): PeersModel[] {

    // - resets storage to repopulate from config
    this.reset()

    // - shortcuts
    const networkLabel = Object.keys(networkConfig.networks).filter(label => {
      return networkConfig.networks[label].generationHash === generationHash
    }).shift()
    const networkType = networkConfig.networks[networkLabel].networkType

    // - for each known node create a endpoints entry
    const peers: PeersModel[] = []
    const nodes = networkConfig.networks[networkLabel].nodes

    for (let i = 0, m = nodes.length; i < m; i ++) {
      const spec = nodes[i]
      const node = URLHelpers.formatUrl(spec.url)
      const isDefault = networkConfig.defaultNode.url === spec.url

      const model = new PeersModel(new Map<string, any>([
        [ 'rest_url', spec.url ],
        [ 'host', node.hostname ],
        [ 'port', parseInt(node.port) ],
        [ 'protocol', node.protocol ],
        [ 'networkType', networkType ],
        [ 'generationHash', generationHash ],
        [ 'roles', spec.roles ],
        [ 'is_default', isDefault ],
        [ 'friendly_name', spec.friendly ],
      ]))

      this.create(model.values)
      peers.push(model)
    }

    return peers
  }
}
