import {FormattedTransaction, AppState,} from '@/core/model'
import {transactionFormatter} from '@/core/services'
import {getRelativeMosaicAmount} from '@/core/utils'
import {AggregateTransaction, Transaction} from 'nem2-sdk'
import {Store} from 'vuex'

export class FormattedAggregateComplete extends FormattedTransaction {
    dialogDetailMap: any
    icon: any
    formattedInnerTransactions: FormattedTransaction[]

    constructor(tx: AggregateTransaction,
                store: Store<AppState>) {
        super(tx, store)
        const {networkCurrency} = store.state.account

        this.formattedInnerTransactions = transactionFormatter(tx.innerTransactions,
            store)
        this.dialogDetailMap = {
            'self': tx.signer ? tx.signer.address.pretty(): store.state.account.wallet.address,
            'transaction_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility),
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
        }
    }
}
