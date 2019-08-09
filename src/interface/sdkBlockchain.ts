import {SdkV0} from './sdkDefine'
import { BlockHttp, ChainHttp } from 'nem2-sdk'

export const blockchainInterface:SdkV0.blockchain = {

  getBlockByHeight: async (params) => {
    const node = params.node
    const height = params.height
    const blockchain = await new BlockHttp(node).getBlockByHeight(height)
    return {
      result: {
        Block: blockchain
      }
    }
  },

  getBlocksByHeightWithLimit: async (params) => {
    const node = params.node
    const firstHeight = params.height
    const limit = params.limit
    const blocks = await new BlockHttp(node).getBlocksByHeightWithLimit(firstHeight, limit)
    return {
      result: {
        Blocks: blocks
      }
    }
  },

  getBlockTransactions: async (params) => {
    const node = params.node
    const height = params.height
    const queryParams = params.queryParams
    const blockTransactions = await new BlockHttp(node).getBlockTransactions(height, queryParams)
    return {
      result: {
        blockTransactions: blockTransactions
      }
    }
  },

  getBlockchainHeight: async (params) => {
    const node = params.node
    const blockchainHeight = await new ChainHttp(node).getBlockchainHeight()
    return {
      result: {
        blockchainHeight: blockchainHeight
      }
    }
  }
}
