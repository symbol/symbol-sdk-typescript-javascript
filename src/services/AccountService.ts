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
import {Store} from 'vuex'

// internal dependencies
import {AbstractService} from './AbstractService'
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {AccountsModel} from '@/core/database/entities/AccountsModel'

export class AccountService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'account'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store?: Store<any>) {
    super()
    this.$store = store
  }

  /**
   * Read the collection of known accounts from database.
   *
   * @param {Function} filterFn
   * @return {MosaicsModel[]}
   */
  public getAccounts(
    filterFn: (
      value: AccountsModel,
      index: number,
      array: AccountsModel[]
    ) => boolean = () => true,
  ): AccountsModel[] {
    const repository = new AccountsRepository()
    return repository.collect().filter(filterFn)
  }

  /**
   * Return password hash that can be compared
   * @param {Password} password 
   * @return {string}
   */
  public getPasswordHash(password: Password): string {
    const hasher = SHA3Hasher.createHasher(64)
    hasher.reset()
    hasher.update(Convert.utf8ToHex(password.value))

    const hash = new Uint8Array(64)
    hasher.finalize(hash)
    return Convert.uint8ToHex(hash)
  }
}
