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
  blockHttp: BlockHttp
  namespaceHttp: NamespaceHttp
  namespaceService: NamespaceService
  chainHttp: ChainHttp
  private endpoint: string = null
  private generationHash: string = null

  private constructor(
    private store: Store<AppState>,
    private networkProperties: NetworkProperties,
  ) {}

  public static create(store: Store<AppState>) {
    return new NetworkManager(
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
