import {TransactionType, Address} from 'nem2-sdk'
import {mosaicsAmountViewFromAddress} from '@/core/services'
import {AppMosaic} from '@/core/model'
import {getNamespaces} from "@/core/services/namespace"


const txTypeToGetNamespaces = [
  TransactionType.REGISTER_NAMESPACE,
  TransactionType.MOSAIC_ALIAS,
  TransactionType.ADDRESS_ALIAS,
]

/**
 * This module reacts to confirmed transactions
 * By default, the mosaic balances are checked everyTime
 */
export const onTransactionRefreshModule = (store) => {
  store.registerModule('onTransactionRefresh', onTransactionRefreshModule)

  store.subscribe(async (mutation, state) => {
    /**
     * Extracts all hexIds from transactions,
     * Add them to store.account.mosaics
     */
    if (mutation.type === 'ADD_CONFIRMED_TRANSACTION') {
     try {
        const {node} = state.account
        const {address} = state.account.wallet
        const accountAddress = Address.createFromRawAddress(address)
        const mosaicAmountViews = await mosaicsAmountViewFromAddress(node, accountAddress)
        const appMosaics = mosaicAmountViews.map(x => AppMosaic.fromMosaicAmountView(x))
        store.commit('UPDATE_MOSAICS', appMosaics)
        const txType = mutation.payload[0].rawTx.type

        if (txTypeToGetNamespaces.includes(txType)) {
          const namespaces = await getNamespaces(address, node)
          store.commit('SET_NAMESPACES', namespaces)
        }
     } catch (error) {
      console.error(error)
     }
    }
  })
}
