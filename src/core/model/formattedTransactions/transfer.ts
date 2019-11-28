import {FormattedTransaction, AppState} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {TransferTransaction, NamespaceId, Address, Transaction} from 'nem2-sdk'
import {Store} from 'vuex'

export class FormattedTransfer extends FormattedTransaction {
    infoFirst: string | NamespaceId
    dialogDetailMap: any

    constructor(tx: TransferTransaction,
                store: Store<AppState>) {
        super(tx, store)
        const {networkCurrency} = store.state.account
        const rawTx: any = this.rawTx

        this.infoFirst = this.getInfoFirst()

        const fromTo = this.txHeader.isReceipt ? 'from' : 'aims'
        this.dialogDetailMap = tx.signer ? {
            'transaction_type': this.txHeader.tag,
            [fromTo]: this.infoFirst,
            'self': this.getSelfAddress(),
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility) + ' ' + networkCurrency.ticker,
            'message': rawTx.message.payload,
            'mosaics': rawTx.mosaics,
        } : {
            'transaction_type': 'payment',
            'aims': (tx.recipientAddress instanceof Address) ? tx.recipientAddress.pretty() : tx.recipientAddress.toHex(),
            'self': store.state.account.wallet.address,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility) + ' ' + networkCurrency.ticker,
            'message': rawTx.message.payload,
            'mosaics': rawTx.mosaics,
        }

    }

    getRecipient(): string | NamespaceId {
        const rawTx: any = this.rawTx
        const recipientAddress: NamespaceId | Address = rawTx.recipientAddress
        if (recipientAddress instanceof NamespaceId) return recipientAddress
        return recipientAddress.pretty()
    }

    getInfoFirst(): string | NamespaceId {
        if (!this.txHeader.isReceipt) return this.getRecipient()
        if (!this.rawTx.signer) return null
        return this.rawTx.signer.address.pretty()
    }

    getSelfAddress() {
        if (!this.rawTx.signer) return null
        if (this.txHeader.isReceipt) return this.getRecipient()
        return this.rawTx.signer.address.pretty()
    }
}

