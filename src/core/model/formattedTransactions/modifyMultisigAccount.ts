import {FormattedTransaction, AppState} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {MultisigAccountModificationTransaction} from 'nem2-sdk'
import {Store} from 'vuex'

export class FormattedModifyMultisigAccount extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(  tx: MultisigAccountModificationTransaction,
                  store: Store<AppState>) {
          super(tx, store)
          const {networkCurrency} = store.state.account

          this.dialogDetailMap = {
            'transfer_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility) + ' ' + networkCurrency.ticker,
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
            'minApprovalDelta': tx.minApprovalDelta,
            'maxRemovalDelta': tx.minRemovalDelta,
            'cosignatories': tx.modifications,
          }
    }
}
