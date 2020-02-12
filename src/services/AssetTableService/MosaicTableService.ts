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
import {Mosaic, MosaicInfo, MosaicFlags, RawUInt64, UInt64} from 'nem2-sdk'

// internal dependencies
import {AssetTableService, TableField} from './AssetTableService'
import {MosaicService} from '@/services/MosaicService'
import {MosaicsModel} from '@/core/database/entities/MosaicsModel'

export class MosaicTableService extends AssetTableService {
  private currentWalletMosaics: Mosaic[]

  /**
  * Creates an instance of MosaicTableService.
  * @param {*} store
  */
  constructor(store?: Store<any>) {
    super(store)
    this.currentWalletMosaics = this.$store.getters['wallet/currentWalletMosaics'] || []
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
  public async getTableRows(): Promise<any[]> {
    // - read store for _owned_ mosaics
    const currentWalletMosaics = this.$store.getters['wallet/currentWalletMosaics'] || []

    // - use service to get information about mosaics
    const service = new MosaicService(this.$store)
    const mosaics = []
    for (let i = 0, m = currentWalletMosaics.length; i < m; i++) {
      const mosaic = currentWalletMosaics[i]

      // - read model
      const model = await service.getMosaic(mosaic.id)
      const flags = new MosaicFlags(model.values.get('flags'))

      // - identify balance row
      const balance = currentWalletMosaics.find(m => m.id.equals(mosaic.id))
      const supply  = model.values.get('supply')

      // - map table fields
      mosaics.push({
        "hexId": mosaic.id.toHex(),
        "name": model.values.get('name'),
        "supply": new UInt64([supply.lower, supply.higher]).compact(),
        "balance": balance === undefined ? 0 : (
          // - get relative amount
          balance.amount / Math.pow(10, model.values.get('divisibility'))
        ),
        "expiration": this.getExpiration(model),
        "divisibility": model.values.get('divisibility'),
        "transferable": flags.transferable,
        "supplyMutable": flags.supplyMutable,
        "restrictable": flags.restrictable
      })
    }

    return mosaics
  }

  /**
   * Returns a view of a mosaic expiration info
   * @private
   * @param {MosaicsModel} mosaic
   * @returns {string}
   */
  private getExpiration(mosaic: MosaicsModel): string {
    const duration = mosaic.values.get('duration')
    const startHeight = mosaic.values.get('startHeight')

    // - unlimited mosaics have duration=0
    if (duration === 0) {
      return 'unlimited'
    }

    // - calculate expiration
    const expiresIn = (startHeight + duration) - this.getCurrentHeight()
    if (expiresIn <= 0) {
      return 'expired'
    }

    // - number of blocks remaining
    return expiresIn.toString()
  }
}
