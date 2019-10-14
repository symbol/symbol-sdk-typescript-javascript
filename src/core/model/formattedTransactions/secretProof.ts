import {FormattedTransaction, AppState} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {Store} from 'vuex';
import {SecretProofTransaction} from 'nem2-sdk';

export class FormattedSecretProof extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(  tx: SecretProofTransaction,
                  store: Store<AppState>) {
        super(tx, store)
        const {networkCurrency} = store.state.account

          this.dialogDetailMap = {
            'transfer_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility) + ' ' + networkCurrency.ticker,
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
            'hashType': tx.hashType,
            'proof': tx.proof,
          }
    }
}
