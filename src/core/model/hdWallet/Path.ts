import {APP_PARAMS} from '@/config'

const {MAX_SEED_WALLETS_NUMBER, MAX_REMOTE_ACCOUNT_CHECKS} = APP_PARAMS
const availableSeedIndexes = [...Array(MAX_SEED_WALLETS_NUMBER).keys()]
const availableRemoteIndexes = [...Array(MAX_REMOTE_ACCOUNT_CHECKS + 1).keys()]

export class Path {
  static getFromSeedIndex(seedIndex: number): string {
    return new Path().getFromIndexes(seedIndex, 0)
  }

  static getRemoteAccountPath(
    seedWalletPath: string,
    remotePathIndex: number,
  ): string {
    const path = new Path()
    path.validatePath(seedWalletPath)
    
    if (remotePathIndex === 0) {
      throw new Error('The remote path index can not be 0')
    }

    path.validateIndexes(0, remotePathIndex)
    const seedIndex = path.getPathNumberFromPath(seedWalletPath)
    return path.getFromIndexes(seedIndex, remotePathIndex)
  }

  private getFromIndexes(seedIndex: number, remotePathIndex: number): string {
    this.validateIndexes(seedIndex, remotePathIndex)
    return `m/44'/43'/${seedIndex}'/${remotePathIndex}'/0'`
  }

  private getPathNumberFromPath = (path: string): number => {
    return parseInt(path.substring(10, 11), 10)
  }

  private validatePath(path: string): void {
    if (
      typeof path !== 'string'
      || path.length !== 18
    ) { 
      throw new Error(`invalid path: ${path}`)
    }
  }

  private validateIndexes(seedIndex: number, remotePathIndex: number): void {
    if (availableSeedIndexes.indexOf(seedIndex) === -1) {
      throw new Error(`invalid seedIndex: ${seedIndex}`)
    }

    if (availableRemoteIndexes.indexOf(remotePathIndex) === -1) {
      throw new Error(`invalid remotePathIndex: ${remotePathIndex}`)
    }
  }
}
