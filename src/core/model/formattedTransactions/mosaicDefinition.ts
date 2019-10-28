import {FormattedTransaction, AppState} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {MosaicDefinitionTransaction} from 'nem2-sdk'
import {Store} from 'vuex';

export class FormattedMosaicDefinition extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(  tx: MosaicDefinitionTransaction,
                  store: Store<AppState>) {
        super(tx, store)
        const {networkCurrency} = store.state.account

            this.dialogDetailMap = {
                'transfer_type': this.txHeader.tag,
                'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility) + ' ' + networkCurrency.ticker,
                'block': this.txHeader.block,
                'hash': this.txHeader.hash,
                'mosaicId': tx.mosaicId.toHex(),
                'supplyMutable': tx.flags.supplyMutable || 'false',
                'transferable': tx.flags.transferable || 'false',
                'restrictable': tx.flags.restrictable || 'false',
            }
    }
}

