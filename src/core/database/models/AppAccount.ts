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
import {NetworkType, Password, SimpleWallet} from 'nem2-sdk'
import {Store} from 'vuex'

// internal dependencies
import {SimpleStorageAdapter} from '@/core/database/SimpleStorageAdapter'
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {AppDatabase} from '@/core/database/AppDatabase'
import {AESEncryptionService} from '@/services/AESEncryptionService'

export class AppAccount {
  /**
   * Model instance
   * @var {AccountsModel}
   */
  public model: AccountsModel

  /**
   * Storage adapter
   * @var {SimpleStorageAdapter}
   */
  protected adapter: SimpleStorageAdapter

  constructor(
    public store: Store<any>,
    public accountName: string,
    public wallets: Array<any>,
    public password: string,
    public hint: string,
    public networkType: NetworkType,
    public seed?: string,
  ) {
    // get database storage adapter
    this.adapter = AppDatabase.getAdapter()

    // password encrypted with accessSalt
    const accessSalt = this.adapter.getSaltForSession()
    const encryptPass = AESEncryptionService.encrypt(password, new Password(accessSalt))
    let encryptSeed = ''
    if (seed && seed.length) {
      encryptSeed = AESEncryptionService.encrypt(seed, new Password(accessSalt))
    }

    // populate model
    this.model = new AccountsModel(new Map<string, any>([
      ['accountName', this.accountName],
      ['wallets', this.wallets],
      ['password', encryptPass],
      ['hint', this.hint],
      ['networkType', this.networkType],
      ['seed', encryptSeed]
    ]))
  }
}
