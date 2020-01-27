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
import {Mosaic, NamespaceId, MosaicId} from 'nem2-sdk'

// internal dependencies
import {Formatters} from '@/core/utils/Formatters'

export class MosaicHelpers {
  /**
   * Transforms an array of mosaics to an inline representation,
   * setting networkCurrency as the first item
   * eg: nem.xem (1,000), 04d3372253f1bb69 (2,123)
   * @param mosaics
   * @param store
   */
  public static getAppMosaicHex = (hex: string, store: Store<any>): string => {
    const {mosaics} = store.state.account
    if (mosaics[hex]) return hex
    const appMosaicFromHex: any = Object.values(mosaics).find(({namespaceHex}) => hex === namespaceHex)
    if (appMosaicFromHex === undefined) return hex
    return appMosaicFromHex.hex
  }

  // @TODO: remove in favour of namespace method
  public static getNamespaceNameFromNamespaceId = (hexId: string, store: Store<any>) => {
    const {namespaces} = store.state.account
    const namespace = namespaces.find(({ hex }) => hex === hexId)
    if (namespace === undefined) return hexId
    return namespace.name
  }

  public static getName = (appMosaic: AppMosaic, mosaicId: MosaicId | NamespaceId, store: Store<any>): string => {
    if (appMosaic && appMosaic.name) return appMosaic.name
    if (mosaicId instanceof NamespaceId) return MosaicHelpers.getNamespaceNameFromNamespaceId(mosaicId.id.toHex(), store)
    return appMosaic.hex || 'N/A'
  }

  public static getRelativeMosaicAmount = (amount: number, divisibility: number) => {
    if (!amount) return 0
    return amount / Math.pow(10, divisibility)
  }

  public static renderMosaicsAndReturnArray = (
    mosaics: Mosaic[],
    store: Store<any>): {name: string, amount: string, hex: string}[] => {
    if (!mosaics.length) return null
          
    const mosaicList = store.state.account.mosaics

    const items = mosaics
      .map((mosaic) => {
        const hex = mosaic.id.toHex()
        const appMosaicHex = MosaicHelpers.getAppMosaicHex(hex, store)
              
        if (!mosaicList[appMosaicHex] || !mosaicList[appMosaicHex].properties) return
        const appMosaic = mosaicList[appMosaicHex]
        const name = MosaicHelpers.getName(appMosaic, mosaic.id, store)
        const amount = Formatters.formatNumber(
          MosaicHelpers.getRelativeMosaicAmount(
            mosaic.amount.compact(),
            appMosaic.properties.divisibility
        ))

        return {name, amount, hex: appMosaicHex}
      })
      .filter(x => x)

    if (!items.length) return null

    const networkMosaicIndex = items.findIndex(({name}) => name === store.state.account.networkCurrency.name)
    if (networkMosaicIndex <= 0) {
      return items
    }
    const networkCurrency = items.splice(networkMosaicIndex, 1)
    items.unshift(networkCurrency[0])
    return items
  }

  public static renderMosaics = (
    mosaics: Mosaic[],
    store: Store<any>,
    isReceipt: boolean): any => {
    const result = MosaicHelpers.renderMosaicsAndReturnArray(mosaics, store)
    if (!result) return 'N/A'
    // @TODO: review
    if (!result.length) return null
    const prefix = isReceipt ? '' : '-'
    return result.map(({name, amount}) => `${prefix}${amount} [${name}]`).join(', ')
  }

  public static getAbsoluteMosaicAmount = (amount: number, divisibility: number) => {
    if (!amount) return 0
    return amount * Math.pow(10, divisibility)
  }

  /**
   * Transforms an array of mosaics to an inline representation,
   * setting networkCurrency as the first item
   * eg: nem.xem, 04d3372253f1bb69
   * @param mosaics
   * @param store
   */
  public static renderMosaicNames = (mosaics: Mosaic[],
    store: Store<any>): string => {
    const mosaicList = store.state.account.mosaics
    const items = mosaics
      .map(mosaic => {
        const hex = mosaic.id.toHex()
        const appMosaicHex = MosaicHelpers.getAppMosaicHex(hex, store)
        if (!mosaicList[appMosaicHex] || !mosaicList[appMosaicHex].properties) return
        const appMosaic = mosaicList[appMosaicHex]
        return MosaicHelpers.getName(appMosaic, mosaic.id, store)
      })
      .filter(x => x)

    if (!items.length) return 'N/A'
    const networkMosaicIndex = items.indexOf(store.state.account.networkCurrency.name)
    if (networkMosaicIndex <= 0) return items.join(', ')
    const networkCurrency = items.splice(networkMosaicIndex, 1)
    items.unshift(networkCurrency[0])
    return items.join(', ')
  }

  /**
   * Returns a relative amount as relativeAmount.toLocaleString()
   * @param mosaics
   * @param mosaicList
   */
  public static renderMosaicAmount = (mosaics: Mosaic[], mosaicList: AppMosaic[], store: Store<any>): string => {
    if (!mosaics.length) return '0'
    if (mosaics.length > 1) return 'mix'
    const hex = mosaics[0].id.toHex()
    const appMosaicHex = MosaicHelpers.getAppMosaicHex(hex, store)
    if (!mosaicList[appMosaicHex] || !mosaicList[appMosaicHex].properties) return 'Loading...'
    const appMosaic = mosaicList[appMosaicHex]
    return Formatters.formatNumber(
      MosaicHelpers.getRelativeMosaicAmount(
        mosaics[0].amount.compact(),
        appMosaic.properties.divisibility
    ))
  }
}
