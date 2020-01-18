import {AppMosaics} from '@/core/services/mosaics'
import {TransactionType, Address, AggregateTransaction} from 'nem2-sdk'
import {AppMosaic, AppState, FormattedTransaction} from '@/core/model'
import {
  setNamespaces, getTransactionTypesFromAggregate, BalancesService,
  mosaicsAmountViewFromAddress, handleRecipientAddressAsNamespaceId,
} from '@/core/services'

const txTypeToGetNamespaces = [
  TransactionType.REGISTER_NAMESPACE,
  TransactionType.MOSAIC_ALIAS,
  TransactionType.ADDRESS_ALIAS,
]

const txTypeToSetAccountInfo = [
  TransactionType.LINK_ACCOUNT,
]

const txTypeToGetMultisigInfo = [
  TransactionType.MODIFY_MULTISIG_ACCOUNT,
]

export default {
  mosaicsPlugin: (store) => {
    store.registerModule('appMosaics', appMosaicsModule)
  
    store.subscribe(async (mutation, state) => {
      /**
       * Extracts all hexIds from transactions,
       * Add them to store.account.mosaics
       */
      if (mutation.type === 'SET_TRANSACTION_LIST') {
        const appMosaics = AppMosaics().fromTransactions(state.account.transactionList)
        if (appMosaics.length) store.commit('UPDATE_MOSAICS', appMosaics)
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
          console.error('appMosaicsModule -> error', error)
        }
      }
  
      if (mutation.type === 'UPDATE_NAMESPACES') {
        const {namespaces, mosaics} = state.account
        const appMosaics = AppMosaics().fromNamespaces(namespaces, mosaics)
        if (appMosaics.length) store.commit('UPDATE_MOSAICS_INFO', appMosaics)
      }
    })
  },

  transactionsPlugin: (store: any) => { // @TODO: check how to type it
    store.registerModule('onTransactionRefresh', this.transactionsPlugin)
  
    store.subscribe(async (mutation, state: AppState) => {
      if (mutation.type === 'ADD_UNCONFIRMED_TRANSACTION') {
        const formattedTransaction: FormattedTransaction = mutation.payload
        handleRecipientAddressAsNamespaceId([formattedTransaction], store)
      }
  
      if (mutation.type === 'ADD_CONFIRMED_TRANSACTION') {
        try {
          const {node} = state.account
          const {wallet} = state.account
          const {address} = state.account.wallet
          const accountAddress = Address.createFromRawAddress(address)
  
          const mosaicAmountViews = await mosaicsAmountViewFromAddress(node, accountAddress)
          const balances = BalancesService.getFromMosaicAmountViews(mosaicAmountViews)
          const appMosaics = mosaicAmountViews.map(x => AppMosaic.fromMosaicAmountView(x))
  
          store.commit('SET_ACCOUNT_BALANCES', {address: wallet.address, balances})
          store.commit('UPDATE_MOSAICS', appMosaics)
  
          const formattedTransaction: FormattedTransaction = mutation.payload
          const transaction = formattedTransaction.rawTx
  
          const transactionTypes: TransactionType[] = transaction instanceof AggregateTransaction
            ? getTransactionTypesFromAggregate(transaction)
            : [transaction.type]
  
          if (txTypeToGetNamespaces.some(a => transactionTypes.some(b => b === a))) {
            setNamespaces(address, store)
          }
  
          if (txTypeToSetAccountInfo.some(a => transactionTypes.some(b => b === a))) {
            wallet.setAccountInfo(store)
          }
  
          if (txTypeToGetMultisigInfo.some(a => transactionTypes.some(b => b === a))) {
            wallet.setMultisigStatus(node, store)
          }
  
          handleRecipientAddressAsNamespaceId([formattedTransaction], store)
        } catch (error) {
          console.error(error)
        }
      }
  
      if (mutation.type === 'SET_TRANSACTION_LIST') {
        handleRecipientAddressAsNamespaceId(mutation.payload, store)
      }
    })
  }
}
