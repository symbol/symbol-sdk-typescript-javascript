import {Mosaic} from "nem2-sdk"
import {AppMosaic, AppState} from '@/core/model'
import {Store} from 'vuex'

/**
 * Transforms an array of mosaics to an inline representation,
 * setting networkCurrency as the first item
 * eg: nem.xem (1,000), 04d3372253f1bb69 (2,123)
 * @param mosaics
 * @param store
 */

const getAppMosaicHex = (hex: string, store: Store<AppState>): string => {
  const {mosaics} = store.state.account
  if (mosaics[hex]) return hex
  const appMosaicFromHex = Object.values(mosaics).find(({namespaceHex}) => hex === namespaceHex)
  if (appMosaicFromHex === undefined) return hex
  return appMosaicFromHex.hex
}

export const renderMosaicsAndReturnArray = (
    mosaics: Mosaic[],
    store: Store<AppState>): {name: string, amount: string, hex: string}[] | 'Loading...' => {
    const mosaicList = store.state.account.mosaics

    const items = mosaics
        .map((mosaic) => {
            const hex = mosaic.id.toHex()
            const appMosaicHex = getAppMosaicHex(hex, store)
            
            if (!mosaicList[appMosaicHex] || !mosaicList[appMosaicHex].properties) return
            const appMosaic = mosaicList[appMosaicHex]
            const name = appMosaic.name || hex
            const amount = getRelativeMosaicAmount(mosaic.amount.compact(), appMosaic.properties.divisibility)
                .toLocaleString()

            return {name, amount, hex: appMosaicHex}
        })
        .filter(x => x)

    if (!items.length) return 'Loading...'

    const networkMosaicIndex = items.findIndex(({name}) => name === store.state.account.networkCurrency.name)
    if (networkMosaicIndex <= 0) {
        return items
    }
    const networkCurrency = items.splice(networkMosaicIndex, 1)
    items.unshift(networkCurrency[0])
    return items
}

export const renderMosaics = (
    mosaics: Mosaic[],
    store: Store<AppState>): any => {
    const result = renderMosaicsAndReturnArray(mosaics, store)
    // @TODO: review
    if (result === 'Loading...') return result
    return result.map(({name, amount}) => `${amount} [${name}]`).join(', ')
}

export const getRelativeMosaicAmount = (amount: number, divisibility: number) => {
    if (!amount) return 0
    return amount / Math.pow(10, divisibility)
}

export const getAbsoluteMosaicAmount = (amount: number, divisibility: number) => {
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
export const renderMosaicNames = (mosaics: Mosaic[],
                                  store: Store<AppState>): string => {
    const mosaicList = store.state.account.mosaics
    const items = mosaics
        .map(mosaic => {
            const hex = mosaic.id.toHex()
            if (!mosaicList[hex]) return
            const appMosaic = mosaicList[hex]
            return appMosaic.name || appMosaic.hex
        })
        .filter(x => x)

    if (!items.length) return 'N/A'
    const networkMosaicIndex = items.indexOf(store.state.account.networkCurrency.hex)
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
export const renderMosaicAmount = (mosaics: Mosaic[], mosaicList: AppMosaic[]): string => {
    if (!mosaics.length) return '0'
    if (mosaics.length > 1) return 'mix'
    const hex = mosaics[0].id.toHex()
    if (!mosaicList[hex] || !mosaicList[hex].properties) return 'Loading...'
    const appMosaic = mosaicList[hex]
    return getRelativeMosaicAmount(mosaics[0].amount.compact(), appMosaic.properties.divisibility)
        .toLocaleString()
}
