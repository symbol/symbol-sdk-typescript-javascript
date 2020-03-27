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
import {UInt64, AliasType, MosaicId} from 'symbol-sdk'

// internal dependencies
import {NamespacesModel} from '@/core/database/entities/NamespacesModel'

export class NamespacesMigrations {
  /**
   * Version 3 migration
   * @description Uint64 should be stored as hex numbers
   * @param rows 
   * @returns {Map<string, NamespacesModel>}
   */
  public static version3_uint_as_hex(
    rows: Map<string, NamespacesModel>,
  ): Map<string, NamespacesModel> {
    const entities = Array.from(rows.values())
    const migrated = new Map<string, NamespacesModel>()

    entities.forEach((outOfDate: NamespacesModel) => {
      const oldStartHeight = outOfDate.values.get('startHeight')
      const newStartHeight = UInt64.fromUint(oldStartHeight)
      outOfDate.values.set('startHeight', newStartHeight.toHex())

      const oldEndHeight = outOfDate.values.get('endHeight')
      const newEndHeight = UInt64.fromUint(oldEndHeight)
      outOfDate.values.set('endHeight', newEndHeight.toHex())

      // alias migration
      const oldAlias = outOfDate.values.get('alias')

      // if alias is a mosaic, convert the mosaicId to an hex number
      if (oldAlias && oldAlias.type == AliasType.Mosaic) {
        const oldMosaicId = new MosaicId([ oldAlias.mosaicId.id.lower, oldAlias.mosaicId.id.higher ]) 
        const newMosaicId = oldMosaicId.toHex()
        outOfDate.values.set('alias', {type: oldAlias.type, mosaicId: newMosaicId})
      }

      // if alias is an address, just store the rawAddress
      if (oldAlias && oldAlias.type == AliasType.Address) {
        outOfDate.values.set('alias', {type: oldAlias.type, address: oldAlias.address.address})
      }

      migrated.set(outOfDate.getIdentifier(), outOfDate)
    })

    return migrated
  }
}
