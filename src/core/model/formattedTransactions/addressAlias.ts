import {Store} from 'vuex'
import {FormattedTransaction, AppState} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {AddressAliasTransaction, AliasAction, Transaction} from 'nem2-sdk'

export class FormattedAddressAlias extends FormattedTransaction {
    dialogDetailMap: any
    icon: any

    constructor(tx: AddressAliasTransaction,
                store: Store<AppState>) {
        super(tx, store)
        const {networkCurrency} = store.state.account
        this.dialogDetailMap = {
             'self': tx.signer ? tx.signer.address.pretty(): store.state.account.wallet.address,
            'transaction_type': this.txHeader.tag,
            'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility),
            'block': this.txHeader.block,
            'hash': this.txHeader.hash,
            'action': tx.aliasAction === AliasAction.Link ? 'Link' : 'Unlink',
            'address': tx.address.pretty(),
            'namespace': tx.namespaceId.toHex(),
        }
    }
}
