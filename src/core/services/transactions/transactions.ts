import {Address, Transaction, AccountHttp, QueryParams} from "nem2-sdk"
import {transactionFormat} from './formatting'
import {AppState} from '@/core/model'
import {Store} from 'vuex'

// @TODO: refactor
export const formatAndSave = (transaction: Transaction, store: Store<AppState>, confirmed: boolean) => {
    const formattedTransactions = transactionFormat(
        [transaction],
        store,
    )
    
    if(confirmed) {
        store.commit('ADD_CONFIRMED_TRANSACTION', formattedTransactions)
        return
    }

    store.commit('ADD_UNCONFIRMED_TRANSACTION', formattedTransactions)
}

export const setTransactionList = (address: string, store: Store<AppState>): void => {
    const {node} = store.state.account
    new AccountHttp(node)
        .transactions(
            Address.createFromRawAddress(address),
            new QueryParams(100),
    ).subscribe(
        (transactionList: Transaction[]) => {
            const txList = transactionFormat(transactionList, store)
            store.commit('SET_TRANSACTION_LIST', txList)
            store.commit('SET_TRANSACTIONS_LOADING', false)
        },
        (error) => console.error("setTransactionList -> error", error)
    )
    
}
