import {FormattedTransaction, AppState, TransactionFormatterOptions} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {AccountAddressRestrictionTransaction} from 'nem2-sdk'
import {Store} from 'vuex'

export class FormattedAccountRestrictionAddress extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(tx: AccountAddressRestrictionTransaction,
                store: Store<AppState>,
                options: TransactionFormatterOptions,) {
        super(tx, store, options)
        const {networkCurrency} = store.state.account

        this.dialogDetailMap = {
            'self': tx.signer ? tx.signer.address.pretty(): store.state.account.wallet.address,
            'transaction_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility),
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
            // @MODAL
        }
    }
}
