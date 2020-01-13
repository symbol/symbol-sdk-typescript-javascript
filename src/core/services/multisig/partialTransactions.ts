import {Address, AccountHttp} from 'nem2-sdk'
import {Store} from 'vuex'
import {AppState, TransactionCategories, TransactionStatusGroups} from '@/core/model'

export const setPartialTransactions = async (
  address: Address, store: Store<AppState>,
): Promise<void> => {
  const {node} = store.state.account
  const {transactionFormatter} = store.state.app
  new AccountHttp(node)
    .getAccountPartialTransactions(address)
    .subscribe(
      transactionList => {
        transactionFormatter.formatAndSaveTransactions(transactionList, {
          transactionStatusGroup: TransactionStatusGroups.confirmed,
          transactionCategory: TransactionCategories.TO_COSIGN,
        })
      },
      error => console.error('setPartialTransactions', error),
    )
}
