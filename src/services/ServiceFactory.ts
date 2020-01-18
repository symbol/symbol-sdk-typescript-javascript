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
import {IService} from './IService'
import {AESEncryptionService} from './AESEncryptionService'
import {DatabaseService} from './DatabaseService'
import {RemoteAccountService} from './RemoteAccountService'
import {RentalFeesService} from './RentalFeesService'
import {MarketService} from './MarketService'

export class ServiceFactory {
  /**
   * Services cache
   */
  public static _cache: Map<string, IService>

  /// region specialised signatures
  public static create(name: 'encryption'): AESEncryptionService
  public static create(name: 'database'): DatabaseService
  public static create(name: 'remote-account'): RemoteAccountService
  public static create(name: 'rental-fees'): RentalFeesService
  public static create(name: 'market'): MarketService
  /// end-region specialised signatures

  /**
   * Create a service instance around \a serviceOpts
   * @param {} serviceOpts 
   */
  public static create(serviceOpts): IService {
    // try to use previous instance
    if (ServiceFactory._cache.has(serviceOpts.name)) {
      return ServiceFactory._cache.get(serviceOpts.name)
    }

    let service: IService
    switch (serviceOpts.name) {
    case 'encryption':
      service = new AESEncryptionService()
      break
    case 'database':
      service = new DatabaseService()
      break
    case 'remote-account':
      service = new RemoteAccountService()
      break
    case 'rental-fees':
      service = new RentalFeesService()
      break
    case 'market':
      service = new MarketService()
      break

    default: throw new Error('Could not find any service by name \'' + serviceOpts.name + ' \'')
    }

    ServiceFactory._cache.set(serviceOpts.name, service)
    return service
  }
}
