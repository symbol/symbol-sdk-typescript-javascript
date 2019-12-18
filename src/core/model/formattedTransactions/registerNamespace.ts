import {FormattedTransaction, AppState} from '@/core/model'
import {absoluteAmountToRelativeAmountWithTicker} from '@/core/utils'
import {NamespaceRegistrationTransaction, NamespaceRegistrationType} from 'nem2-sdk'
import {Store} from 'vuex'
import {Rent} from '@/core/services/fees'

export class FormattedRegisterNamespace extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(tx: NamespaceRegistrationTransaction,
                store: Store<AppState>) {
        super(tx, store)
        const {wallet, networkCurrency} = store.state.account

        this.dialogDetailMap = {
            'self': tx.signer ? tx.signer.address.pretty() : store.state.account.wallet.address,
            'transaction_type': this.txHeader.tag,
            'namespace_name': tx.namespaceName + ' (' + (tx.registrationType === NamespaceRegistrationType
                .RootNamespace ? 'root' : 'sub') + ')',
            'root_namespace': tx.parentId ? tx.parentId.id.toHex() : '-',
            'sender': wallet.publicKey,
            'duration': tx.duration ? tx.duration.compact().toLocaleString() : 0,
            'fee': absoluteAmountToRelativeAmountWithTicker(tx.maxFee.compact(), networkCurrency),
        }

        if (!(tx.signer)) this.dialogDetailMap = {
            ...this.dialogDetailMap,
            'Rental_fee': this.getRent(store),
        }
    }

    getRent(store: Store<AppState>): string {
        if (!(this.rawTx instanceof NamespaceRegistrationTransaction)) {
            throw new Error('a wrong transaction type was passed in FormattedRegisterNamespace')
        }

        const duration = this.rawTx.duration ? this.rawTx.duration.compact() : 0
        const {networkCurrency} = store.state.account

        return Rent
            .getFromDurationInBlocks(duration, networkCurrency)
            .relativeWithTicker
    }
}
