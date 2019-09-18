import {PublicAccount, NetworkType} from "nem2-sdk"
import {TransactionApiRxjs} from '@/core/api/TransactionApiRxjs.ts'
import {transactionFormat} from '@/core/services/transactions'
import {AppMosaics} from '@/core/services/mosaics/appMosaics'

// @TODO: refactor
export const formatAndSave = (  mosaicList,
                                transaction,
                                address,
                                currentXEM1,
                                xemDivisibility,
                                node,
                                currentXem,
                                store,
                                confirmed: boolean) => {
    const formattedTransactions = transactionFormat(
        [transaction],
        address,
        currentXEM1,
        xemDivisibility,
        node,
        currentXem,
    )
    
    if(confirmed) {
        store.commit('ADD_CONFIRMED_TRANSACTION', formattedTransactions)
        return
    }

    store.commit('ADD_UNCONFIRMED_TRANSACTION', formattedTransactions)
}

export const setTransactionList = (address, that) => {
    const context = that
    let {accountPublicKey, node} = that
    if (!accountPublicKey || accountPublicKey.length < 64) return
    const publicAccount = PublicAccount
        .createFromPublicKey(accountPublicKey, NetworkType.MIJIN_TEST)

    new TransactionApiRxjs().transactions(
        publicAccount,
        {
        pageSize: 100
        },
        node,
    ).subscribe(async (transactionList) => {
        try {
        const txList = transactionFormat(
                transactionList,
                address,
                context.currentXEM1,
                context.xemDivisibility,
                context.node,
                context.currentXem,
            )
        await that.$store.commit('SET_TRANSACTION_LIST', txList)
        that.$store.commit('SET_TRANSACTIONS_LOADING', false)
        } catch (error) {
            console.error(error)
        }
    })
}
