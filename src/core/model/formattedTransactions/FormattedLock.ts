import {FormattedTransaction, AppState, TransactionFormatterOptions} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {LockFundsTransaction} from 'nem2-sdk'
import {Store} from 'vuex'

export class FormattedLock extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(tx: LockFundsTransaction,
                store: Store<AppState>,
                options?: TransactionFormatterOptions,) {
        super(tx, store, options)
        const {networkCurrency} = store.state.account
        this.dialogDetailMap = {
            'self': tx.signer ? tx.signer.address.pretty() : store.state.account.wallet.address,
            'transaction_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility),
            'hash': this.txHeader.hash,
            'duration_blocks': tx.duration.compact(),
            'mosaics': [tx.mosaic],
        }
    }
}
