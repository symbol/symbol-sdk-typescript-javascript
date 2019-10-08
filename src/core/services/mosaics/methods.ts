import {
    AccountHttp,
    Address,
    MosaicAmountView,
    MosaicService,
    MosaicHttp,
    MosaicId,
} from 'nem2-sdk'
import {AppMosaic, AppWallet, MosaicNamespaceStatusType, AppState} from '@/core/model'
import {Store} from 'vuex'

/**
 * Custom implementation for performance gains
 * @TODO: replace by SDK method when updated
 * https://github.com/nemtech/nem2-sdk-typescript-javascript/issues/247
 */
export const mosaicsAmountViewFromAddress = (node: string, address: Address): Promise<MosaicAmountView[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const accountHttp = new AccountHttp(node)
            const mosaicHttp = new MosaicHttp(node)
            const mosaicService = new MosaicService(accountHttp, mosaicHttp)

            const accountInfo = await accountHttp.getAccountInfo(address).toPromise()
            if (!accountInfo.mosaics.length) return []

            const mosaics = accountInfo.mosaics.map(mosaic => mosaic)
            const mosaicIds = mosaics.map(({id}) => new MosaicId(id.toHex()))
            const mosaicViews = await mosaicService.mosaicsView(mosaicIds).toPromise()

            const mosaicAmountViews = mosaics
                .map(mosaic => {
                    const mosaicView = mosaicViews
                        .find(({mosaicInfo}) => mosaicInfo.id.toHex() === mosaic.id.toHex())

                    if (mosaicView === undefined) throw new Error('A MosaicView was not found')
                    return new MosaicAmountView(mosaicView.mosaicInfo, mosaic.amount)
                })

            resolve(mosaicAmountViews)
        } catch (error) {
            reject(error)
        }
    })
}

export const initMosaic = (wallet: AppWallet, store: Store<AppState>) => {
    const {node, mosaics, networkCurrency} = store.state.account
    const address = Address.createFromRawAddress(wallet.address)

    return new Promise(async (resolve, reject) => {
        try {
            const mosaicAmountViews = await mosaicsAmountViewFromAddress(node, address)
            const appMosaics = mosaicAmountViews.map(x => AppMosaic.fromMosaicAmountView(x))
            store.commit('UPDATE_MOSAICS', appMosaics)
            const networkMosaic: AppMosaic = appMosaics.find(({ hex }) => hex === networkCurrency.hex)
            const balance = networkMosaic !== undefined && networkMosaic.balance
                ? networkMosaic.balance : 0
            
            new AppWallet(wallet).updateAccountBalance(balance, store)
            store.commit('SET_MOSAICS_LOADING', false)
            resolve(true)
        } catch (error) {
            store.commit('SET_MOSAICS_LOADING', false)
            reject(error)
        }
    })
}

export const sortByMosaicId = (list) => {
    let mosaicMap = {}
    let mosaicList = []
    list.forEach(item => {
        mosaicMap[item.hex] = item
    })
    mosaicList = list.map(item => item.hex).sort()
    return mosaicList.map((item) => {
        return mosaicMap[item]
    })
}
//mosaicInfo
//supply

export const sortByMosaicSupply = (list) => {
    return list.sort((a, b) => {
        if (!b.mosaicInfo || !a.mosaicInfo) return 1
        return b.mosaicInfo.supply.compact() - a.mosaicInfo.supply.compact()
    })
}

export const sortByMosaicDivisibility = (list) => {
    return list.sort((a, b) => {
        return b.mosaicInfo.properties.divisibility - a.mosaicInfo.properties.divisibility
    })
}

export const sortByMosaicTransferable = (list) => {
    return list.sort((a, b) => {
        return b.mosaicInfo.properties.transferable
    })
}

export const sortByMosaicSupplyMutable = (list) => {
    return list.sort((a, b) => {
        return b.mosaicInfo.properties.supplyMutable
    })
}
export const sortByMosaicDuration = (list) => {
    return list.sort((a, b) => {
        if (MosaicNamespaceStatusType.FOREVER == a.expirationHeight) {
            return false
        }
        return b.expirationHeight - a.expirationHeight
    })
}
export const sortByMosaicRestrictable = (list) => {
    return list.sort((a, b) => {
        return b.mosaicInfo.properties.supplyMutable.restrictable
    })
}
export const sortByMosaicAlias = (list) => {
    return list.sort((a, b) => {
        return b.name && a.name
    })
    return list
}
