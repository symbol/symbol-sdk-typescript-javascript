import {FormattedTransaction, AppState, TransactionFormatterOptions,} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {AggregateTransaction} from 'nem2-sdk'
import {Store} from 'vuex'

export class FormattedAggregateComplete extends FormattedTransaction {
    dialogDetailMap: any
    icon: any
    formattedInnerTransactions: FormattedTransaction[]

    constructor(tx: AggregateTransaction,
                store: Store<AppState>,
                options?: TransactionFormatterOptions,) {
        super(tx, store, options)
        const {networkCurrency} = store.state.account
        const {transactionFormatter} = store.state.app
        this.formattedInnerTransactions = transactionFormatter
            .formatTransactions(tx.innerTransactions)

        this.dialogDetailMap = {
            'self': tx.signer ? tx.signer.address.pretty(): store.state.account.wallet.address,
            'transaction_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility),
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
        }
    }
}
