import {FormattedTransaction, AppState} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {MosaicSupplyChangeTransaction, MosaicSupplyChangeAction} from 'nem2-sdk'
import {Store} from 'vuex';

export class FormattedMosaicSupplyChange extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(  tx: MosaicSupplyChangeTransaction,
                  store: Store<AppState>) {
        super(tx, store)
        const {networkCurrency} = store.state.account

          this.dialogDetailMap = {
            'transfer_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility) + ' ' + networkCurrency.ticker,
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
            'mosaicId': tx.mosaicId,
            'direction': tx.direction === MosaicSupplyChangeAction.Increase ? 'Increase' : 'Decrease',
            'delta': tx.delta.compact().toLocaleString(),
          }
    }
}
