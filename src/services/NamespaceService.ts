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
import {NamespaceId, NamespaceInfo, NamespaceName} from 'nem2-sdk'

// internal dependencies
import {AbstractService} from './AbstractService'
import {NamespacesRepository} from '@/repositories/NamespacesRepository'
import {NamespacesModel} from '@/core/database/entities/NamespacesModel'

export class NamespaceService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'namespace'

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
   * Read the collection of known namespaces from database.
   *
   * @param {Function} filterFn
   * @return {MosaicsModel[]}
   */
  public getNamespaces(
    filterFn: (
      value: NamespacesModel,
      index: number,
      array: NamespacesModel[]
    ) => boolean = (e) => true
  ): NamespacesModel[] {
    const repository = new NamespacesRepository()
    return repository.collect().filter(filterFn)
  }

  /**
   * Read namespace from database or dispatch fetch action
   * from REST.
   *
   * @param {MosaicId} mosaicId 
   * @return {NamespacesModel}
   */
  public async getNamespace(
    namespaceId: NamespaceId 
  ): Promise<NamespacesModel> {

    const repository = new NamespacesRepository()
    let namespace: NamespacesModel

    if (!repository.find(namespaceId.toHex())) {
      // - namespace is unknown, fetch from REST + add to storage
      namespace = await this.fetchNamespaceInfo(namespaceId)
    }
    else {
      // - mosaic known, read NamespacesModel
      namespace = repository.read(namespaceId.toHex())
    }

    return namespace
  }

  /**
   * Read namespace from REST using store action.
   *
   * @internal
   * @param {MosaicId} mosaicId 
   * @return {MosaicsModel}
   */
  protected async fetchNamespaceInfo(
    namespaceId: NamespaceId 
  ): Promise<NamespacesModel> {
    // - get network info from store
    const generationHash = this.$store.getters['network/generationHash']

    // - fetch INFO from REST
    const namespaceInfo: NamespaceInfo = await this.$store.dispatch('namespace/REST_FETCH_INFO', namespaceId)
    const namespaceIds = namespaceInfo.levels.filter((info, i) => i < namespaceInfo.depth - 1)

    // - fetch NAMES from REST
    const namespaceNames = await this.$store.dispatch('namespace/REST_FETCH_NAMES', [...namespaceIds])
    const fullName = namespaceNames.map(n => n.name).join('.')

    // - use repository for storage
    const repository = new NamespacesRepository()
    if (repository.find(namespaceId.toHex())) {
      //XXX update instead of just read
      return repository.read(namespaceId.toHex())
    }

    // - CREATE
    const namespace = repository.createModel(new Map<string, any>([
      ['hexId', namespaceId.toHex()],
      ['name', fullName],
      ['depth', namespaceInfo.depth],
      ['level0', namespaceInfo.levels[0].toHex()],
      ['level1', namespaceInfo.levels.length > 1 ? namespaceInfo.levels[1].toHex() : ''],
      ['level2', namespaceInfo.levels.length > 2 ? namespaceInfo.levels[2].toHex() : ''],
      ['alias', namespaceInfo.alias],
      ['parentId', namespaceInfo.depth !== 1 ? namespaceInfo.parentNamespaceId().toHex() : ''],
      ['startHeight', namespaceInfo.startHeight.compact()],
      ['endHeight', namespaceInfo.endHeight.compact()],
      ['ownerPublicKey', namespaceInfo.owner.publicKey],
      ['generationHash', generationHash],
    ]))

    // - store and return
    repository.create(namespace.values)
    return namespace
  }
}
