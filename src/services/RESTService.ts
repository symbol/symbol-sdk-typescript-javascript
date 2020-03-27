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
import {
  Address,
  BlockInfo,
  IListener,
  Listener,
  RepositoryFactory,
  RepositoryFactoryHttp,
  TransactionStatusError,
} from 'symbol-sdk'
import {Subscription} from 'rxjs'
// internal dependencies
import {AddressValidator} from '@/core/validation/validators'
import {NotificationType} from '@/core/utils/NotificationType'
import {URLHelpers} from '@/core/utils/URLHelpers'


/**
 * This Service is more like a static helper now. All the methods are statics. Rename and move.
 */
export class RESTService {

  /**
   * Subscribe to transactions websocket channels
   * @param {Context} dispatch context the context
   * @param {RepositoryFactory} repositoryFactory the factory used to create the listener.
   * @param {Address} address the listened account.
   */
  public static async subscribeTransactionChannels(
    context: { dispatch: any, commit: any },
    repositoryFactory: RepositoryFactory,
    addressStr: string,
  ): Promise<{ listener: IListener, subscriptions: Subscription[] }> {
    if (!AddressValidator.validate(addressStr)) {
      throw new Error('Invalid address for subscribing to websocket connections')
    }

    context.dispatch('diagnostic/ADD_DEBUG', `Opening REST websocket channel connections with ${addressStr}`, {root: true})

    // open websocket connection
    const address = Address.createFromRawAddress(addressStr)
    const listener = repositoryFactory.createListener()
    await listener.open()

    // error listener
    const status = listener.status(address).subscribe(
      (error: TransactionStatusError) => context.dispatch('notification/ADD_ERROR', error.code, {root: true}))

    // unconfirmed listeners
    const unconfirmedAdded = listener.unconfirmedAdded(address).subscribe(
      transaction => {
        context.dispatch('wallet/ADD_TRANSACTION', {group: 'unconfirmed', transaction}, {root: true})
        context.dispatch('notification/ADD_SUCCESS', NotificationType.NEW_UNCONFIRMED_TRANSACTION, {root: true})
      },
      err => context.dispatch('diagnostic/ADD_ERROR', err, {root: true}))

    const unconfirmedRemoved = listener.unconfirmedRemoved(address).subscribe(
      transaction => context.dispatch('wallet/REMOVE_TRANSACTION', {group: 'unconfirmed', transaction}, {root: true}),
      err => context.dispatch('diagnostic/ADD_ERROR', err, {root: true}))

    // partial listeners
    const cosignatureAdded = listener.cosignatureAdded(address).subscribe(
      cosignature => {
        context.dispatch('wallet/ADD_COSIGNATURE', cosignature, {root: true})
        context.dispatch('notification/ADD_SUCCESS', NotificationType.COSIGNATURE_ADDED, {root: true})
      },
      err => context.dispatch('diagnostic/ADD_ERROR', err, {root: true}))

    const partialAdded = listener.aggregateBondedAdded(address).subscribe(
      transaction => {
        context.dispatch('wallet/ADD_TRANSACTION', {group: 'partial', transaction}, {root: true})
        context.dispatch('notification/ADD_SUCCESS', NotificationType.NEW_AGGREGATE_BONDED, {root: true})
      },
      err => context.dispatch('diagnostic/ADD_ERROR', err, {root: true}))

    const partialRemoved = listener.aggregateBondedRemoved(address).subscribe(
      transaction => context.dispatch('wallet/REMOVE_TRANSACTION', {group: 'partial', transaction}, {root: true}),
      err => context.dispatch('diagnostic/ADD_ERROR', err, {root: true}))

    // confirmed listener
    const confirmed = listener.confirmed(address).subscribe(
      transaction => {
        context.dispatch('wallet/ADD_TRANSACTION', {group: 'confirmed', transaction}, {root: true})
        context.dispatch('wallet/ON_NEW_TRANSACTION', transaction, {root: true})
        context.dispatch('notification/ADD_SUCCESS', NotificationType.NEW_CONFIRMED_TRANSACTION, {root: true})
      },
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
   * It creates the RepositoryFactory used to build the http repository/clients and listeners.
   * @param url the url.
   */
  public static createRepositoryFactory(url: string): RepositoryFactory {
    // TODO Extend RepositoryFactoryHttp in tha TS SDK to allow ws:// kind of urls.
    // TODO Why the WebSocket as webSocketInjected? Can we avoid this?
    const repositoryFactory = new RepositoryFactoryHttp(url)
    const wsUrl = URLHelpers.httpToWsUrl(url)
    repositoryFactory.createListener = () => {
      return new Listener(wsUrl, WebSocket)
    }
    return repositoryFactory
  }

  /**
   * Subscribe to blocks websocket channels
   * @param {Context} context the context
   * @param {RepositoryFactory} repositoryFactory the repository factory used to create the listener
   */
  public static async subscribeBlocks(
    context: { dispatch: any, commit: any },
    repositoryFactory: RepositoryFactory,
  ): Promise<{ listener: IListener, subscriptions: Subscription[] }> {
    // open websocket connection
    const listener = repositoryFactory.createListener()
    await listener.open()

    context.dispatch('diagnostic/ADD_DEBUG', 'Opening REST block websocket channel connection', {root: true})

    const newBlock = listener.newBlock().subscribe((block: BlockInfo) => {
      context.dispatch('SET_CURRENT_HEIGHT', block.height.compact())
      context.dispatch('ADD_BLOCK', block)
      context.dispatch('diagnostic/ADD_INFO', `New block height: ${block.height.compact()}`, {root: true})
    })

    return {listener, subscriptions: [newBlock]}
  }
}
