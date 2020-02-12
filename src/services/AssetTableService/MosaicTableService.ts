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
import {AssetTableService, AssetType, TableField} from './AssetTableService'
import {Mosaic, MosaicInfo} from 'nem2-sdk'
import {MosaicTableFields, MosaicTableRowValues} from './MosaicTableConfig'

export class MosaicTableService extends AssetTableService {
  private currentWalletMosaics: Mosaic[]

  /**
  * Creates an instance of MosaicAssetTableService.
  * @param {*} store
  */
  public constructor(store: any) {
    super(store, AssetType.mosaic)
    this.currentWalletMosaics = this.store.getters['wallet/currentWalletMosaics'] || []
  }

  /**
   * Return table fields to be displayed in a table header
   * @returns {TableField[]}
   */
  public getTableFields(): TableField[] {
    return [
      {
        name: MosaicTableFields.hexId,
        label: 'table_header_hex_id',
      }, {
        name: MosaicTableFields.name,
        label: 'table_header_name',
      }, {
        name: MosaicTableFields.supply,
        label: 'table_header_supply',
      }, {
        name: MosaicTableFields.balance,
        label: 'table_header_balance',
      }, {
        name: MosaicTableFields.expiration,
        label: 'table_header_expiration',
      }, {
        name: MosaicTableFields.divisibility,
        label: 'table_header_divisibility',
      }, {
        name: MosaicTableFields.transferable,
        label: 'table_header_transferable',
      }, {
        name: MosaicTableFields.supplyMutable,
        label: 'table_header_supply_mutable',
      }, {
        name: MosaicTableFields.restrictable,
        label: 'table_header_restrictable',
      },
    ]
  }

  /**
  * Return table values to be displayed in a table rows
  * @returns {MosaicTableRowValues[]}
  */
  public async getTableRows(): Promise<MosaicTableRowValues[]> {
    const mosaicsInfo: Record<string, MosaicInfo> = this.store.getters['mosaic/mosaicsInfo'] || {}
    const mosaicNamesByHex: Record<string, string> = this.store.getters['mosaic/mosaicsNames'] || {}

    return Object.values(mosaicsInfo).map(mosaicInfo => {
      const hexId = mosaicInfo.id.toHex()

      return {
        [MosaicTableFields.hexId]: hexId,
        [MosaicTableFields.name]: mosaicNamesByHex[hexId] || 'N/A',
        [MosaicTableFields.supply]: mosaicInfo.supply.compact().toLocaleString(),
        [MosaicTableFields.balance]: this.getRelativeBalanceById(mosaicInfo),
        [MosaicTableFields.expiration]: this.getExpiration(mosaicInfo),
        [MosaicTableFields.divisibility]: mosaicInfo.divisibility,
        [MosaicTableFields.transferable]: mosaicInfo.flags.transferable,
        [MosaicTableFields.supplyMutable]: mosaicInfo.flags.supplyMutable,
        [MosaicTableFields.restrictable]: mosaicInfo.flags.restrictable,
      }
    })
  }

  /**
  * Returns a relative balance synchronously
  * @private
  * @param {MosaicInfo} mosaicInfo
  * @returns {number}
  */
  private getRelativeBalanceById(mosaicInfo: MosaicInfo): number {
    // @TODO: Should not stay here
    const hexId = mosaicInfo.id.toHex()
    const currentWalletMosaic = this.currentWalletMosaics.find(({id}) => id.toHex() === hexId)
    if (currentWalletMosaic === undefined) return 0
    const {divisibility} = mosaicInfo
    return currentWalletMosaic.amount.compact() / Math.pow(10, divisibility)
  }

  /**
   * Returns a view of a mosaic expiration info
   * @private
   * @param {MosaicInfo} mosaicInfo
   * @returns {string}
   */
  private getExpiration(mosaicInfo: MosaicInfo): string {
    const duration = mosaicInfo.duration.compact()
    if (duration === 0) return 'unlimited'
    const expiresIn = (mosaicInfo.height.compact() + duration) - this.currentHeight
    if (expiresIn <= 0) return 'expired'
    return expiresIn.toLocaleString()
  }
}
