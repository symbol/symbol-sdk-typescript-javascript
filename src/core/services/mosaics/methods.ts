import {
  AccountHttp,
  Address,
  MosaicAmountView,
  MosaicService,
  MosaicHttp,
  MosaicId,
} from 'nem2-sdk'
import {AppMosaic, AppWallet, MosaicNamespaceStatusType, AppState, AppNamespace} from '@/core/model'
import {Store} from 'vuex'
import {mosaicSortType} from '@/config/view/mosaic'
import {BalancesService} from './BalancesService'

/**
 * Custom implementation for performance gains
 * @TODO: replace by SDK method when updated
 * https://github.com/nemtech/nem2-sdk-typescript-javascript/issues/247
 */
export const mosaicsAmountViewFromAddress = async (
  node: string,
  address: Address,
): Promise<MosaicAmountView[]> => {
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

    return mosaicAmountViews
  } catch (error) {
    throw new Error(error)
  }
}

export const setMosaics = async (
  wallet: AppWallet,
  store: Store<AppState>,
) => {
  const {node} = store.state.account
  const address = Address.createFromRawAddress(wallet.address)

  try {
    const mosaicAmountViews = await mosaicsAmountViewFromAddress(node, address)
    const balances = BalancesService.getFromMosaicAmountViews(mosaicAmountViews)
    store.commit('SET_ACCOUNT_BALANCES', {address: wallet.address, balances})
    
    const appMosaics = mosaicAmountViews.map(x => AppMosaic.fromMosaicAmountView(x))
    store.commit('UPDATE_MOSAICS', appMosaics)
    store.commit('SET_MOSAICS_LOADING', false)
    return true
  } catch (error) {
    store.commit('SET_ACCOUNT_BALANCES', {address: wallet.address, balances: {}})
    store.commit('SET_MOSAICS_LOADING', false)
    throw new Error(error)
  }
}

export const sortByMosaicId = (list) => {
  const mosaicMap = {}
  let mosaicList = []
  list.forEach(item => {
    mosaicMap[item.hex] = item
  })
  mosaicList = list.map(item => item.hex).sort()
  return mosaicList.map((item) => {
    return mosaicMap[item]
  })
}

export const sortByMosaicSupply = (list) => {
  return list.sort((a, b) => {
    if (!b.mosaicInfo || !a.mosaicInfo) return 1
    return b.mosaicInfo.supply.compact() - a.mosaicInfo.supply.compact()
  })
}

export const sortByMosaicDivisibility = (list) => {
  return list.sort((a, b) => {
    return b.properties.divisibility - a.properties.divisibility
  })
}

export const sortByMosaicTransferable = (list) => {
  return list.sort((a, b) => {
    return b.properties.transferable ? -1 : 1
  })
}

export const sortByMosaicSupplyMutable = (list) => {
  return list.sort((a, b) => {
    return b.properties.supplyMutable ? -1 : 1
  })
}
export const sortByMosaicDuration = (list) => {
  return list.sort((a, b) => {
    if (MosaicNamespaceStatusType.FOREVER === a.expirationHeight) {
      return false
    }
    return b.expirationHeight - a.expirationHeight
  })
}
export const sortByMosaicRestrictable = (list) => {
  return list.sort((a, b) => {
    return b.properties.restrictable ? -1 : 1
  })
}
export const sortByMosaicAlias = (list) => {
  return list.sort((a, b) => {
    return b.name && a.name
  })
  return list
}
export const sortByBalance = (list) => {
  return list.sort((a, b) => {
    if (!b.balance || !a.balance) return 1
    return b.balance - a.balance
  })
}
// mosaic sorting
const sortingRouter = {
  [mosaicSortType.byAlias]: sortByMosaicAlias,
  [mosaicSortType.byDivisibility]: sortByMosaicDivisibility,
  [mosaicSortType.byDuration]: sortByMosaicDuration,
  [mosaicSortType.byId]: sortByMosaicId,
  [mosaicSortType.byRestrictable]: sortByMosaicRestrictable,
  [mosaicSortType.bySupply]: sortByMosaicSupply,
  [mosaicSortType.bySupplyMutable]: sortByMosaicSupplyMutable,
  [mosaicSortType.byTransferable]: sortByMosaicTransferable,
  [mosaicSortType.byBalance]: sortByBalance,
}

export const sortMosaicList = (mosaicSortType: number,
  list: AppNamespace[]): AppNamespace[] => {
  return sortingRouter[mosaicSortType](list)
}
