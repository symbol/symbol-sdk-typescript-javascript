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
import {Mosaic, UInt64, MosaicInfo} from 'symbol-sdk'

// internal dependencies
import {AssetTableService, TableField} from './AssetTableService'
import {MosaicService} from '../MosaicService'

export class MosaicTableService extends AssetTableService {
/**
  * Creates an instance of MosaicTableService.
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
    const ownedMosaics: Mosaic[] = this.$store.getters['wallet/currentWalletMosaics']
    const mosaicsInfo: Record<string, MosaicInfo> = this.$store.getters['mosaic/mosaicsInfo']
    const mosaicNames: Record<string, string> = this.$store.getters['mosaic/mosaicsNames']

    return ownedMosaics.map((mosaic) => {
      const hexId = mosaic.id.toHex()

      // get mosaic info, return and wait for re-render if not available
      const mosaicInfo = mosaicsInfo[hexId]
      if (!mosaicInfo) return null

      // extract useful info
      const flags = mosaicInfo.flags
      const balance = mosaic.amount.compact()
      const {supply, divisibility} = mosaicInfo

      // get expiration from mosaics service
      const expiration = new MosaicService(this.$store).getExpiration(mosaicInfo)

      // - map table fields
      return {
        'hexId': hexId,
        'name': mosaicNames[hexId] || 'N/A',
        'supply': new UInt64([ supply.lower, supply.higher ]).compact().toLocaleString(),
        'balance': balance === 0 ? 0 : (
          // - get relative amount
          balance / Math.pow(10, divisibility)
        ),
        'expiration': expiration,
        'divisibility': divisibility,
        'transferable': flags.transferable,
        'supplyMutable': flags.supplyMutable,
        'restrictable': flags.restrictable,
      }
    }).filter(x => x) // filter out mosaics that are not yet available
  }
}
