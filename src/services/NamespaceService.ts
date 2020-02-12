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
   * Read namespace info from store or dispatch fetch action.
   * @param {NamespaceId} namespaceId 
   * @return {Promise<NamespaceInfo>}
   */
  public async getNamespaceInfo(
    namespaceId: NamespaceId 
  ): Promise<NamespaceInfo> {
    // - get infos from store
    const namespaces = this.$store.getters['namespace/namespacesInfo']
    let namespaceInfo: NamespaceInfo

    // - if store doesn't know this mosaic, dispatch fetch action
    if (! namespaces.hasOwnProperty(namespaceId.toHex())) {
      namespaceInfo = await this.$store.dispatch('namespace/REST_FETCH_INFOS', [namespaceId])
    }
    // - read from store
    else namespaceInfo = namespaces[namespaceId.toHex()]

    //XXX save in storage

    return namespaceInfo
  }

  /**
   * Read the name of a mosaic with id \a mosaic
   * @param {NamespaceId} mosaic 
   * @return {Promise<string>}
   */
  public async getNamespaceName(
    namespaceId: NamespaceId 
  ): Promise<string> {
    // - get names from store
    const names = this.$store.getters['mosaic/mosaicsNames']
    let namespaceName: string

    // - if store doesn't know a name for this mosaics, dispatch fetch action
    if (! names.hasOwnProperty(namespaceId.toHex())) {
      const mapped: NamespaceName[] = await this.$store.dispatch('namespace/REST_FETCH_NAMES', [namespaceId])
      namespaceName = mapped.hasOwnProperty(namespaceId.toHex()) ? mapped[namespaceId.toHex()] : undefined
    }
    // - read from store
    else namespaceName = names[namespaceId.toHex()]

    //XXX save in storage

    return namespaceName
  }

  
  /**
   * Constructs a namespace fullName from namespace names
   * @static
   * @param {NamespaceName} reference
   * @param {NamespaceName[]} namespaceNames
   * @returns {NamespaceName}
   */
  public static getFullNameFromNamespaceNames(
    reference: NamespaceName,
    namespaceNames: NamespaceName[],
  ): NamespaceName {
    if (!reference.parentId) return reference

    const parent = namespaceNames
      .find(namespaceName => namespaceName.namespaceId.toHex() === reference.parentId.toHex())

    if (parent === undefined) return reference

    return NamespaceService.getFullNameFromNamespaceNames(
      new NamespaceName(parent.namespaceId, `${parent.name}.${reference.name}`, parent.parentId),
      namespaceNames,
    )
  }
}
