import {BlockInfo} from 'nem2-sdk';
import {nodeListConfig} from "@/config/view/node";
import {networkConfig, NETWORK_CONSTANTS} from '@/config/index'
import {formatTimestamp} from '@/core/utils'

export class ChainStatus {
    numTransactions: number
    signerPublicKey: string
    currentHeight: number // @TODO: rename
    nodeNumber: number
    targetBlockTime: number
    height: number
    timestamp: number

    constructor(block?: BlockInfo) {
        this.numTransactions = block.numTransactions ? block.numTransactions : 0
        this.signerPublicKey = block.signer.publicKey
        this.currentHeight = block.height.compact()
        this.nodeNumber = nodeListConfig.length
        this.targetBlockTime = networkConfig.targetBlockTime
        this.height = block.height.compact()
        this.timestamp = block.timestamp.compact()
    }

    static getDefault(): ChainStatus {
        return {
            numTransactions: 0,
            signerPublicKey: '',
            currentHeight: 0,
            nodeNumber: nodeListConfig.length,
            targetBlockTime: networkConfig.targetBlockTime,
            height: 0,
            timestamp: 0,
            getTimeFromBlockNumber: function() { return null }
        }
    }

    getTimeFromBlockNumber(blockNumber: number): string {
        const highestBlockTimestamp = Math.round(this.timestamp / 1000) + NETWORK_CONSTANTS.NEMESIS_BLOCK_TIMESTAMP
        const numberOfBlock = blockNumber - this.height
        return formatTimestamp((numberOfBlock * this.targetBlockTime + highestBlockTimestamp) * 1000)
    }
}
