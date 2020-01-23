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

// internal dependencies
import {IService} from './IService'
import {AESEncryptionService} from './AESEncryptionService'
import {DatabaseService} from './DatabaseService'
import {RemoteAccountService} from './RemoteAccountService'
import {RentalFeesService} from './RentalFeesService'
import {MarketService} from './MarketService'
import {WalletService} from './WalletService'
import {DerivationService} from './DerivationService'

export class ServiceFactory {
  /**
   * Services cache
   */
  public static _cache: Map<string, IService>

  /// region specialised signatures
  public static create(name: 'encryption', store: Store<any>): AESEncryptionService
  public static create(name: 'database', store: Store<any>): DatabaseService
  public static create(name: 'remote-account', store: Store<any>): RemoteAccountService
  public static create(name: 'rental-fees', store: Store<any>): RentalFeesService
  public static create(name: 'market', store: Store<any>): MarketService
  public static create(name: 'wallet', store: Store<any>): WalletService
  public static create(name: 'derivation', store: Store<any>): DerivationService
  /// end-region specialised signatures

  /**
   * Create a service instance around \a serviceOpts
   * @param {string} name 
   * @param {Vuex.Store<any>} store
   * @return {IService}
   */
  public static create(
    name: string,
    store: Store<any>
  ): IService {
    // try to use previous instance
    if (ServiceFactory._cache.has(name)) {
      return ServiceFactory._cache.get(name)
    }

    let service: IService
    switch (name) {
    case 'encryption':
      service = new AESEncryptionService(store)
      break
    case 'database':
      service = new DatabaseService(store)
      break
    case 'remote-account':
      service = new RemoteAccountService(store)
      break
    case 'rental-fees':
      service = new RentalFeesService(store)
      break
    case 'market':
      service = new MarketService(store)
      break
    case 'wallet':
      service = new WalletService(store)
      break
    case 'derivation':
      service = new DerivationService(store)
      break

    default: 
      const errorMessage = 'Could not find any service by name \'' + name + ' \''
      store.dispatch('diagnostic/ADD_ERROR', errorMessage)
      throw new Error(errorMessage)
    }

    ServiceFactory._cache.set(name, service)
    return service
  }
}
