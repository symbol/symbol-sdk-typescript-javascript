import {FormattedTransaction, AppState} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {SecretLockTransaction, NamespaceId, Address} from 'nem2-sdk'
import {Store} from 'vuex';

export class FormattedSecretLock extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(tx: SecretLockTransaction,
                store: Store<AppState>) {
        super(tx, store)
        const {networkCurrency} = store.state.account

            this.dialogDetailMap = {
                'transfer_type': this.txHeader.tag,
                'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility) + ' ' + networkCurrency.ticker,
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
