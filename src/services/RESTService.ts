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
  Address,
  BlockHttp,
  BlockInfo,
  ChainHttp,
  DiagnosticHttp,
  Http,
  Listener,
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
  TransactionStatusError,
} from 'nem2-sdk'
import {Subscription} from 'rxjs'

// internal dependencies
import {AbstractService} from './AbstractService'
import {AddressValidator} from '@/core/validation/validators'
import {NotificationType} from '@/core/utils/NotificationType'

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
  public static _cache: Map<string, HttpRepositoryImpl> = new Map

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

  /// region specialised signatures
  public static create(name: 'AccountHttp', url: string): AccountHttp
  public static create(name: 'BlockHttp', url: string): BlockHttp
  public static create(name: 'ChainHttp', url: string): ChainHttp
  public static create(name: 'DiagnosticHttp', url: string): DiagnosticHttp
  public static create(name: 'MetadataHttp', url: string): MetadataHttp
  public static create(name: 'MosaicHttp', url: string): MosaicHttp
  public static create(name: 'MultisigHttp', url: string): MultisigHttp
  public static create(name: 'NamespaceHttp', url: string): NamespaceHttp
  public static create(name: 'NetworkHttp', url: string): NetworkHttp
  public static create(name: 'NodeHttp', url: string): NodeHttp
  public static create(name: 'ReceiptHttp', url: string): ReceiptHttp
  public static create(name: 'RestrictionAccountHttp', url: string): RestrictionAccountHttp
  public static create(name: 'RestrictionMosaicHttp', url: string): RestrictionMosaicHttp
  public static create(name: 'TransactionHttp', url: string): TransactionHttp
  /// end-region specialised signatures

  /**
   * Create a REST repository instance around \a serviceOpts
   * @param {string} name
   * @param {string} nodeUrl 
   */
  public static create(
    name: string,
    nodeUrl: string
  ): HttpRepositoryImpl {
    // try to use previous instance
    if (RESTService._cache && RESTService._cache.has(name)) {
      return RESTService._cache.get(name)
    }

    let repository: HttpRepositoryImpl
    switch (name) {
    case 'AccountHttp': repository = new AccountHttp(nodeUrl); break
    case 'BlockHttp': repository = new BlockHttp(nodeUrl); break
    case 'ChainHttp': repository = new ChainHttp(nodeUrl); break
    case 'DiagnosticHttp': repository = new DiagnosticHttp(nodeUrl); break
    case 'MetadataHttp': repository = new MetadataHttp(nodeUrl); break
    case 'MosaicHttp': repository = new MosaicHttp(nodeUrl); break
    case 'MultisigHttp': repository = new MultisigHttp(nodeUrl); break
    case 'NamespaceHttp': repository = new NamespaceHttp(nodeUrl); break
    case 'NetworkHttp': repository = new NetworkHttp(nodeUrl); break
    case 'NodeHttp': repository = new NodeHttp(nodeUrl); break
    case 'ReceiptHttp': repository = new ReceiptHttp(nodeUrl); break
    case 'RestrictionAccountHttp': repository = new RestrictionAccountHttp(nodeUrl); break
    case 'RestrictionMosaicHttp': repository = new RestrictionMosaicHttp(nodeUrl); break
    case 'TransactionHttp': repository = new TransactionHttp(nodeUrl); break

    default: throw new Error('Could not find a REST repository by name \'' + name + ' \'')
    }

    RESTService._cache.set(name, repository)
    return repository
  }

  /**
   * Subscribe to transactions websocket channels
   * @param {Context} dispatch 
   * @param {string} wsEndpoint 
   * @param {Address} address 
   */
  public static async subscribeTransactionChannels(
    context: {dispatch: any, commit: any},
    wsEndpoint: string,
    addressStr: string
  ): Promise<{listener: Listener, subscriptions: Subscription[]}> {
    if (!AddressValidator.validate(addressStr)) {
      throw new Error('Invalid address for subscribing to websocket connections')
    }

    // open websocket connection
    const address = Address.createFromRawAddress(addressStr)
    const listener = new Listener(wsEndpoint, WebSocket)
    await listener.open()

    // error listener
    const status = listener.status(address).subscribe(
      (error: TransactionStatusError) => context.dispatch('notification/ADD_ERROR', error.code, {root: true}))

    // unconfirmed listeners
    const unconfirmedAdded = listener.unconfirmedAdded(address).subscribe(
      transaction => context.dispatch('wallet/ADD_TRANSACTION', {group: 'unconfirmed', transaction}, {root: true}),
      err => console.log(err))

    const unconfirmedRemoved = listener.unconfirmedRemoved(address).subscribe(
      transaction => context.dispatch('wallet/REMOVE_TRANSACTION', {group: 'unconfirmed', transaction}, {root: true}),
      err => console.log(err))

    // partial listeners
    const cosignatureAdded = listener.cosignatureAdded(address).subscribe(
      transaction => context.dispatch('notification/ADD_SUCCESS', NotificationType.COSIGNATURE_ADDED, {root: true}),
      err => console.log(err))

    const partialAdded = listener.aggregateBondedAdded(address).subscribe(
      transaction => context.dispatch('wallet/ADD_TRANSACTION', {group: 'partial', transaction}, {root: true}),
      err => console.log(err))

    const partialRemoved = listener.aggregateBondedRemoved(address).subscribe(
      transaction => context.dispatch('wallet/REMOVE_TRANSACTION', {group: 'partial', transaction}, {root: true}),
      err => console.log(err))

    // confirmed listener
    const confirmed = listener.confirmed(address).subscribe(
      transaction => context.dispatch('wallet/ADD_TRANSACTION', {group: 'confirmed', transaction}, {root: true}),
      err => console.log(err))

    return {listener, subscriptions: [
      status,
      unconfirmedAdded,
      unconfirmedRemoved,
      partialAdded,
      partialRemoved,
      confirmed,
    ]}
  }

  /**
   * Subscribe to blocks websocket channels
   * @param {Context} dispatch 
   * @param {string} wsEndpoint 
   * @param {Address} address 
   */
  public static async subscribeBlocks(
    context: {dispatch: any, commit: any},
    wsEndpoint: string,
  ): Promise<{listener: Listener, subscriptions: Subscription[]}> {
    // open websocket connection
    const listener = new Listener(wsEndpoint, WebSocket)
    await listener.open()

    const newBlock = listener.newBlock().subscribe((block: BlockInfo) => {
      console.log("New block: #", block.height.compact())
      context.dispatch('SET_CURRENT_HEIGHT', block.height.compact())
      context.dispatch('ADD_BLOCK', block)
    })

    return {listener, subscriptions: [newBlock,]}
  }
}
