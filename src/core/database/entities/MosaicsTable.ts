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
import {DatabaseTable} from '@/core/database/DatabaseTable'
import {MosaicsModel} from '@/core/database/entities/MosaicsModel'

/// region database migrations
import {MosaicsMigrations} from '@/core/database/migrations/mosaics/MosaicsMigrations'
/// end-region database migrations

export class MosaicsTable extends DatabaseTable {
  public constructor() {
    super('mosaics', [
      'hexId',
      'name',
      'flags',
      'startHeight',
      'duration',
      'supply',
      'divisibility',
      'ownerPublicKey',
      'generationHash',
      'isCurrencyMosaic',
      'isHarvestMosaic',
      'isHidden',
    ], 6) // version=6
  }

  /**
   * Create a new model instance
   * @return {MosaicsModel}
   */
  public createModel(values: Map<string, any> = new Map<string, any>()): MosaicsModel {
    return new MosaicsModel(values)
  }

  /**
   * Returns a list of migration callbacks to execute
   * for database versioning.
   * @return {any[]}
   */
  public getMigrations(): {
    version: number
    callback: (rows: Map<string, MosaicsModel>) => Map<string, MosaicsModel>
  }[] {
    return [
      {version: 2, callback: MosaicsMigrations.version2_addGenHash},
      {version: 3, callback: MosaicsMigrations.version3_newSymbol},
      {version: 4, callback: MosaicsMigrations.version4_flagsAsNumber},
      {version: 5, callback: MosaicsMigrations.version5_uint_as_hex},
      {version: 6, callback: MosaicsMigrations.version6_isHidden},
    ]
  }
}
