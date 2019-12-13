import {
   ChainHttp, BlockHttp, QueryParams, TransactionType, NamespaceService, NamespaceHttp,
   MosaicAliasTransaction, MosaicDefinitionTransaction, Namespace, NetworkType, NodeHttp, BlockInfo,
} from 'nem2-sdk'
import {Store} from 'vuex'
import {AppState, Notice, AppMosaic, ChainStatus} from '.'
import {NoticeType} from './Notice'
import {Message} from "@/config"

export class Network {
   blockHttp: BlockHttp
   namespaceHttp: NamespaceHttp
   namespaceService: NamespaceService
   chainHttp: ChainHttp
   nodeHttp: NodeHttp

   private constructor(
      private endpoint: string,
      private generationHash: string,
      private store: Store<AppState>,
   ) {}

   public static create(store: Store<AppState>) {
      return new Network(null, null, store)
   }

   public async switchNode(endpoint: string): Promise<void> {
      try {
         this.store.dispatch('SET_NODE_LOADING', {endpoint, nodeLoading: true})
         const initialGenerationHash = `${this.generationHash}`
         this.endpoint = endpoint
         this.blockHttp = new BlockHttp(endpoint)
         this.namespaceHttp = new NamespaceHttp(endpoint)
         this.namespaceService = new NamespaceService(this.namespaceHttp)
         this.chainHttp = new ChainHttp(endpoint)
         this.nodeHttp = new NodeHttp(endpoint)

         this.setGenerationHashAndNodeHealth()

         await Promise.all([
            this.setChainHeight(),
            this.setNodeNetworkType(),
         ])

         this.declareConnectionSuccessful(endpoint)

         if (initialGenerationHash !== this.generationHash) await this.switchGenerationHash()
      } catch (error) {
         console.error("Network -> error", error)
      }
   }

   private reset(endpoint: string) {
      console.log("TCL: Network -> reset -> endpoint !== this.endpoint", endpoint, this.endpoint)
      if (endpoint !== this.endpoint) return

      Notice.trigger(Message.NODE_CONNECTION_ERROR, NoticeType.error, this.store)
      this.store.dispatch('SET_IS_NODE_HEALTHY', {endpoint, isNodeHealthy: false})
      this.store.dispatch('SET_GENERATION_HASH', {endpoint, generationHash: 'error'})
      this.store.dispatch('SET_NODE_NETWORK_TYPE', {endpoint, nodeNetworkType: null})
      this.store.dispatch('SET_CHAIN_STATUS', {endpoint, chainStatus: ChainStatus.getDefault()})
      this.store.dispatch('SET_NODE_LOADING', {endpoint, nodeLoading: false})
      this.generationHash = null
      this.endpoint = null
   }

   private setGenerationHashAndNodeHealth(): void {
      const {store, endpoint} = this
      const currentEndpoint = `${endpoint}`
      const that = this

      this.blockHttp
         .getBlockByHeight('1')
         .subscribe(
            (block: BlockInfo) => {
               const {generationHash} = block
               this.generationHash = generationHash
               store.dispatch('SET_GENERATION_HASH', {endpoint, generationHash})
            },
            (error: Error) => {
               that.reset(currentEndpoint)
               return error
            })
   }

   private async setChainHeight() {
      const currentEndpoint = `${this.endpoint}`
      const heightUint = await this.chainHttp.getBlockchainHeight().toPromise()
      const height = heightUint.compact()
      const blockInfo = await this.blockHttp.getBlockByHeight(`${height}`).toPromise()
      this.store.dispatch('SET_CHAIN_STATUS', {endpoint: currentEndpoint, chainStatus: new ChainStatus(blockInfo)})
   }

   private async setNodeNetworkType(): Promise<void> {
      // @TODO: When SDK BlockHttp network type issue is fixed
      // Can skip this network call by setting the networkType from the first block's data instead
      // https://github.com/nemtech/nem2-sdk-typescript-javascript/issues/367
      const {store} = this
      const currentEndpoint = `${this.endpoint}`
      const nodeInfo = await this.nodeHttp.getNodeInfo().toPromise()
      const {networkIdentifier} = nodeInfo
      store.dispatch('SET_NODE_NETWORK_TYPE', {endpoint: currentEndpoint, nodeNetworkType: networkIdentifier})
   }

   private declareConnectionSuccessful(endpoint) {
      const {store} = this
      Notice.trigger(Message.NODE_CONNECTION_SUCCEEDED, NoticeType.success, store)
      store.dispatch('SET_IS_NODE_HEALTHY', {endpoint, isNodeHealthy: true})
      store.dispatch('SET_NODE_LOADING', {endpoint, nodeLoading: false})
   }

   private async switchGenerationHash(): Promise<void> {
      await this.setNetworkMosaics()
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
         AppMosaic.fromGetCurrentNetworkMosaic(firstMosaicDefinitionTx, networkCurrencyNamespace)
      ]

      if (secondAliasTx && harvestMosaicNamespace) {
         appMosaics.push(
            AppMosaic.fromGetCurrentNetworkMosaic(secondDefinitionTx, harvestMosaicNamespace)
         )
      }

      store.dispatch('UPDATE_MOSAICS', {appMosaics, currentEndpoint})
      store.dispatch('SET_NETWORK_MOSAICS', {appMosaics, currentEndpoint})
   }
}
