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
  constructor(store?: Store<any>) {
    super()
    this.$store = store
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
      mosaicInfo = await this.$store.dispatch('mosaic/REST_FETCH_INFO', mosaicId)
    }
    // - read from store
    else mosaicInfo = mosaics[mosaicId.toHex()]

    //XXX save in storage

    return mosaicInfo
  }

  /**
   * Read the name of a mosaic with id \a mosaic
   * @param {MosaicId} mosaic 
   * @return {Promise<string>}
   */
  public async getMosaicName(mosaic: MosaicId): Promise<string> {
    // - get names from store
    const names = this.$store.getters['mosaic/mosaicsNames']
    let mosaicName: any

    // - if store doesn't know a name for this mosaics, dispatch fetch action
    if (! names.hasOwnProperty(mosaic.toHex())) {
      const mapped = await this.$store.dispatch('mosaic/REST_FETCH_NAMES', [mosaic])
      const entry = mapped.find(e => e.hex === mosaic.toHex())
      mosaicName = undefined === entry ? mosaic.toHex() : entry.name
    }
    // - read from store
    else mosaicName = names[mosaic.toHex()]

    //XXX save in storage

    return mosaicName.hasOwnProperty('namespaceId')
         ? mosaicName.namespaceId.fullName
         : mosaicName
  }

  /**
   * Format a mosaic amount to relative format
   * @param {number} amount 
   * @param {MosaicId} mosaic 
   * @return {Promise<number>}
   */
  public async getRelativeAmount(
    amount: number,
    mosaic: MosaicId,
    mosaicInfo?: MosaicInfo,
  ): Promise<number> {
    let info = mosaicInfo
    if (info === undefined) {
      info = await this.getMosaicInfo(mosaic)
    }

    return amount / Math.pow(10, info.divisibility || 0)
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
