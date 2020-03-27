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
import {AccountsModel} from '@/core/database/entities/AccountsModel'

export class AccountsMigrations {
  /**
   * Version 2 migration (first)
   *
   * @description Changed table structure
   *
   * Table columns added:
   * - generationHash
   * 
   * @params {Map<string, AccountsModel>} rows
   * @return {Map<string, AccountsModel>}
   */
  public static version2_addGenHash(
    rows: Map<string, AccountsModel>,
  ): Map<string, AccountsModel> {

    const entities = Array.from(rows.values())
    const migrated = new Map<string, AccountsModel>()

    // each row must be migrated (added table columns)
    entities.map((outOfDate: AccountsModel) => {
      outOfDate.values.set('generationHash', '45870419226A7E51D61D94AD728231EDC6C9B3086EF9255A8421A4F26870456A')
      migrated.set(outOfDate.getIdentifier(), outOfDate)
    })

    return migrated
  }
}
