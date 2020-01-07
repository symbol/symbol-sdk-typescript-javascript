import {TransactionHeader} from '@/core/model'
import {Transaction} from 'nem2-sdk'
import {AppState, TransactionStatusGroups, TransactionFormatterOptions, TransactionCategories} from './types'
import {Store} from 'vuex'

export abstract class FormattedTransaction {
    dialogDetailMap?: any
    formattedInnerTransactions?: FormattedTransaction[]
    icon?: any
    rawTx: Transaction
    store: Store<AppState>
    toCosign: boolean
    transactionStatusGroup: TransactionStatusGroups
    txBody: any
    txHeader: TransactionHeader

    constructor(
      transaction: any,
      store: Store<AppState>,
      options?: TransactionFormatterOptions,
    ) {
        this.rawTx = transaction
        this.txHeader = new TransactionHeader(transaction, store)
        this.toCosign = options && options.transactionCategory
          && options.transactionCategory === TransactionCategories.TO_COSIGN
        this.transactionStatusGroup = options ? options.transactionStatusGroup : TransactionStatusGroups.confirmed
        return this
    }

    get isTxConfirmed(): boolean {
      return this.transactionStatusGroup === TransactionStatusGroups.confirmed
    }
}
