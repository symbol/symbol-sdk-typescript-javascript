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
import {AbstractService} from './AbstractService'
import {DatabaseModel} from '@/core/database/DatabaseModel'
import {SimpleStorageAdapter} from '@/core/database/SimpleStorageAdapter'
import {LocalStorageBackend} from '@/core/database/backends/LocalStorageBackend'
import {JSONFormatter} from '@/core/database/formatters/JSONFormatter'
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {WalletsRepository} from '@/repositories/WalletsRepository'
import {PeersRepository} from '@/repositories/PeersRepository'

/// region specialized repository implementations
export type RepositoryImpl = AccountsRepository 
                           | WalletsRepository
                           | PeersRepository
/// end-region specialized repository implementations

export class DatabaseService extends AbstractService {
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
   * @param store
   */
  constructor(store: Store<any>) {
    super(store)
  }

  /**
   * Get the database adapter
   * @return {SimpleStorageAdapter<ModelImpl>}
   */
  public getAdapter<ModelImpl extends DatabaseModel>(): SimpleStorageAdapter<ModelImpl> {
    return new SimpleStorageAdapter<ModelImpl>(
      new LocalStorageBackend(),
      new JSONFormatter<ModelImpl>(),
    )
  }

  /// region specialized signatures
  public getRepository(name: 'accounts'): AccountsRepository
  public getRepository(name: 'wallets'): WalletsRepository
  public getRepository(name: 'peers'): PeersRepository
  /// end-region specialized signatures

  /**
   * Get a repository instance
   * @param repositoryOpts 
   * @return {RepositoryImpl}
   */
  public getRepository(name: string): RepositoryImpl {
    // try to instantiate repository by name
    switch (name) {
    case 'accounts': return new AccountsRepository()
    case 'wallets': return new WalletsRepository()
    case 'peers': return new PeersRepository()

    default: 
      const errorMessage = 'Could not find a repository by name \'' + name + ' \''
      this.$store.dispatch('diagnostic/ADD_ERROR', errorMessage)
      throw new Error(errorMessage)
    }
  }
}
