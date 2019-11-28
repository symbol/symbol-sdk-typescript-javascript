import {FormattedTransaction, AppState} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {NamespaceRegistrationTransaction, NamespaceRegistrationType, Transaction} from 'nem2-sdk'
import {defaultNetworkConfig} from '@/config/index.ts'
import {Store} from 'vuex'

export class FormattedRegisterNamespace extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(tx: NamespaceRegistrationTransaction,
                store: Store<AppState>) {
        super(tx, store)
        const {networkCurrency, wallet} = store.state.account
        this.dialogDetailMap = {
            'self': tx.signer ? tx.signer.address.pretty() : store.state.account.wallet.address,
            'transaction_type': this.txHeader.tag,
            'namespace_name': tx.namespaceName + ' (' + (tx.registrationType === NamespaceRegistrationType
                .RootNamespace ? 'root' : 'sub') + ')',
            'root_namespace': tx.parentId ? tx.parentId.id.toHex() : '-',
            'sender': wallet.publicKey,
            'duration': tx.duration ? tx.duration.compact() : 0,
            'rent': (tx.duration ? tx.duration.compact() : 0) / defaultNetworkConfig.gas2xemRate + ' ' + networkCurrency.ticker,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility) + ' ' + networkCurrency.ticker,
        }
    }
}
