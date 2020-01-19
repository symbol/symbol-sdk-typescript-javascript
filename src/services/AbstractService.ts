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
import {Password} from 'nem2-sdk'

// internal dependencies
import {IService} from './IService'
import {DatabaseModel} from '@/core/database/DatabaseModel'
import {DatabaseTable} from '@/core/database/DatabaseTable'
import {SimpleStorageAdapter} from '@/core/database/SimpleStorageAdapter'
import {LocalStorageBackend} from '@/core/database/backends/LocalStorageBackend'
import {JSONFormatter} from '@/core/database/formatters/JSONFormatter'
import {IRepository} from '@/repositories/IRepository'
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {WalletsRepository} from '@/repositories/WalletsRepository'
import {PeersRepository} from '@/repositories/PeersRepository'

/// region specialized repository implementations
export type RepositoryImpl = AccountsRepository 
                           | WalletsRepository
                           | PeersRepository
/// end-region specialized repository implementations

export abstract class AbstractService implements IService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'database'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Construct a service instance around \a store
   * @param {Vuex.Store} store 
   */
  public constructor(store: Store<any>) {
      this.$store = store
  }
}