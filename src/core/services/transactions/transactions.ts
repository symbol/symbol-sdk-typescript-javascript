import {PublicAccount, NetworkType, Address, Transaction} from "nem2-sdk"
import {TransactionApiRxjs} from '@/core/api/TransactionApiRxjs.ts'
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

export const setTransactionList = (store: Store<AppState>) => {
    const {wallet, node} = store.state.account
    const {address, publicKey} = wallet
    const {networkType} = Address.createFromRawAddress(address)
    const publicAccount = PublicAccount.createFromPublicKey(publicKey, networkType)

    new TransactionApiRxjs().transactions(
        publicAccount,
        {
        pageSize: 100
        },
        node,
    ).subscribe(async (transactionList) => {
        try {
            const txList = transactionFormat(transactionList, store)
            store.commit('SET_TRANSACTION_LIST', txList)
            store.commit('SET_TRANSACTIONS_LOADING', false)
        } catch (error) {
            console.error(error)
        }
    })
}
