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
import {NamespaceInfo, AliasType} from 'nem2-sdk'

// internal dependencies
import {AssetTableService, AssetType, TableField} from './AssetTableService'
import {TimeHelpers} from '@/core/utils/TimeHelpers'
import {NamespaceTableFields, NamespaceTableRowValues} from './NamespaceTableConfig'


export class NamespaceTableService extends AssetTableService {
  public constructor(store: any) {
    super(store, AssetType.namespace)
  }

  /**
   * Return table fields to be displayed in a table header
   * @returns {TableField[]}
   */
  public getTableFields(): TableField[] {
    return [
      {
        name: NamespaceTableFields.name,
        label: 'table_header_name',
      }, {
        name: NamespaceTableFields.expiration,
        label: 'table_header_expiration',
      }, {
        name: NamespaceTableFields.expired,
        label: 'table_header_expired',
      }, {
        name: NamespaceTableFields.aliasIdentifier,
        label: 'table_header_alias_identifier',
      }, {
        name: NamespaceTableFields.aliasType,
        label: 'table_header_alias_type',
      },
    ]
  }
  
  /**
   * Return table values to be displayed in a table rows
   * @returns {NamespaceTableRowValues}
   */
  public async getTableRows(): Promise<NamespaceTableRowValues[]> {
    const currentWalletAddress = this.store.getters['wallet/currentWalletAddress']
    const namespaceInfo: NamespaceInfo[] = await this.store.dispatch('wallet/REST_FETCH_OWNED_NAMESPACES', currentWalletAddress.plain())
    if (!namespaceInfo.length) return []

    const namespaceIds = namespaceInfo.map(({id}) => id)
    const namespaceNames: {hex: string, name: string}[] = await this.store.dispatch('namespace/REST_FETCH_NAMES', namespaceIds)

    return Object.values(namespaceInfo).map(namespaceInfo => {
      const {expired, expiration} = this.getExpiration(namespaceInfo)

      return {
        [NamespaceTableFields.name]: namespaceNames.find(({hex}) => hex === namespaceInfo.id.toHex()).name,
        [NamespaceTableFields.expiration]: expiration,
        [NamespaceTableFields.expired]: expired,
        [NamespaceTableFields.aliasType]: this.getAliasType(namespaceInfo),
        [NamespaceTableFields.aliasIdentifier]: this.getAliasIdentifier(namespaceInfo),
      }
    })
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
   * @private
   * @param {NamespaceInfo} mosaicInfo
   * @returns {string}
   */
  private getExpiration (
    namespaceInfo: NamespaceInfo,
  ): {expiration: string, expired: boolean} {
    const {currentHeight} = this
    const endHeight = namespaceInfo.endHeight.compact()
    const networkConfig = this.store.getters['network/config']
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
