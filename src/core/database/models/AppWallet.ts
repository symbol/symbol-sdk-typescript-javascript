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
import {SimpleStorageAdapter} from '@/core/database/SimpleStorageAdapter'
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {AppDatabase} from '@/core/database/AppDatabase'

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
   * Storage adapter
   * @var {SimpleStorageAdapter}
   */
  protected adapter: SimpleStorageAdapter

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
    // get storage adapter
    this.adapter = AppDatabase.getAdapter()

    // populate model
    this.model = new WalletsModel(new Map<string, any>([
      ['accountName', this.accountName],
      ['name', this.name],
      ['type', AppWalletType.fromDescriptor(this.sourceType)],
      ['address', this.simpleWallet.address],
      ['publicKey', this.publicKey],
      ['encPrivate', simpleWallet.encryptedPrivateKey.encryptedKey],
      ['encIv', simpleWallet.encryptedPrivateKey.iv],
      ['path', this.path],
      ['isMultisig', this.isMultisig]
    ]))
  }
}
