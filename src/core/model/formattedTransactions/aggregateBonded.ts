import {FormattedTransaction, AppState} from '@/core/model'
import {transactionFormatter} from '@/core/services'
import {getRelativeMosaicAmount} from '@/core/utils'
import {AggregateTransaction} from 'nem2-sdk'
import {Store} from 'vuex';

export class FormattedAggregateBonded extends FormattedTransaction {
    dialogDetailMap: any
    icon: any
    formattedInnerTransactions: FormattedTransaction[]

    constructor(  tx: AggregateTransaction,
                  store: Store<AppState>) {
        super(tx, store)
        const {networkCurrency} = store.state.account
        this.formattedInnerTransactions = transactionFormatter( tx.innerTransactions,
            store)

        this.dialogDetailMap = {
            'transfer_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility) + ' ' + networkCurrency.ticker,
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
        }
    }
}
