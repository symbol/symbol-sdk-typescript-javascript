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
import {AssetTableService, TableField} from './AssetTableService'
import {MosaicModel} from '@/core/database/entities/MosaicModel'
import {MosaicService} from '@/services/MosaicService'
import {NetworkConfigurationModel} from '@/core/database/entities/NetworkConfigurationModel'

export class MosaicTableService extends AssetTableService {

  constructor(currentHeight: number, private readonly mosaics: MosaicModel[],
    private readonly networkConfiguration: NetworkConfigurationModel) {
    super(currentHeight)
  }

  /**
   * Return table fields to be displayed in a table header
   * @returns {TableField[]}
   */
  public getTableFields(): TableField[] {
    return [
      {name: 'hexId', label: 'table_header_hex_id'},
      {name: 'name', label: 'table_header_name'},
      {name: 'supply', label: 'table_header_supply'},
      {name: 'balance', label: 'table_header_balance'},
      {name: 'expiration', label: 'table_header_expiration'},
      {name: 'divisibility', label: 'table_header_divisibility'},
      {name: 'transferable', label: 'table_header_transferable'},
      {name: 'supplyMutable', label: 'table_header_supply_mutable'},
      {name: 'restrictable', label: 'table_header_restrictable'},
    ]
  }

  /**
   * Return table values to be displayed in a table rows
   * @returns {MosaicTableRowValues[]}
   */
  public getTableRows(): any[] {
    // - get reactive mosaic data from the store
    const mosaicsInfo = this.mosaics
    const currentHeight = this.currentHeight
    return mosaicsInfo.map((mosaicInfo) => {
      const expiration = MosaicService.getExpiration(mosaicInfo, currentHeight,
        this.networkConfiguration.blockGenerationTargetTime)
      // - map table fields
      return {
        'hexId': mosaicInfo.mosaicIdHex,
        'name': mosaicInfo.name || 'N/A',
        'supply': mosaicInfo.supply.toLocaleString(),
        'balance': (mosaicInfo.balance || 0) / Math.pow(10, mosaicInfo.divisibility),
        'expiration': expiration,
        'divisibility': mosaicInfo.divisibility,
        'transferable': mosaicInfo.transferable,
        'supplyMutable': mosaicInfo.supplyMutable,
        'restrictable': mosaicInfo.restrictable,
      }
    }).filter(x => x) // filter out mosaics that are not yet available
  }
}
