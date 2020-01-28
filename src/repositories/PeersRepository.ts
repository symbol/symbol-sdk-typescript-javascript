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
import {PeersTable} from '@/core/database/entities/PeersTable'
import {PeersModel} from '@/core/database/entities/PeersModel'
import {IRepository} from './IRepository'
import {ModelRepository} from './ModelRepository'

export class PeersRepository
  extends ModelRepository<PeersTable, PeersModel>
  implements IRepository<PeersModel> {

  /// region abstract methods
  /**
   * Create a table instance
   * @return {PeersTable}
   */
  public createTable(): PeersTable {
    return new PeersTable()
  }

  /**
   * Create a model instance
   * @param {Map<string, any>} values
   * @return {ModelImpl}
   */
  public createModel(values: Map<string, any>): PeersModel {
    return new PeersModel(values)
  }
  /// end-region abstract methods

  /// region implements IRepository
  /**
   * Check for existence of entity by \a identifier
   * @param {string} identifier 
   * @return {boolean}
   */
  public find(identifier: string): boolean {
    return this._collection.has(identifier)
  }

  /**
   * Getter for the collection of items
   * @return {PeersModel[]}
   */
  public collect(): PeersModel[] {
    return Array.from(this._collection.values())
  }

  /**
   * Getter for the collection of items
   * mapped by identifier
   * @return {Map<string, PeersModel>}
   */
  public entries(): Map<string, PeersModel> {
    return this._collection
  }

  /**
   * Create an entity
   * @param {Map<string, any>} values
   * @return {string} The assigned entity identifier
   */
  create(values: Map<string, any>): string {
    const mapped = this.createModel(values)

    // created object must contain values for all primary keys
    if (! mapped.hasIdentifier()) {
      throw new Error('Missing value for mandatory identifier fields \'' + mapped.primaryKeys.join(', ') + '\'.')
    }

    // verify uniqueness
    const identifier = mapped.getIdentifier()
    if (this.find(identifier)) {
      throw new Error('Peer with host \'' + identifier + '\' already exists.')
    }

    // update collection
    this._collection.set(identifier, new PeersModel(values))

    // persist to storage
    this.persist()
    return identifier
  }

  /**
   * Getter for the collection of items
   * @param {string} identifier
   * @return {PeersModel}
   */
  public read(identifier: string): PeersModel {
    // verify existence
    if (!this.find(identifier)) {
      throw new Error('Peer with host \'' + identifier + '\' does not exist.')
    }

    return this._collection.get(identifier)
  }

  /**
   * Update an entity
   * @param {string} identifier
   * @param {Map<string, any>} values
   * @return {PeersModel} The new values
   */
  public update(identifier: string, values: Map<string, any>): PeersModel {
    // require existing
    const previous = this.read(identifier)

    // populate/update values
    let iterator = values.keys()
    for (let i = 0, m = values.size; i < m; i++) {
      const key = iterator.next()
      const value = values.get(key.value)

      // expose only "values" from model
      previous.values.set(key.value, value)
    }

    // update collection
    this._collection.set(identifier, previous)

    // persist to storage
    this.persist()
    return previous
  }

  /**
   * Delete an entity
   * @param {string} identifier
   * @return {boolean} Whether an element was deleted
   */
  public delete(identifier: string): boolean {
    // require existing
    if (!this.find(identifier)) {
      throw new Error('Peer with host \'' + identifier + '\' does not exist.')
    }

    // update collection
    if(! this._collection.delete(identifier)) {
      return false
    }

    // persist to storage
    this.persist()
    return true
  }
  /// end-region implements IRepository
}

/*
import {Store} from 'vuex'
import {
  BlockInfo,
  BlockHttp,
  ChainHttp,
  MosaicAliasTransaction,
  MosaicDefinitionTransaction,
  NamespaceService,
  NamespaceHttp,
  Namespace,
  QueryParams,
  TransactionType,
} from 'nem2-sdk'

// internal dependencies
import {AppState, AppMosaic, NetworkProperties} from '@/core/model'
import {NoticeType} from '@/core/model'
import {NotificationType} from '@/core/utils/NotificationType'
import {eventBus} from '../main'

export class PeersRepository  {
  private endpoint: string = null
  private generationHash: string = null

  private constructor(
    private store: Store<AppState>,
    private networkProperties: NetworkProperties,
  ) {}

  public static create(store: Store<AppState>) {
    return new PeersRepository(
      store,
      store.state.app.networkProperties,
    )
  }

  public async switchEndpoint(endpoint: string): Promise<void> {
    try {
      this.networkProperties.setLoadingToTrue(endpoint)
      const initialGenerationHash = `${this.generationHash}`
      this.endpoint = endpoint
      this.blockHttp = new BlockHttp(endpoint)
      this.namespaceHttp = new NamespaceHttp(endpoint)
      this.namespaceService = new NamespaceService(this.namespaceHttp)
      this.chainHttp = new ChainHttp(endpoint)

      this.setNodeInfoAndHealth()
      await this.setLatestBlocks()
      this.store.commit('TRIGGER_NOTICE', {
        message: NotificationType.NODE_CONNECTION_SUCCEEDED,
        type: 'success',
      )
      if (initialGenerationHash !== this.generationHash) await this.switchGenerationHash()
    } catch (error) {
      this.networkProperties.setHealthyToFalse(endpoint)
    }
  }

  private reset(endpoint: string) {
    if (endpoint !== this.endpoint) return
    Notice.trigger(NotificationType.NODE_CONNECTION_ERROR, NoticeType.error, this.store)
    this.networkProperties.reset(endpoint)
    this.generationHash = null
    this.endpoint = null
  }

  private setNodeInfoAndHealth(): void {
    const currentEndpoint = `${this.endpoint}`
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this

    this.blockHttp
      .getBlockByHeight('1')
      .subscribe(
        (block: BlockInfo) => {
          that.generationHash = block.generationHash
          that.networkProperties.setValuesFromFirstBlock(block, currentEndpoint)
        },
        (error: Error) => {
          that.reset(currentEndpoint)
          return error
        })
  }

  private async setLatestBlocks() {
    const currentEndpoint = `${this.endpoint}`
    const heightUint = await this.chainHttp.getBlockchainHeight().toPromise()
    const height = heightUint.compact()
    const blocksInfo = await this.blockHttp.getBlocksByHeightWithLimit(
      `${height}`, 100,
    ).toPromise()
    this.networkProperties.initializeLatestBlocks(blocksInfo, currentEndpoint)
  }

  private async switchGenerationHash(): Promise<void> {
    await this.setNetworkMosaics()
    eventBus.$emit('onWalletChange', this.store)
    await this.store.dispatch('SET_ACCOUNTS_BALANCES')
  }

  private async setNetworkMosaics(): Promise<void> {
    const {store} = this
    const currentEndpoint = `${this.endpoint}`
    const firstTx = await this.blockHttp.getBlockTransactions('1', new QueryParams(100)).toPromise()
    const mosaicDefinitionTx: any[] = firstTx.filter(({type}) => type === TransactionType.MOSAIC_DEFINITION)
    const mosaicAliasTx: any[] = firstTx.filter(({type}) => type === TransactionType.MOSAIC_ALIAS)
    const [firstAliasTx]: any = mosaicAliasTx
    const [firstMosaicDefinitionTx]: any = mosaicDefinitionTx
    const networkCurrencyNamespace = await this.namespaceService.namespace(firstAliasTx.namespaceId).toPromise()

    store.dispatch('SET_NETWORK_CURRENCY', {
      networkCurrency: {
        hex: firstMosaicDefinitionTx.mosaicId.toHex(),
        divisibility: firstMosaicDefinitionTx.divisibility,
        ticker: networkCurrencyNamespace.name.split('.')[1].toUpperCase(),
        name: networkCurrencyNamespace.name,
      },
      endpoint: currentEndpoint,
    })

    const secondAliasTx: MosaicAliasTransaction = mosaicAliasTx.length > 1 ? mosaicAliasTx[1] : null
    const secondDefinitionTx: MosaicDefinitionTransaction = mosaicAliasTx.length > 1
      ? mosaicDefinitionTx[1] : null

    const harvestMosaicNamespace: Namespace = mosaicAliasTx.length > 1
      ? await this.namespaceService.namespace(secondAliasTx.namespaceId).toPromise()
      : null

    const appMosaics = [
      AppMosaic.fromGetCurrentNetworkMosaic(firstMosaicDefinitionTx, networkCurrencyNamespace),
    ]

    if (secondAliasTx && harvestMosaicNamespace) {
      appMosaics.push(
        AppMosaic.fromGetCurrentNetworkMosaic(secondDefinitionTx, harvestMosaicNamespace),
      )
    }

    store.dispatch('UPDATE_MOSAICS', {appMosaics, currentEndpoint})
    store.dispatch('SET_NETWORK_MOSAICS', {appMosaics, currentEndpoint})
  }
}
*/
