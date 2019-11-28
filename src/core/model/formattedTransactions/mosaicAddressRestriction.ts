import {FormattedTransaction} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {MosaicAddressRestrictionTransaction, Transaction} from 'nem2-sdk'
import {AppState} from '../types';
import {Store} from 'vuex';

export class FormattedMosaicAddressRestriction extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor( tx: MosaicAddressRestrictionTransaction,
        store: Store<AppState>) {
            super(tx, store)
            const {networkCurrency} = store.state.account
            const {divisibility, ticker} = networkCurrency

        this.dialogDetailMap = {
             'self': tx.signer ?tx.signer.address.pretty(): store.state.account.wallet.address,
            'transaction_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), divisibility) + ' ' + ticker,
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
            // @MODAL
        }
    }
}
