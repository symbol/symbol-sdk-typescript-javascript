import {from as observableFrom} from "rxjs"
import {BlockHttp, ChainHttp} from 'nem2-sdk'


export class BlockApiRxjs {

    /**
     *  getBlockByHeight
     * @param node
     * @param height
     */
    public getBlockByHeight(node: string, height: number) {
        return observableFrom(new BlockHttp(node).getBlockByHeight(height))
    }

    /**
     *  getBlocksByHeightWithLimit
     * @param node
     * @param height
     * @param limit
     */
    public getBlocksByHeightWithLimit(node: string, height: number, limit: number) {
        return observableFrom(new BlockHttp(node).getBlocksByHeightWithLimit(height, limit))
    }

    /**
     *  getBlockTransactions
     * @param node
     * @param height
     * @param queryParams
     */
    public getBlockTransactions(node: string, height: number, queryParams: any) {
        return observableFrom(new BlockHttp(node).getBlockTransactions(height, queryParams))
    }

    // get current block height
    getBlockchainHeight(node: string) {
        return (new ChainHttp(node).getBlockchainHeight())
    }

}
