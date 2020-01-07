import {FormattedTransaction} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {Transaction} from 'nem2-sdk'
import {AppState, TransactionFormatterOptions} from '../types';
import {Store} from 'vuex';

export class FormattedMosaicGlobalRestriction extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(    tx: Transaction,
                    store: Store<AppState>,
                    options?: TransactionFormatterOptions,) {
        super(tx, store, options)
        const {networkCurrency} = store.state.account
        const {divisibility} = networkCurrency

        this.dialogDetailMap = {
             'self': tx.signer ?tx.signer.address.pretty(): store.state.account.wallet.address,
            'transaction_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), divisibility),
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
            // @MODAL
        }
    }
}
