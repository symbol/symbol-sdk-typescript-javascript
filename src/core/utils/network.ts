import {QueryParams, TransactionType, NamespaceService, NamespaceHttp, ChainHttp, BlockHttp, Transaction, MosaicDefinitionTransaction, AliasTransaction, MosaicAliasTransaction} from "nem2-sdk"
import {BlockApiRxjs} from '@/core/api/BlockApiRxjs.ts'
import {Message} from "@/config/index.ts"
import {AppMosaic, ChainStatus, AppState} from '@/core/model'
import { Store } from 'vuex'

export const getNetworkGenerationHash = async (node: string, that: any): Promise<void> => {
    try {
        that.$store.commit('SET_IS_NODE_HEALTHY', false)
        const block = await new BlockApiRxjs().getBlockByHeight(node, 1).toPromise()
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
 * get current network mosaic hex by Genesis Block Info
 */

// @TODO: 100 transactions might not bee the ideal number
// Check if it can be reduced, convert to rxjs subscription, eventually with the expand operator
export const getCurrentNetworkMosaic = async (currentNode: string, store: Store<AppState>) => {
    try {
        const genesisBlockInfoList = await new BlockApiRxjs()
            .getBlockTransactions(currentNode, 1, new QueryParams(100))
            .toPromise()

        const mosaicDefinitionTx: Transaction = genesisBlockInfoList
            .find(({type}) => type === TransactionType.MOSAIC_DEFINITION)

        if (mosaicDefinitionTx === undefined
            || !(mosaicDefinitionTx instanceof MosaicDefinitionTransaction)) {
            throw new Error('Did not find the network currency definition transaction')
        }

        const mosaicAliasTx: Transaction = genesisBlockInfoList
            .find(({type}) => type === TransactionType.MOSAIC_ALIAS)

        if (mosaicAliasTx === undefined || !(mosaicAliasTx instanceof MosaicAliasTransaction)) {
            throw new Error('Did not find the network currency namespace alias transaction')
        }

        const networkNamespace = await new NamespaceService(new NamespaceHttp(currentNode))
            .namespace(mosaicAliasTx.namespaceId).toPromise()

        store.commit('SET_NETWORK_MOSAIC', {
            hex: mosaicDefinitionTx.mosaicId.toHex(),
            divisibility: mosaicDefinitionTx.mosaicProperties.divisibility,
            ticker: networkNamespace.name.split('.')[1].toUpperCase(),
            name: networkNamespace.name,
        })

        const appMosaic = AppMosaic.fromGetCurrentNetworkMosaic(mosaicDefinitionTx, networkNamespace.name)
        await store.commit('UPDATE_MOSAICS', [appMosaic])
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
