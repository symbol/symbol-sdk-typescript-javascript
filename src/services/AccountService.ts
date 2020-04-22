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
import {Convert, Password, SHA3Hasher} from 'symbol-sdk'
// internal dependencies
import {SimpleObjectStorage} from '@/core/database/backends/SimpleObjectStorage'
import {AccountModel} from '@/core/database/entities/AccountModel'


/**
 * Service in charge of loading accounts information from the wallet.
 */
export class AccountService {

  /**
   * The storage to keep user configuration around mosaics.  For example, the balance hidden
   * feature.
   */
  private readonly accountsStorage = new SimpleObjectStorage<Record<string, AccountModel>>(
    'accounts')


  public getAccounts(): AccountModel[] {
    return Object.values(this.getAccountsByAccountName())
  }

  public getAccountByName(accountName: string): AccountModel | undefined {
    return this.getAccountsByAccountName()[accountName]
  }

  public getAccountsByAccountName(): Record<string, AccountModel> {
    return this.accountsStorage.get() || {}
  }

  public saveAccount(account: AccountModel): AccountModel {
    const accounts = this.getAccountsByAccountName()
    accounts[account.accountName] = account
    this.accountsStorage.set(accounts)
    return account
  }

  public deleteAccount(accountName: string) {
    const accounts = this.getAccountsByAccountName()
    delete accounts[accountName]
    this.accountsStorage.set(accounts)
  }

  public updateSeed(account: AccountModel, seed: string): AccountModel {
    return this.saveAccount(Object.assign(account, {seed}))
  }

  public updatePassword(account: AccountModel, password: string, hint: string, seed: string): AccountModel {
    return this.saveAccount(Object.assign(account, {password, hint, seed}))
  }

  public updateWallets(account: AccountModel, wallets: string[]): AccountModel {
    return this.saveAccount(Object.assign(account, {wallets}))
  }

  /**
   * Return password hash that can be compared
   * @param password to be hashed
   * @return the password hash
   */
  public static getPasswordHash(password: Password): string {
    const hasher = SHA3Hasher.createHasher(64)
    hasher.reset()
    hasher.update(Convert.utf8ToHex(password.value))

    const hash = new Uint8Array(64)
    hasher.finalize(hash)
    return Convert.uint8ToHex(hash)
  }


}
