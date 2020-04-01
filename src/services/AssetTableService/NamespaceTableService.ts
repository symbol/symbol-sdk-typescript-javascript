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
// external dependencies
import {Store} from 'vuex'
import {NamespaceInfo, AliasType} from 'symbol-sdk'

// internal dependencies
import {AssetTableService, TableField} from './AssetTableService'
import {TimeHelpers} from '@/core/utils/TimeHelpers'
import {NamespaceService} from '@/services/NamespaceService'

export class NamespaceTableService extends AssetTableService {
  /**
   * Creates an instance of NamespaceTableService.
   * @param {*} store
   */
  constructor(store?: Store<any>) {
    super(store)
  }

  /**
   * Return table fields to be displayed in a table header
   * @returns {TableField[]}
   */
  public getTableFields(): TableField[] {
    return [
      {name: 'hexId', label: 'table_header_hex_id'},
      {name: 'name', label: 'table_header_name'},
      {name: 'expiration', label: 'table_header_expiration'},
      {name: 'expired', label: 'table_header_expired'},
      {name: 'aliasType', label: 'table_header_alias_type'},
      {name: 'aliasIdentifier', label: 'table_header_alias_identifier'},
    ]
  }

  /**
   * Return table values to be displayed in a table rows
   * @returns {NamespaceTableRowValues}
   */
  public getTableRows(): any[] {
    // - get owned namespaces from the store
    const ownedNamespaces: NamespaceInfo[] = this.$store.getters['wallet/currentWalletOwnedNamespaces']

    // - use service to get information about namespaces
    const service = new NamespaceService(this.$store)

    return ownedNamespaces.map((namespaceInfo) => {
      const {expired, expiration} = this.getExpiration(namespaceInfo)
      const model = service.getNamespaceSync(namespaceInfo.id)
      if (!model) return null

      return {
        'hexId': namespaceInfo.id.toHex(),
        'name': model.values.get('name'),
        'expiration': expiration,
        'expired': expired,
        'aliasType': this.getAliasType(namespaceInfo),
        'aliasIdentifier': this.getAliasIdentifier(namespaceInfo),
      }
    }).filter(x => x) // filter out namespaces that are not yet available
  }

  /**
   * Gets the namespace type to be displayed in the table
   * @private
   * @param {NamespaceInfo} namespaceInfo
   * @returns {('N/A' | 'address' | 'mosaic')}
   */
  private getAliasType(namespaceInfo: NamespaceInfo): 'N/A' | 'address' | 'mosaic' {
    if(!namespaceInfo.hasAlias()) return 'N/A'
    return namespaceInfo.alias.type === AliasType.Address ? 'address' : 'mosaic'
  }

  /**
   * Gets the namespace identifier to be displayed in the table
   * @private
   * @param {NamespaceInfo} namespaceInfo
   * @returns {string}
   */
  private getAliasIdentifier(namespaceInfo: NamespaceInfo): string {
    if(!namespaceInfo.hasAlias()) return 'N/A'
    const {alias} = namespaceInfo
    return alias.address ? alias.address.pretty() : alias.mosaicId.toHex()
  }

  /**
   * Returns a view of a namespace expiration info
   * @public
   * @param {NamespaceInfo} mosaicInfo
   * @returns {string}
   */
  public getExpiration (
    namespaceInfo: NamespaceInfo,
  ): {expiration: string, expired: boolean} {
    const {currentHeight} = this
    const endHeight = namespaceInfo.endHeight.compact()
    const networkConfig = this.$store.getters['network/config']
    const {namespaceGracePeriodDuration} = networkConfig.networks['testnet-publicTest']
    
    const expired = currentHeight > endHeight - namespaceGracePeriodDuration
    const expiredIn = endHeight - namespaceGracePeriodDuration - currentHeight
    const deletedIn = endHeight - currentHeight
    const expiration = expired
      ? TimeHelpers.durationToRelativeTime(expiredIn)
      : TimeHelpers.durationToRelativeTime(deletedIn)

    return {expired, expiration}
  }
}
