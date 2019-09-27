import {TransactionHeader} from '@/core/model'
import {Transaction, Address} from 'nem2-sdk'

/**
 * Formatted transaction to be injected in the views
 */
export abstract class FormattedTransaction {
    rawTx: Transaction
    txHeader: TransactionHeader
    txBody: any
    isTxUnconfirmed: boolean
    store: any
  
    constructor(transaction: any, address: Address, currentXem: string, xemDivisibility: number, store: any) {
        this.rawTx = transaction
        this.txHeader = new TransactionHeader(transaction, address, currentXem, xemDivisibility, store)
        this.isTxUnconfirmed = transaction.isTxUnconfirmed || false // @TODO: don't add key to Transaction
        return this
    }
}
