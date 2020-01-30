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
import {AccountService} from '@/services/AccountService'

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

    // seed encrypted with password if necessary
    let encryptSeed = ''
    if (seed && seed.length) {
      encryptSeed = AESEncryptionService.encrypt(seed, new Password(this.password))
    }

    // password stored as hash (never plain.)
    const service = new AccountService(this.store)
    const passwordHash = service.getPasswordHash(new Password(this.password))
    
    // populate model
    this.model = new AccountsModel(new Map<string, any>([
      ['accountName', this.accountName],
      ['wallets', this.wallets],
      ['password', passwordHash],
      ['hint', this.hint],
      ['networkType', this.networkType],
      ['seed', encryptSeed]
    ]))
  }
}
