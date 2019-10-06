import {QueryParams, TransactionType, NamespaceService, NamespaceHttp, ChainHttp, BlockHttp, Transaction, MosaicDefinitionTransaction, AliasTransaction, MosaicAliasTransaction, Mosaic, Namespace} from "nem2-sdk"
import {Message} from "@/config/index.ts"
import {AppMosaic, ChainStatus, AppState} from '@/core/model'
import {Store} from 'vuex'

export const getNetworkGenerationHash = async (node: string, that: any): Promise<void> => {
    try {
        const block = await new BlockHttp(node).getBlockByHeight(1).toPromise()
        that.$store.commit('SET_IS_NODE_HEALTHY', true)
        that.$Notice.success({
            title: that.$t(Message.NODE_CONNECTION_SUCCEEDED) + ''
        })
        that.$store.commit('SET_GENERATION_HASH', block.generationHash)
    } catch (error) {
        console.error(error)
        that.$Notice.error({
            title: that.$t(Message.NODE_CONNECTION_ERROR) + ''
        })
        that.$store.commit('SET_IS_NODE_HEALTHY', false)
    }
}

/**
 * Retrieves and handle data about cat.currency and eventual cat.harvest
 * In the first block's transactions
 */
export const getCurrentNetworkMosaic = async (currentNode: string, store: Store<AppState>) => {
    try {
        const genesisBlockInfoList = await new BlockHttp(currentNode)
            .getBlockTransactions(1, new QueryParams(100))
            .toPromise()

        const mosaicDefinitionTx: any[] = genesisBlockInfoList
            .filter(({type}) => type === TransactionType.MOSAIC_DEFINITION)

        if (!mosaicDefinitionTx.length) {
            throw new Error('Did not find the network currency definition transaction')
        }

        const mosaicAliasTx: any[] = genesisBlockInfoList
            .filter(({type}) => type === TransactionType.MOSAIC_ALIAS)

        if (!mosaicAliasTx.length) {
            throw new Error('Did not find the network currency namespace alias transaction')
        }
        
        const [networkCurrencyAliasTx]: any = mosaicAliasTx
        const [networkMosaicDefinitionTx]: any = mosaicDefinitionTx
        const networkMosaicNamespace = await new NamespaceService(new NamespaceHttp(currentNode))
            .namespace(networkCurrencyAliasTx.namespaceId).toPromise()
        
        store.commit('SET_NETWORK_CURRENCY', {
            hex: networkMosaicDefinitionTx.mosaicId.toHex(),
            divisibility: networkMosaicDefinitionTx.divisibility,
            ticker: networkMosaicNamespace.name.split('.')[1].toUpperCase(),
            name: networkMosaicNamespace.name,
        })

        const [, harvestCurrencyAliasTx]: any | false = mosaicAliasTx.length > 1 ? mosaicAliasTx : false
        const [, harvestMosaicDefinitionTx]: any | false = mosaicAliasTx.length > 1 ? mosaicDefinitionTx : false
        const harvestMosaicNamespace: Namespace | false = mosaicAliasTx.length > 1
            ? await new NamespaceService(new NamespaceHttp(currentNode))
                .namespace(harvestCurrencyAliasTx.namespaceId).toPromise()
            : false
        
        const appMosaics = [
            AppMosaic.fromGetCurrentNetworkMosaic(networkMosaicDefinitionTx, networkMosaicNamespace.name)
        ]

        if (harvestCurrencyAliasTx && harvestMosaicNamespace) appMosaics.push(
            AppMosaic.fromGetCurrentNetworkMosaic(harvestMosaicDefinitionTx, harvestMosaicNamespace.name)
        )

        store.commit('UPDATE_MOSAICS', appMosaics)
        store.commit('SET_NETWORK_MOSAICS', appMosaics)
    } catch (error) {
        store.commit('SET_IS_NODE_HEALTHY', false)
    }
}

// TODO remove from here
export const getCurrentBlockHeight = async (store: Store<AppState>) => {
    try {
        const {node} = store.state.account
        const heightUint = await new ChainHttp(node).getBlockchainHeight().toPromise()
        const height = heightUint.compact()
        store.commit('SET_CHAIN_HEIGHT', height)
        const blockInfo = await new BlockHttp(node).getBlockByHeight(height).toPromise()
        store.commit('SET_CHAIN_STATUS', new ChainStatus(blockInfo))
    } catch (error) {
        store.commit('SET_CHAIN_HEIGHT', 0)
    }
}
