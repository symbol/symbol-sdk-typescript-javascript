import {FormattedTransaction, AppState} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {TransferTransaction} from 'nem2-sdk'
import {Store} from 'vuex'

export class FormattedTransfer extends FormattedTransaction {
    infoFirst: string
    infoSecond: string
    infoThird: any
    dialogDetailMap: any

    constructor(tx: TransferTransaction,
                store: Store<AppState>) {
        super(tx, store)
        const {networkCurrency} = store.state.account

        const {rawTx}: any = this
        this.infoFirst = this.txHeader.isReceipt ? rawTx.signer.address.plain() : rawTx.recipientAddress.address

        this.dialogDetailMap = {
            'transfer_type': this.txHeader.tag,
            'from': this.infoFirst,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility) + networkCurrency.ticker,
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
            'message': rawTx.message.payload,
            'mosaic': rawTx.mosaics,
        }
    }
}

