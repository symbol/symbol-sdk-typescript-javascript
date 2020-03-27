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
import {Address, PublicAccount} from 'symbol-sdk'

// internal dependencies
import {DatabaseModel} from '@/core/database/DatabaseModel'
import {DatabaseRelation} from '@/core/database/DatabaseRelation'

export class WalletType {
  public static readonly SEED: number = 1
  public static readonly PRIVATE_KEY = 2
  public static readonly KEYSTORE = 3
  public static readonly TREZOR = 4

  public static fromDescriptor(descriptor: string) {
    switch(descriptor) {
      default:
      case 'Ks': return WalletType.KEYSTORE
      case 'Pk': return WalletType.PRIVATE_KEY
      case 'Seed': return WalletType.SEED
      case 'Trezor': return WalletType.TREZOR
    }
  }
}

export class WalletsModel extends DatabaseModel {
  /**
   * Entity identifier *field names*. The identifier
   * is a combination of the values separated by '-'
   * @var {string[]}
   */
  public primaryKeys: string[] = [
    'id',
  ]

  /**
   * Entity relationships
   * @var {Map<string, DatabaseRelation>}
   */
  public relations: Map<string, DatabaseRelation> = new Map<string, DatabaseRelation>([])

  /**
   * Construct a wallet model instance
   * 
   * @param {Map<string, any>} values
   */
  public constructor(values: Map<string, any> = new Map<string, any>()) {
    super(['id'], values)
  }

  /**
   * Permits to return specific field's mapped object instances
   * @return any
   */
  public get objects(): any {
    const address = Address.createFromRawAddress(this.values.get('address'))
    const publicAccount = PublicAccount.createFromPublicKey(this.values.get('publicKey'), address.networkType)
    return {address, publicAccount}
  }
}
