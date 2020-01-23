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
import {MosaicId, MosaicInfo, AccountInfo} from 'nem2-sdk'

// internal dependencies
import {AbstractService} from './AbstractService'

export class MosaicService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'mosaic'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store: Store<any>) {
    super(store)
  }

  /**
   * Read mosaic info from store or dispatch fetch action.
   * @param {MosaicId} mosaicId 
   * @return {Promise<MosaicInfo>}
   */
  public async getMosaicInfo(
    mosaicId: MosaicId 
  ): Promise<MosaicInfo> {
    // - get infos from store
    const mosaics = this.$store.getters['mosaic/mosaicsInfo']
    let mosaicInfo: MosaicInfo

    // - if store doesn't know this mosaic, dispatch fetch action
    if (! mosaics.hasOwnProperty(mosaicId.toHex())) {
      // dispatch store REST_FETCH_INFOS
      mosaicInfo = await this.$store.dispatch('mosaic/REST_FETCH_INFOS', [mosaicId])
    }
    // - read from store
    else mosaicInfo = mosaics[mosaicId.toHex()]

    return mosaicInfo
  }

  /**
   * Format a mosaic amount to relative format
   * @param {number} amount 
   * @param {MosaicId} mosaic 
   * @return {Promise<number>}
   */
  public async getRelativeAmount(
    amount: number,
    mosaic: MosaicId
  ): Promise<number> {
    const info = await this.getMosaicInfo(mosaic)
    return amount / Math.pow(10, info.divisibility)
  }

  /**
   * Get list of balances mapped by address
   * @param {AccountInfo[]} accountsInfo 
   * @param {MosaicId} mosaic 
   * @return {any}  Object with address as key and balance as value
   */
  public mapBalanceByAddress(
    accountsInfo: AccountInfo[],
    mosaic: MosaicId,
  ): any {
    return accountsInfo.map(({mosaics, address}) => {
      // - check balance
      const hasNetworkMosaic = mosaics.find(
        mosaicOwned => mosaicOwned.id.equals(mosaic))

      // - account doesn't hold network mosaic
      if (hasNetworkMosaic === undefined) {
        return null
      }

      // - map balance to address
      const balance = hasNetworkMosaic.amount.compact()
      return {
        address: address.plain(),
        balance: this.getRelativeAmount(balance, mosaic),
      }
    })
    .reduce((acc, {address, balance}) => ({...acc, [address]: balance}), {})
  }
}
