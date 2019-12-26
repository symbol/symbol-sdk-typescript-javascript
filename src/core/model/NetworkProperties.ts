import {BlockInfo, NetworkType} from 'nem2-sdk'
import {Store} from 'vuex'
import {networkConfig, defaultNodeList, NETWORK_CONSTANTS} from '@/config'
import {formatTimestamp} from '@/core/utils'
import {AppState} from '.'

const {maxRollbackBlocks, defaultDynamicFeeMultiplier} = networkConfig

export class OfflineSettingsParams {
  generationHash: string
}

export class NetworkProperties {
  fee: number = defaultDynamicFeeMultiplier
  generationHash: string
  healthy: boolean
  height: number
  lastBlock: BlockInfo
  lastBlocks: BlockInfo[]
  lastBlockTimestamp: number
  loading: boolean
  networkType: NetworkType
  nodeNumber: number = defaultNodeList.length
  numTransactions: number
  signerPublicKey: string
  targetBlockTime: number = networkConfig.targetBlockTime

  private constructor(private readonly store: Store<AppState>) {}

  public static create(store: Store<AppState>) {
    const networkType = new NetworkProperties(store)
    networkType.setValuesToDefault()
    return networkType
  }

  reset(endpoint: string) {
    this.setValuesToDefault()
    this.healthy = false
    this.dispatchChanges(endpoint)
  }

  private setValuesToDefault() {
    this.fee = defaultDynamicFeeMultiplier
    this.generationHash = null
    this.healthy = true
    this.height = 0
    this.lastBlock = null
    this.lastBlocks = null
    this.lastBlockTimestamp = 0
    this.loading = false
    this.networkType = null
    this.numTransactions = 0
    this.signerPublicKey = ''
  }

  setLoadingToTrue(endpoint: string) {
    this.loading = true
    this.dispatchChanges(endpoint)
  }  

  setHealthyToFalse(endpoint: string) {
    this.healthy = false
    this.loading = false
    this.dispatchChanges(endpoint)
  }

  setValuesFromFirstBlock(block: BlockInfo, endpoint: string) {
    this.generationHash = block.generationHash
    this.networkType = block.networkType
    this.healthy = true
    this.loading = false
    this.dispatchChanges(endpoint)
  }

  initializeLatestBlocks(blocks: BlockInfo[], endpoint: string) {
    this.lastBlocks = blocks
    this.setLastBlock(blocks[blocks.length - 1], endpoint)
    this.setNetworkFee(endpoint)
  }

  // @TODO: Handle the case when the network was not properly initialized,
  // Then connection dropped, and came back up afterwards
  private setLastBlock(block: BlockInfo, endpoint: string) {
    this.lastBlock = block
    this.height = block.height.compact()
    this.numTransactions = block.numTransactions
    this.signerPublicKey = block.signer.publicKey
    this.lastBlockTimestamp = block.timestamp.compact()
    this.dispatchChanges(endpoint)
  }

  handleLastBlock(block: BlockInfo, endpoint: string) {
    this.setLastBlock(block, endpoint)
    if (this.lastBlocks.length > maxRollbackBlocks) this.lastBlocks.length = maxRollbackBlocks - 1
    this.lastBlocks.unshift(block)
    this.setNetworkFee(endpoint)
  }

  private setNetworkFee(endpoint: string) {
    this.fee = this.getMedianFee(this.getBlockFeeMultipliers())
    this.dispatchChanges(endpoint)
  }

  private getBlockFeeMultipliers() {
    return this.lastBlocks.map(({feeMultiplier}) => feeMultiplier > 0 ? feeMultiplier : defaultDynamicFeeMultiplier)
  }

  private getMedianFee(blockFeeMultipliers: number[]): number {
    const mid = Math.floor(blockFeeMultipliers.length / 2)
    const nums = [...blockFeeMultipliers].sort((a, b) => a - b)
    return blockFeeMultipliers.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
  }

  getTimeFromBlockNumber(blockNumber: number): string {
    const highestBlockTimestamp = Math.round(this.lastBlockTimestamp / 1000)
            + NETWORK_CONSTANTS.NEMESIS_BLOCK_TIMESTAMP

    const numberOfBlock = blockNumber - this.height
    return formatTimestamp((numberOfBlock * this.targetBlockTime + highestBlockTimestamp) * 1000)
  }

  private dispatchChanges(endpoint: string) {
    this.store.dispatch('SET_NETWORK_PROPERTIES', {endpoint, NetworkProperties: this})
  }

  updateFromOfflineSettings(offlineSettingsParams: OfflineSettingsParams, endpoint: string) {
    this.generationHash = offlineSettingsParams.generationHash
    this.dispatchChanges(endpoint)
  }
}