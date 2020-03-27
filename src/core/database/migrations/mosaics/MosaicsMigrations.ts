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
import {MosaicsModel} from '@/core/database/entities/MosaicsModel'
import {UInt64} from 'symbol-sdk'

export class MosaicsMigrations {
  /**
   * Version 2 migration (first)
   *
   * @description Changed table structure
   *
   * Table columns added:
   * - generationHash',
   * - isCurrencyMosaic',
   * - isHarvestMosaic',
   * 
   * @params {Map<string, MosaicsModel>} rows
   * @return {Map<string, MosaicsModel>}
   */
  public static version2_addGenHash(
    rows: Map<string, MosaicsModel>,
  ): Map<string, MosaicsModel> {

    const entities = Array.from(rows.values())
    const migrated = new Map<string, MosaicsModel>()

    // each row must be migrated (added table columns)
    entities.map((outOfDate: MosaicsModel) => {
      outOfDate.values.set('generationHash', '45870419226A7E51D61D94AD728231EDC6C9B3086EF9255A8421A4F26870456A')
      outOfDate.values.set('isCurrencyMosaic', outOfDate.values.get('name') === 'symbol.xym')
      outOfDate.values.set('isHarvestMosaic', outOfDate.values.get('name') === 'symbol.xym')

      migrated.set(outOfDate.getIdentifier(), outOfDate)
    })

    return migrated
  }

  /**
   * Version 3 migration
   * @description Setting new symbol.xym network mosaics
   * @param rows 
   * @returns {Map<string, MosaicsModel>}
   */
  public static version3_newSymbol(
    rows: Map<string, MosaicsModel>,
  ): Map<string, MosaicsModel> {
    const entities = Array.from(rows.values())
    const migrated = new Map<string, MosaicsModel>()

    // each row must be migrated (added table columns)
    entities.map((outOfDate: MosaicsModel) => {
      if ('symbol.xym' === outOfDate.values.get('name')) {
        outOfDate.values.set('isCurrencyMosaic', true)
        outOfDate.values.set('isHarvestMosaic', true)
      }
    })

    return migrated
  }

  /**
   * Version 4 migration
   * @description Setting storing flags as numbers
   * @param {Map<string, MosaicsModel>} rows
   * @returns {Map<string, MosaicsModel>}
   */
  public static version4_flagsAsNumber(
    rows: Map<string, MosaicsModel>,
  ): Map<string, MosaicsModel> {
    const entities = Array.from(rows.values())
    const migrated = new Map<string, MosaicsModel>()
    entities.map((outOfDate: MosaicsModel) => {
      outOfDate.values.set('flags', outOfDate.values.get('flags').flags)
      migrated.set(outOfDate.getIdentifier(), outOfDate)
    })

    return migrated
  }

  /**
   * Version 5 migration
   * @description Uint64 should be stored as hex numbers
   * @param {Map<string, MosaicsModel>} rows
   * @returns {Map<string, MosaicsModel>}
   */
  public static version5_uint_as_hex(
    rows: Map<string, MosaicsModel>,
  ): Map<string, MosaicsModel> {
    const entities = Array.from(rows.values())
    const migrated = new Map<string, MosaicsModel>()
    entities.forEach((outOfDate: MosaicsModel) => {
      const oldSupply = outOfDate.values.get('supply')
      const newSupply = new UInt64([ oldSupply.lower, oldSupply.higher ])
      outOfDate.values.set('supply', newSupply.toHex())

      const oldStartHeight = outOfDate.values.get('startHeight')
      const newStartHeight = new UInt64([ oldStartHeight.lower, oldStartHeight.higher ])
      outOfDate.values.set('startHeight', newStartHeight.toHex())

      const oldDuration = outOfDate.values.get('duration')
      const newDuration = UInt64.fromUint(oldDuration)
      outOfDate.values.set('duration', newDuration.toHex())

      migrated.set(outOfDate.getIdentifier(), outOfDate)
    })

    return migrated
  }

  /**
   * Version 6 migration
   * @description add isHidden field
   * @param {Map<string, MosaicsModel>} rows
   * @returns {Map<string, MosaicsModel>}
   */
  public static version6_isHidden(
    rows: Map<string, MosaicsModel>,
  ): Map<string, MosaicsModel> {
    const entities = Array.from(rows.values())
    const migrated = new Map<string, MosaicsModel>()
    entities.forEach((outOfDate: MosaicsModel) => {
      outOfDate.values.set('isHidden', false)
      migrated.set(outOfDate.getIdentifier(), outOfDate)
    })

    return migrated
  }
}
