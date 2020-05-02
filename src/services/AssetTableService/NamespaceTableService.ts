/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// external dependencies
import { AliasType } from 'symbol-sdk'
// internal dependencies
import { AssetTableService, TableField } from './AssetTableService'
import { NamespaceModel } from '@/core/database/entities/NamespaceModel'
import { NamespaceService } from '@/services/NamespaceService'
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel'

export class NamespaceTableService extends AssetTableService {
  constructor(
    currentHeight: number,
    private readonly namespaces: NamespaceModel[],
    private readonly networkConfiguration: NetworkConfigurationModel,
  ) {
    super(currentHeight)
  }

  /**
   * Return table fields to be displayed in a table header
   * @returns {TableField[]}
   */
  public getTableFields(): TableField[] {
    return [
      { name: 'hexId', label: 'table_header_hex_id' },
      { name: 'name', label: 'table_header_name' },
      { name: 'expiration', label: 'table_header_expiration' },
      { name: 'expired', label: 'table_header_expired' },
      { name: 'aliasType', label: 'table_header_alias_type' },
      { name: 'aliasIdentifier', label: 'table_header_alias_identifier' },
    ]
  }

  public getTableRows(): any[] {
    const namespaces: NamespaceModel[] = this.namespaces

    return namespaces.map((namespaceModel) => {
      const { expired, expiration } = this.getExpiration(namespaceModel)

      return {
        hexId: namespaceModel.namespaceIdHex,
        name: namespaceModel.name,
        expiration: expiration,
        expired: expired,
        aliasType: this.getAliasType(namespaceModel),
        aliasIdentifier: this.getAliasIdentifier(namespaceModel),
      }
    })
  }

  /**
   * Gets the namespace type to be displayed in the table
   * @private
   * @param the namespace model.
   * @returns {('N/A' | 'address' | 'mosaic')}
   */
  private getAliasType(namespaceModel: NamespaceModel): 'N/A' | 'address' | 'mosaic' {
    if (!namespaceModel.aliasTargetAddressRawPlain && !namespaceModel.aliasTargetMosaicIdHex) return 'N/A'
    return namespaceModel.aliasType === AliasType.Address ? 'address' : 'mosaic'
  }

  /**
   * Gets the namespace identifier to be displayed in the table
   * @private
   * @param the namespace model.
   * @returns {string}
   */
  private getAliasIdentifier(namespaceModel: NamespaceModel): string {
    return namespaceModel.aliasTargetMosaicIdHex || namespaceModel.aliasTargetAddressRawPlain || 'N/A'
  }

  /**
   * Returns a view of a namespace expiration info
   * @public
   * @param the namespace model.
   * @returns {string}
   */
  private getExpiration(namespaceModel: NamespaceModel): { expiration: string; expired: boolean } {
    return NamespaceService.getExpiration(this.networkConfiguration, this.currentHeight, namespaceModel.endHeight)
  }
}
