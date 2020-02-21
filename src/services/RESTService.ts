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
  NetworkType,
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
  public static create(name: 'AccountHttp', url: string, networkType?: NetworkType): AccountHttp
  public static create(name: 'BlockHttp', url: string, networkType?: NetworkType): BlockHttp
  public static create(name: 'ChainHttp', url: string, networkType?: NetworkType): ChainHttp
  public static create(name: 'MetadataHttp', url: string, networkType?: NetworkType): MetadataHttp
  public static create(name: 'MosaicHttp', url: string, networkType?: NetworkType): MosaicHttp
  public static create(name: 'MultisigHttp', url: string, networkType?: NetworkType): MultisigHttp
  public static create(name: 'NamespaceHttp', url: string, networkType?: NetworkType): NamespaceHttp
  public static create(name: 'NetworkHttp', url: string, networkType?: NetworkType): NetworkHttp
  public static create(name: 'NodeHttp', url: string, networkType?: NetworkType): NodeHttp
  public static create(name: 'ReceiptHttp', url: string, networkType?: NetworkType): ReceiptHttp
  public static create(name: 'RestrictionAccountHttp', url: string, networkType?: NetworkType): RestrictionAccountHttp
  public static create(name: 'RestrictionMosaicHttp', url: string, networkType?: NetworkType): RestrictionMosaicHttp
  public static create(name: 'TransactionHttp', url: string, networkType?: NetworkType): TransactionHttp
  /// end-region specialised signatures

  /**
   * Create a REST repository instance around \a serviceOpts
   * @param {string} name
   * @param {string} nodeUrl 
   */
  public static create(
    name: string,
    nodeUrl: string,
    networkType?: NetworkType,
  ): HttpRepositoryImpl {
    let repository: HttpRepositoryImpl
    switch (name) {
    case 'AccountHttp': repository = new AccountHttp(nodeUrl); break
    case 'BlockHttp': repository = new BlockHttp(nodeUrl); break
    case 'ChainHttp': repository = new ChainHttp(nodeUrl); break
    case 'MetadataHttp': repository = new MetadataHttp(nodeUrl); break
    case 'MosaicHttp': repository = new MosaicHttp(nodeUrl, networkType); break
    case 'MultisigHttp': repository = new MultisigHttp(nodeUrl, networkType); break
    case 'NamespaceHttp': repository = new NamespaceHttp(nodeUrl, networkType); break
    case 'NetworkHttp': repository = new NetworkHttp(nodeUrl); break
    case 'NodeHttp': repository = new NodeHttp(nodeUrl); break
    case 'ReceiptHttp': repository = new ReceiptHttp(nodeUrl); break
    case 'RestrictionAccountHttp': repository = new RestrictionAccountHttp(nodeUrl); break
    case 'RestrictionMosaicHttp': repository = new RestrictionMosaicHttp(nodeUrl); break
    case 'TransactionHttp': repository = new TransactionHttp(nodeUrl); break

    default: throw new Error('Could not find a REST repository by name \'' + name + ' \'')
    }

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

    context.dispatch('diagnostic/ADD_DEBUG', 'Opening REST websocket channel connections with ' + addressStr, {root: true})

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
      err => context.dispatch('diagnostic/ADD_ERROR', err, {root: true}))

    const unconfirmedRemoved = listener.unconfirmedRemoved(address).subscribe(
      transaction => context.dispatch('wallet/REMOVE_TRANSACTION', {group: 'unconfirmed', transaction}, {root: true}),
      err => context.dispatch('diagnostic/ADD_ERROR', err, {root: true}))

    // partial listeners
    const cosignatureAdded = listener.cosignatureAdded(address).subscribe(
      transaction => context.dispatch('notification/ADD_SUCCESS', NotificationType.COSIGNATURE_ADDED, {root: true}),
      err => context.dispatch('diagnostic/ADD_ERROR', err, {root: true}))

    const partialAdded = listener.aggregateBondedAdded(address).subscribe(
      transaction => context.dispatch('wallet/ADD_TRANSACTION', {group: 'partial', transaction}, {root: true}),
      err => context.dispatch('diagnostic/ADD_ERROR', err, {root: true}))

    const partialRemoved = listener.aggregateBondedRemoved(address).subscribe(
      transaction => context.dispatch('wallet/REMOVE_TRANSACTION', {group: 'partial', transaction}, {root: true}),
      err => context.dispatch('diagnostic/ADD_ERROR', err, {root: true}))

    // confirmed listener
    const confirmed = listener.confirmed(address).subscribe(
      transaction => context.dispatch('wallet/ADD_TRANSACTION', {group: 'confirmed', transaction}, {root: true}),
      err => context.dispatch('diagnostic/ADD_ERROR', err, {root: true}))

    return {listener, subscriptions: [
      status,
      unconfirmedAdded,
      unconfirmedRemoved,
      cosignatureAdded,
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

    context.dispatch('diagnostic/ADD_DEBUG', 'Opening REST block websocket channel connection', {root: true})

    const newBlock = listener.newBlock().subscribe((block: BlockInfo) => {
      context.dispatch('SET_CURRENT_HEIGHT', block.height.compact())
      context.dispatch('ADD_BLOCK', block)
      context.dispatch('diagnostic/ADD_INFO', 'New block height: ' + block.height.compact(), {root: true})
    })

    return {listener, subscriptions: [newBlock,]}
  }
}
