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
import {SimpleWallet, Address} from 'nem2-sdk'

// internal dependencies
import {DatabaseModel} from '@/core/database/DatabaseModel'
import {DatabaseTable} from '@/core/database/DatabaseTable'
import {DatabaseRelation} from '@/core/database/DatabaseRelation'
import {SimpleStorageAdapter} from '@/core/database/SimpleStorageAdapter'
import {DatabaseService} from '@/services/DatabaseService'
import {ServiceFactory} from '@/services/ServiceFactory'

/// region database entities
export class WalletsModel extends DatabaseModel {
  /**
   * Entity identifier *field names*. The identifier
   * is a combination of the values separated by '-'
   * @var {string[]}
   */
  public primaryKeys: string[] = [
    'accountName',
    'address',
  ]

  /**
   * Entity relationships
   * @var {Map<string, DatabaseRelation>}
   */
  public relations: Map<string, DatabaseRelation> = new Map<string, DatabaseRelation>([])

  /**
   * Getter for address instance
   * @return {Address}
   */
  public address(): Address {
    return Address.createFromRawAddress(this.values.get('address'))
  }
}

export class WalletsTable extends DatabaseTable {
  public constructor() {
    super('wallets', [
      'accountName',
      'name',
      'type',
      'address',
      'publicKey',
      'encPrivate',
      'path',
      'isMultisig'
    ])
  }

  /**
   * Create a new model instance
   * @return {WalletsModel}
   */
  public createModel(): WalletsModel {
    return new WalletsModel()
  }
}
/// end-region database entities

export class AppWalletType {
  public static readonly SEED: number = 1
  public static readonly PRIVATE_KEY = 2
  public static readonly KEYSTORE = 3
  public static readonly TREZOR = 4

  public static fromDescriptor(descriptor: string) {
    switch(descriptor) {
    default:
    case 'Ks': return AppWalletType.KEYSTORE
    case 'Pk': return AppWalletType.PRIVATE_KEY
    case 'Seed': return AppWalletType.SEED
    case 'Trezor': return AppWalletType.TREZOR
    }
  }
}

export class AppWallet {
  /**
   * Model instance
   * @var {WalletsModel}
   */
  public model: WalletsModel

  /**
   * Database service
   * @var {DatabaseService}
   */
  protected dbService: DatabaseService

  /**
   * Storage adapter
   * @var {SimpleStorageAdapter<WalletsModel>}
   */
  protected adapter: SimpleStorageAdapter<WalletsModel>

  constructor(
    public store: Store<any>,
    public accountName: string,
    public name: string,
    public simpleWallet: SimpleWallet,
    public publicKey: string,
    public path: string,
    public sourceType: string,
    public isMultisig: boolean,
  ) {
    // initialize service
    this.dbService = ServiceFactory.create('database', store)

    // get storage adapter
    this.adapter = this.dbService.getAdapter<WalletsModel>()

    // populate model
    this.model = new WalletsModel(new Map<string, any>([
      ['accountName', this.accountName],
      ['name', this.name],
      ['type', AppWalletType.fromDescriptor(this.sourceType)],
      ['address', this.simpleWallet.address],
      ['publicKey', this.publicKey],
      ['encPrivate', simpleWallet.encryptedPrivateKey],
      ['path', this.path],
      ['isMultisig', this.isMultisig]
    ]))
  }
}
