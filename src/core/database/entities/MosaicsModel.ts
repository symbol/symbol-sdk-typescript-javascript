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
import {DatabaseModel} from '@/core/database/DatabaseModel'
import {DatabaseRelation} from '@/core/database/DatabaseRelation'
import {UInt64, MosaicId, RawUInt64, MosaicInfo, PublicAccount, NetworkType, MosaicFlags} from 'nem2-sdk'

export class MosaicsModel extends DatabaseModel {
  /**
   * Entity identifier *field names*. The identifier
   * is a combination of the values separated by '-'
   * @var {string[]}
   */
  public primaryKeys: string[] = [
    'hexId',
  ]

  /**
   * Entity relationships
   * @var {Map<string, DatabaseRelation>}
   */
  public relations: Map<string, DatabaseRelation> =  new Map<string, DatabaseRelation>()

  /**
   * Construct a mosaic model instance
   * 
   * @param {Map<string, any>} values
   */
  public constructor(values: Map<string, any> = new Map<string, any>()) {
    super(['hexId'], values)
  }

  /**
   * Permits to return specific field's mapped object instances
   * @return any
   */
  public get objects(): {
    mosaicId: MosaicId,
    mosaicInfo: MosaicInfo,
    startHeight: UInt64
  } {
    const rawStartHeight = this.values.get('startHeight')
    const hexId = this.getIdentifier()
    const mosaicId = new MosaicId(RawUInt64.fromHex(hexId))
    const ownerPub = PublicAccount.createFromPublicKey(
      this.values.get('ownerPublicKey'),
      NetworkType.MIJIN_TEST // ignored
    )

    return {
      mosaicId,
      mosaicInfo: new MosaicInfo(
        mosaicId,
        this.values.get('supply'),
        rawStartHeight,
        ownerPub,
        1,
        new MosaicFlags(this.values.get('flags')),
        this.values.get('divisibility'),
        this.values.get('duration')
      ),
      startHeight: new UInt64([ rawStartHeight.lower, rawStartHeight.higher ]),
    }
  }
}
