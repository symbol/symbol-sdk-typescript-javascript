import {FormattedTransaction, AppState, TransactionFormatterOptions} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {SecretLockTransaction, NamespaceId, Address} from 'nem2-sdk'
import {Store} from 'vuex'

export class FormattedSecretLock extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(tx: SecretLockTransaction,
                store: Store<AppState>,
                options?: TransactionFormatterOptions,) {
        super(tx, store, options)
        const {networkCurrency} = store.state.account
        this.dialogDetailMap = {
             'self': tx.signer ? tx.signer.address.pretty() : store.state.account.wallet.address,
            'transaction_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility),
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
            'mosaics': [tx.mosaic],
            'duration_blocks': tx.duration.compact().toLocaleString(),
            hashType: tx.hashType,
            secret: tx.secret,
            aims: this.getRecipient(),
        }
    }

    getRecipient(): string | NamespaceId {
        const rawTx: any = this.rawTx
        const recipientAddress: NamespaceId | Address = rawTx.recipientAddress
        if (recipientAddress instanceof NamespaceId) return recipientAddress
        return recipientAddress.pretty()
    }
}
