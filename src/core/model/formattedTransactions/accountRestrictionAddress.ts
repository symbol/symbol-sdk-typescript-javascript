import {FormattedTransaction, AppState} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {AccountAddressRestrictionTransaction, Transaction} from 'nem2-sdk'
import {Store} from 'vuex'

export class FormattedAccountRestrictionAddress extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(tx: AccountAddressRestrictionTransaction,
                store: Store<AppState>) {
        super(tx, store)
        const {networkCurrency} = store.state.account

        this.dialogDetailMap = {
             'self': tx.signer ? tx.signer.address.pretty(): store.state.account.wallet.address,
            'transaction_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility) + ' ' + networkCurrency.ticker,
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
            // @MODAL
        }
    }
}
