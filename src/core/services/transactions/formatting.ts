import {Transaction, Address} from 'nem2-sdk'
import {transactionFormatter} from './transactionFormatter'
import {AppState} from '@/core/model'
import {Store} from 'vuex'
      
// @TODO: merge with transactionFormatter
export const transactionFormat = (  transactionList: Transaction[],
                                    store: Store<AppState>) => {
    return transactionList
        .map((transaction: Transaction) => transactionFormatter([transaction], store)[0])
}

