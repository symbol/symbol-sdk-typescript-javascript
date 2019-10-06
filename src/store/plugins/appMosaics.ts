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
      
      // @TODO: implement namespaceId management
      // try {
          // const {namespaceIds} = idsFromTransactions
          // const mosaicIdsFromNamespaceIdsProms = namespaceIds
          //     .map(x => new NamespaceHttp(state.account.node)
          //         .getLinkedMosaicId(x)
          //         .toPromise())
          // const mosaicIds = await Promise.all(mosaicIdsFromNamespaceIdsProms)
      // } catch (error) {
          // console.error("appMosaicsModule -> error", error)
      // }
    }

    /**
     * Check for missing mosaicInfo in the mosaics added to store.account.mosaics
     */
    if (mutation.type === 'UPDATE_MOSAICS') {
      try {
        const {mosaics, node} = state.account
        const mosaicsWithInfo = await AppMosaics().updateMosaicInfo(mosaics, node)
        if (!mosaicsWithInfo) return
        store.commit('UPDATE_MOSAICS_INFO', mosaicsWithInfo)
      } catch (error) {
        console.error("appMosaicsModule -> error", error)
      }
    }

    if (mutation.type === 'SET_NAMESPACES') {
      const appMosaics = AppMosaics().fromNamespaces(state.account.namespaces)
      store.commit('UPDATE_MOSAICS_INFO', appMosaics)
    }
  })
}
