import {Address, Transaction, AccountHttp, QueryParams} from 'nem2-sdk'
import {AppState, TransactionStatusGroups} from '@/core/model'
import {Store} from 'vuex'

export const setTransactionList = (address: Address, store: Store<AppState>): void => {
  const {node} = store.state.account
  const {transactionFormatter} = store.state.app
  const accountHttp = new AccountHttp(node)

  accountHttp.getAccountTransactions(address, new QueryParams(100))
    .subscribe(
      (transactionList: Transaction[]) => {
        transactionFormatter.formatAndSaveTransactions(
          transactionList,
          {transactionStatusGroup: TransactionStatusGroups.confirmed},
        )
      },
      (error) => console.error('setTransactionList -> transactions -> error', error),
    )

  accountHttp.getAccountUnconfirmedTransactions(address, new QueryParams(100))
    .subscribe(
      (transactionList: Transaction[]) => {
        transactionFormatter.formatAndSaveTransactions(
          transactionList,
          {transactionStatusGroup: TransactionStatusGroups.unconfirmed},
        )
      },
      (error) => console.error('setTransactionList -> unconfirmedTransactions -> error', error),
    )
}
