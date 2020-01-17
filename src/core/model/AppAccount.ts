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
import CryptoJS from 'crypto-js'

// internal dependencies
import {DatabaseTable} from '@/core/services/database/DatabaseTable'
import {DatabaseModel} from '@/core/services/database/DatabaseModel'
import {ServiceFactory} from '@/core/services/ServiceFactory'
import {DatabaseService} from '@/core/services/database/DatabaseService'
import {
  DatabaseRelation,
  DatabaseRelationType,
} from '@/core/services/database/DatabaseRelation'

/// region database entities
export class AccountsModel extends DatabaseModel {
  /**
   * Entity identifier *field name*
   * @var {string}
   */
  public primaryKey: string = 'accountName'

  /** 
   * Entity relationships
   * @var {Map<string, DatabaseRelation>}
   */
  public relations: Map<string, DatabaseRelation> = new Map<string, DatabaseRelation>([
    ['wallets', new DatabaseRelation(DatabaseRelationType.ONE_TO_MANY)]
  ])
}

export class AccountsTable extends DatabaseTable {
  public constructor() {
    super('accounts', [
      'accountName',
      'wallets',
      'hint',
      'seed'
      'networkType',
    ])
  }

  /**
   * Create a new model instance
   * @return {AccountsModel}
   */
  public createModel(): AccountsModel {
    return new AccountsModel()
  }
}
/// end-region database entities

export class AppAccount {
  /**
   * Model instance
   * @var {AccountsModel}
   */
  public model: AccountsModel

  /**
   * Storage adapter
   * @var {DatabaseService}
   */
  protected dbService: DatabaseService

  constructor(
    public accountName: string,
    public wallets: Array<any>,
    public password: string,
    public hint: string,
    public networkType: NetworkType,
    public seed?: string,
  ) {
    // initialize service
    this.dbService = ServiceFactory.create('database')

    // get database storage adapter
    const adapter = this.dbService.getAdapter<AccountsModel>()
    const accessSalt = adapter.getSaltForSession()

    // password encrypted with accessSalt
    const encryptPass = adapter.encryption.encrypt(password, accessSalt, new Password(accessSalt))
    const encryptSeed = adapter.encryption.encrypt(seed || '', accessSalt, new Password(accessSalt))

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

  // static create(
  //   clearPassword: string,
  //   accountName: string,
  //   wallets: Array<any>,
  //   hint: string,       
  //   networkType: NetworkType,
  // ) {
  //   try {
  //     const password = AppAccounts().encryptString(clearPassword, clearPassword)
  //     return new AppAccount(
  //       accountName,
  //       wallets,
  //       password,
  //       hint,
  //       networkType,
  //     )
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // get currentAccount(): CurrentAccount {
  //   return {
  //     name: this.accountName,
  //     password: this.password,
  //     networkType: this.networkType,
  //   }
  // }

  // delete(): void {
  //   const accountMap = localRead('accountMap') === ''
  //     ? {} : JSON.parse(localRead('accountMap'))
  //   delete accountMap[this.accountName]
  //   localSave('accountMap', JSON.stringify(accountMap))
  // }
}
