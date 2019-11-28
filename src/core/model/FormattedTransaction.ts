import {TransactionHeader} from '@/core/model'
import {Transaction} from 'nem2-sdk'
import {AppState} from './types'
import {Store} from 'vuex'

/**
 * Formatted transaction to be injected in the views
 */
export abstract class FormattedTransaction {
    rawTx: Transaction
    txHeader: TransactionHeader
    txBody: any
    isTxConfirmed: boolean
    store: Store<AppState>
    dialogDetailMap?: any
    icon?: any
    formattedInnerTransactions?: FormattedTransaction[]

    constructor(transaction: any, store: Store<AppState>) {
        this.rawTx = transaction
        this.txHeader = new TransactionHeader(transaction, store)
        this.isTxConfirmed = transaction.isTxConfirmed || false // @TODO: don't add key to Transaction
        return this
    }
}
