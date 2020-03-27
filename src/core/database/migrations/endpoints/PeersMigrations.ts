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
import {PeersModel} from '@/core/database/entities/PeersModel'

export class PeersMigrations {
  /**
   * Version 2 migration (first)
   *
   * @description Changed table structure
   *
   * Table columns added:
   * - rest_url
   * - generationHash
   * - roles
   * - is_default
   * - friendly_name
   * 
   * @params {Map<string, PeersModel>} rows
   * @return {Map<string, PeersModel>}
   */
  public static version2_addGenHash(
    rows: Map<string, PeersModel>,
  ): Map<string, PeersModel> {

    const entities = Array.from(rows.values())
    const migrated = new Map<string, PeersModel>()

    // each row must be migrated (added table columns)
    entities.map((outOfDate: PeersModel, i: number) => {
      outOfDate.values.set('rest_url', outOfDate.objects.url)
      outOfDate.values.set('generationHash', '45870419226A7E51D61D94AD728231EDC6C9B3086EF9255A8421A4F26870456A')
      outOfDate.values.set('roles', outOfDate.values.get('host').indexOf('harvest') ? 3 : 2)
      outOfDate.values.set('is_default', i === 0)
      outOfDate.values.set('friendly_name', '')

      migrated.set(outOfDate.getIdentifier(), outOfDate)
    })

    return migrated
  }
}
