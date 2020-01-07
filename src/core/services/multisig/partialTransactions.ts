import {Address, AccountHttp, PublicAccount, Account} from 'nem2-sdk'
import {Store} from 'vuex'
import {AppState, TransactionCategories, TransactionStatusGroups} from '@/core/model'
import {interval, from, zip} from 'rxjs'
import {take, map} from 'rxjs/operators'

export const setPartialTransactions = async (
    address: Address, store: Store<AppState>,
): Promise<void> => {
    try {
        const {node, wallet} = store.state.account
        const {transactionFormatter} = store.state.app
        const transactionList = await new AccountHttp(node)
            .getAccountPartialTransactions(address).toPromise()

        if (!transactionList.length) return
        transactionFormatter.formatAndSaveTransactions(transactionList, {
            transactionStatusGroup: TransactionStatusGroups.confirmed,
            transactionCategory: TransactionCategories.TO_COSIGN,
        })
    } catch (error) {
        console.error("MultisigCosignTs -> getCosignTransactions -> error", error)
    }
}

export const fetchSelfAndChildrenPartialTransactions = (
    publicAccount: PublicAccount,
    store: Store<AppState>,
): void => {
    const {address} = publicAccount
    const multisigInfo = store.state.account.multisigAccountInfo[address.plain()]
    const publicAccountsToFetch = multisigInfo ? [publicAccount, ...multisigInfo.multisigAccounts] : [publicAccount]

    zip(
        interval(500).pipe(take(publicAccountsToFetch.length)),
        from(publicAccountsToFetch.map(x => x.publicKey)),
    )
        .pipe(map(([, x]) => x))
        .subscribe(
            async (publicKey) => {
                try {
                    await setPartialTransactions(
                        Address.createFromPublicKey(publicKey, address.networkType),
                        store,
                    )
                } catch (error) {
                    console.error("getChildrenPartialTransactions: error", error)
                }
            }
        )
}
