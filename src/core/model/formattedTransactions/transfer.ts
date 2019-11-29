import {FormattedTransaction, AppState} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {TransferTransaction, NamespaceId, Address} from 'nem2-sdk'
import {Store} from 'vuex'

export class FormattedTransfer extends FormattedTransaction {
    dialogDetailMap: any

    constructor(tx: TransferTransaction,
                store: Store<AppState>) {
        super(tx, store)
        const {networkCurrency} = store.state.account
        const rawTx: any = this.rawTx

        this.dialogDetailMap = {
            'transaction_type': this.txHeader.tag,
            'from': this.getSigner(),
            'aims': this.getRecipient(tx),
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility) + ' ' + networkCurrency.ticker,
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
            'message': rawTx.message.payload,
            'mosaics': rawTx.mosaics,
        }
    }

    getSigner(): string | NamespaceId {
        if (!this.rawTx.signer) return null
        return this.rawTx.signer.address.pretty()
    }

    getRecipient(tx: TransferTransaction): string | NamespaceId {
        return tx.recipientAddress instanceof Address
            ? tx.recipientAddress.pretty()
            : tx.recipientAddress
    }
}

