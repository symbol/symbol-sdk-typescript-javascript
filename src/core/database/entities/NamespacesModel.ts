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
import {NamespaceInfo, NamespaceRegistrationType, PublicAccount, UInt64, NamespaceId, Alias, MosaicId, Address, MosaicAlias, EmptyAlias, AddressAlias} from 'symbol-sdk'

export class NamespacesModel extends DatabaseModel {
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
  public relations: Map<string, DatabaseRelation> = new Map<string, DatabaseRelation>()

  /**
   * Construct a namespace model instance
   * 
   * @param {Map<string, any>} values
   */
  public constructor(values: Map<string, any> = new Map<string, any>()) {
    super(['hexId'], values)
  }

  /**
   * Permits to return specific field's mapped object instances
   * @readonly
   * @return {{
   *     namespaceInfo: NamespaceInfo,
   *   }}
   */
  public get objects(): { namespaceInfo: NamespaceInfo } {
    const registrationType = this.values.get('parentId') === undefined
      ? NamespaceRegistrationType.RootNamespace : NamespaceRegistrationType.SubNamespace

    const levels = [ this.values.get('level0'), this.values.get('level1'), this.values.get('level2') ]
      .filter(x => x).map(hexId => NamespaceId.createFromEncoded(hexId))

    const owner = PublicAccount.createFromPublicKey(
      this.values.get('ownerPublicKey'), this.values.get('generationHash'),
    )
    
    // instantiate a namespace alias
    const getAlias = (alias: any): Alias => {
      if (alias.mosaicId) return new MosaicAlias(new MosaicId(alias.mosaicId))
      if (alias.address) return new AddressAlias(Address.createFromRawAddress(alias.address))
      return new EmptyAlias()
    }
    return {
      namespaceInfo: new NamespaceInfo(
        this.values.get('active'),
        0,
        '',
        registrationType,
        this.values.get('depth'),
        levels,
        this.values.get('parentId'),
        owner,
        UInt64.fromHex(this.values.get('startHeight')),
        UInt64.fromHex(this.values.get('endHeight')),
        getAlias(this.values.get('alias')),
      ),
    }
  }
}
