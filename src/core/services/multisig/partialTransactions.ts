import {Address, AccountHttp} from 'nem2-sdk'
import {Store} from 'vuex'
import {AppState, TRANSACTIONS_CATEGORIES} from '@/core/model'
import {formatAndSave} from '..'
import {interval, from, zip} from 'rxjs'
import {take, map} from 'rxjs/operators'

export const fetchPartialTransactions = async (address: Address, store: Store<AppState>): Promise<void> => {
    try {
        const {node} = store.state.account
        const txList = await new AccountHttp(node).aggregateBondedTransactions(address).toPromise()
        txList.forEach(tx => formatAndSave(tx, store, true, TRANSACTIONS_CATEGORIES.TO_COSIGN))
    } catch (error) {
        console.error("MultisigCosignTs -> getCosignTransactions -> error", error)
    }
}

export const fetchChildrenPartialTransactions = (address: Address, store: Store<AppState>): Promise<void> => {
    const {networkType} = store.state.account.wallet
    const multisigInfo = store.state.account.multisigAccountInfo[address.plain()]
    if (!multisigInfo) return

    const {multisigAccounts} = multisigInfo

    zip(
        interval(500).pipe(take(multisigAccounts.length)),
        from(multisigAccounts.map(x => x.publicKey)),
    )
    .pipe(map(([, x]) => x))
    .subscribe(
        async (publicKey) => {
            try {
                fetchPartialTransactions(Address.createFromPublicKey(publicKey, networkType), store)
            } catch (error) {
                console.error("getChildrenPartialTransactions: error", error)
            }
        }
    )
}