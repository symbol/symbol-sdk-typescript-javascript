import {Mosaic} from "nem2-sdk"
import {AppMosaic} from '@/core/model'

/**
 * Transforms an array of mosaics to an inline representation,
 * setting networkCurrency as the first item
 * eg: nem.xem (1,000), 04d3372253f1bb69 (2,123)
 * @param mosaics
 * @param mosaicList
 * @param currentXem
 */
export const renderMosaics = (mosaics: Mosaic[],
                              mosaicList: AppMosaic[],
                              currentXem: string): string => {
    const items = mosaics
        .map((mosaic) => {
            const hex = mosaic.id.toHex()
            if (!mosaicList[hex] || !mosaicList[hex].properties) return
            const appMosaic = mosaicList[hex]
            const name = appMosaic.name || appMosaic.hex
            const amount = getRelativeMosaicAmount(mosaic.amount.compact(), appMosaic.properties.divisibility)
                .toLocaleString()
            return {name, amount}
        })
        .filter(x => x)

    if (!items.length) return 'Loading...'

    const networkMosaicIndex = items.findIndex(({name}) => name === currentXem)

    if (networkMosaicIndex <= 0) {
        return items.map(({name, amount}) => `${name} (${amount})`).join(', ')
    }
    const networkMosaic = items.splice(networkMosaicIndex, 1)
    items.unshift(networkMosaic[0])
    return items.map(({name, amount}) => `${name} (${amount})`).join(', ')
}

/**
 * Transforms an array of mosaics to an inline representation,
 * setting networkCurrency as the first item
 * eg: nem.xem, 04d3372253f1bb69
 * @param mosaics
 * @param mosaicList
 * @param currentXem
 */
export const renderMosaicNames = ( mosaics: Mosaic[],
                                   mosaicList: AppMosaic[],
                                   currentXem: string): string => {
  const items = mosaics
    .map(mosaic => {
        const hex = mosaic.id.toHex()
        if(!mosaicList[hex]) return
        const appMosaic = mosaicList[hex]
        return appMosaic.name || appMosaic.hex
    })
    .filter(x => x)

  if (!items.length) return 'N/A'
  const networkMosaicIndex = items.indexOf(currentXem)
  if (networkMosaicIndex <= 0) return items.join(', ')
  const networkMosaic = items.splice(networkMosaicIndex, 1)
  items.unshift(networkMosaic[0])
  return items.join(', ')
}

/**
 * Returns a relative amount as relativeAmount.toLocaleString()
 * @param mosaics
 * @param mosaicList
 */
export const renderMosaicAmount = (mosaics: Mosaic[], mosaicList: AppMosaic[]): string => {
  if(!mosaics.length) return '0'
  if(mosaics.length > 1) return 'mix' 
  const hex = mosaics[0].id.toHex()
  if(!mosaicList[hex] || !mosaicList[hex].properties) return 'Loading...'
  const appMosaic = mosaicList[hex]
  return getRelativeMosaicAmount(mosaics[0].amount.compact(), appMosaic.properties.divisibility)
      .toLocaleString()
}

export const getRelativeMosaicAmount = (amount: number, divisibility: number): number => {
    if (!amount) return 0
    return amount / Math.pow(10, divisibility)
}

export const getAbsoluteMosaicAmount = (amount: number, divisibility: number): number => {
    if (!amount) return 0
    return amount * Math.pow(10, divisibility)
}
