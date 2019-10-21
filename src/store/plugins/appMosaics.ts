import {AppMosaics} from '@/core/services/mosaics'
// import { NamespaceHttp, NamespaceId } from 'nem2-sdk'

export const appMosaicsModule = (store) => {
  store.registerModule('appMosaics', appMosaicsModule)

  store.subscribe(async (mutation, state) => {
    /**
     * Extracts all hexIds from transactions,
     * Add them to store.account.mosaics
     */
    if (mutation.type === 'SET_TRANSACTION_LIST') {
      const idsFromTransactions = AppMosaics().fromTransactions(state.account.transactionList)
      store.commit('UPDATE_MOSAICS', idsFromTransactions.appMosaics)
    }

    /**
     * Check for missing mosaicInfo in the mosaics added to store.account.mosaics
     */
    if (mutation.type === 'UPDATE_MOSAICS') {
      try {
        const {mosaics} = state.account
        AppMosaics().updateMosaicsInfo(mosaics, store)
        AppMosaics().updateMosaicsName(mosaics, store)
      } catch (error) {
        console.error("appMosaicsModule -> error", error)
      }
    }

    if (mutation.type === 'UPDATE_NAMESPACES') {
      const {namespaces, mosaics} = state.account
      const appMosaics = AppMosaics().fromNamespaces(namespaces, mosaics)
      store.commit('UPDATE_MOSAICS_INFO', appMosaics)
    }
  })
}
