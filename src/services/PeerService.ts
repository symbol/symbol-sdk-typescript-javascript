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
import {Store} from 'vuex'

// internal dependencies
import {AbstractService} from './AbstractService'
import {PeersRepository} from '@/repositories/PeersRepository'
import {PeersModel} from '@/core/database/entities/PeersModel'
import {URLHelpers} from '@/core/utils/URLHelpers'

export class PeerService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'peer'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store?: Store<any>) {
    super()
    this.$store = store
  }

  /**
   * Getter for the collection of items
   * mapped by identifier
   * @return {Map<string, PeersModel>}
   */
  public getEndpoints(
    filterFn: (
      value: PeersModel,
      index: number,
      array: PeersModel[]
    ) => boolean = () => true,
  ): PeersModel[] {
    const repository = new PeersRepository()
    return repository.collect().filter(filterFn)
  }

  /**
   * Get full node url and add missing pieces
   * @param {string} fromUrl 
   * @return {string}
   */
  public getNodeUrl(fromUrl: string): string {
    let fixedUrl = -1 === fromUrl.indexOf('://')
      ? `http://${fromUrl}`
      : fromUrl

    fixedUrl = !fixedUrl.match(/https?:\/\/[^:]+:([0-9]+)\/?$/)
      ? `${fixedUrl}:3000` // default adds :3000
      : fixedUrl

    const url = URLHelpers.formatUrl(fixedUrl)
    return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ':3000'}`
  }

  /**
   * Delete endpoint from the database
   * @param {string} url
   */
  public deleteEndpoint(url: string): void {
    // get full node url
    const fullUrl = this.getNodeUrl(url)

    // find node model in database
    const endpoint = this.getEndpoints().find(
      model => model.values.get('rest_url') === fullUrl,
    )

    // throw if node is not found in the database
    if (endpoint === undefined) {
      throw new Error(`This url was not found in the peer repository: ${url}`)
    }

    // delete the node from the database
    new PeersRepository().delete(endpoint.getIdentifier())
  }

  /**
   * Update the default node in the database
   * @param {string} url
   */
  public setDefaultNode(url: string): void {
    // get full node url
    const fullUrl = this.getNodeUrl(url)

    // find node model in database
    const selectedEndpoint = this.getEndpoints().find(
      model => model.values.get('rest_url') === fullUrl,
    )

    // throw if node is not found in the database
    if (selectedEndpoint === undefined) {
      throw new Error(`This url was not found in the peer repository: ${url}`)
    }

    const currentlyActiveEndpoint = this.getEndpoints().find(
      model => model.values.get('is_default') === true,
    )

    // throw if current active node is not found in the database
    if (currentlyActiveEndpoint === undefined) {
      throw new Error('The default endpoint was not found in the database')
    }

    // return if the node has not changed
    if (selectedEndpoint.getIdentifier() === currentlyActiveEndpoint.getIdentifier()) return

    // get the peers repository
    const peersRepository = new PeersRepository()

    // update the currently active endpoint
    currentlyActiveEndpoint.values.set('is_default', false)
    peersRepository.update(currentlyActiveEndpoint.getIdentifier(), currentlyActiveEndpoint.values)

    // set the selected endpoint as default
    selectedEndpoint.values.set('is_default', true)
    peersRepository.update(selectedEndpoint.getIdentifier(), selectedEndpoint.values)
  } 
}
