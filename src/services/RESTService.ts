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
import {
  AccountHttp,
  BlockHttp,
  ChainHttp,
  DiagnosticHttp,
  Http,
  MetadataHttp,
  MosaicHttp,
  MultisigHttp,
  NamespaceHttp,
  NetworkHttp,
  NodeHttp,
  ReceiptHttp,
  RestrictionAccountHttp,
  RestrictionMosaicHttp,
  TransactionHttp,
} from 'nem2-sdk'

// internal dependencies
import {AbstractService} from './AbstractService'

export type HttpRepositoryImpl = Http

export class RESTService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'rest'

  /**
   * REST repositories cache
   * @var {Map<string, RepositoryImpl>} 
   */
  public static _cache: Map<string, HttpRepositoryImpl>

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

  /// region specialised signatures
  public static create(name: 'AccountHttp'): AccountHttp
  public static create(name: 'BlockHttp'): BlockHttp
  public static create(name: 'ChainHttp'): ChainHttp
  public static create(name: 'DiagnosticHttp'): DiagnosticHttp
  public static create(name: 'MetadataHttp'): MetadataHttp
  public static create(name: 'MosaicHttp'): MosaicHttp
  public static create(name: 'MultisigHttp'): MultisigHttp
  public static create(name: 'NamespaceHttp'): NamespaceHttp
  public static create(name: 'NetworkHttp'): NetworkHttp
  public static create(name: 'NodeHttp'): NodeHttp
  public static create(name: 'ReceiptHttp'): ReceiptHttp
  public static create(name: 'RestrictionAccountHttp'): RestrictionAccountHttp
  public static create(name: 'RestrictionMosaicHttp'): RestrictionMosaicHttp
  public static create(name: 'TransactionHttp'): TransactionHttp
  /// end-region specialised signatures

  /**
   * Create a REST repository instance around \a serviceOpts
   * @param {} repositoryOpts 
   */
  public static create(repositoryOpts): HttpRepositoryImpl {
    // try to use previous instance
    if (RESTService._cache.has(repositoryOpts.name)) {
      return RESTService._cache.get(repositoryOpts.name)
    }

    let repository: HttpRepositoryImpl
    switch (repositoryOpts.name) {
    case 'AccountHttp': repository = new AccountHttp(repositoryOpts.url); break
    case 'BlockHttp': repository = new BlockHttp(repositoryOpts.url); break
    case 'ChainHttp': repository = new ChainHttp(repositoryOpts.url); break
    case 'DiagnosticHttp': repository = new DiagnosticHttp(repositoryOpts.url); break
    case 'MetadataHttp': repository = new MetadataHttp(repositoryOpts.url); break
    case 'MosaicHttp': repository = new MosaicHttp(repositoryOpts.url); break
    case 'MultisigHttp': repository = new MultisigHttp(repositoryOpts.url); break
    case 'NamespaceHttp': repository = new NamespaceHttp(repositoryOpts.url); break
    case 'NetworkHttp': repository = new NetworkHttp(repositoryOpts.url); break
    case 'NodeHttp': repository = new NodeHttp(repositoryOpts.url); break
    case 'ReceiptHttp': repository = new ReceiptHttp(repositoryOpts.url); break
    case 'RestrictionAccountHttp': repository = new RestrictionAccountHttp(repositoryOpts.url); break
    case 'RestrictionMosaicHttp': repository = new RestrictionMosaicHttp(repositoryOpts.url); break
    case 'TransactionHttp': repository = new TransactionHttp(repositoryOpts.url); break

    default: throw new Error('Could not find a REST repository by name \'' + repositoryOpts.name + ' \'')
    }

    RESTService._cache.set(repositoryOpts.name, repository)
    return repository
  }
}
