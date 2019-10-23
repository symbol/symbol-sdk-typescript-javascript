import {Transaction, Address, SignedTransaction} from 'nem2-sdk'
import {AppState} from '@/core/model'
import {Store} from 'vuex'

import { transactionConfirmationObservable } from "@/core/services/transactions"

/**
 * Blocks the UI until the user authorises with a correct password or via a hardware wallet interaction, then returns a signed transaction
 * @param {Transaction} config.transaction the transaction data to be signed
 * @param {Store<AppState>} config.store instance of the vuex store
 * @param {Function} [config.transformer] optional function for transforming the signedTransaction before returning to the caller.
 * @param {Function} [config.otherDetails] optional function for transforming the signedTransaction before returning to the caller.
 *
 * the transformer function will be called with a `SignedTransaction` (always) and `Account` (if applicable to the wallet source type)
 *
 * @return {any} an object containing outcome of user interaction.
 * will include either the signedTransaction or an error message
 */

export const signTransaction = async({ transaction, store, transformer, otherDetails }:{
    transaction: Transaction,
    store: Store<AppState>,
    transformer?: Function,
    otherDetails?: any}):
    Promise<{success: Boolean, signedTransaction: SignedTransaction, error: (String|null)}> => {

    // stage the transaction data in the store, causing the UI to be blocked
    store.commit("SET_STAGED_TRANSACTION", {
        data: transaction,
        otherDetails,
        isAwaitingConfirmation: true
    })

    return new Promise(resolve => {
        // subscribe to the transactionConfirmation observable subject
        // this will allow this function to resume once the user has either
        // aborted transaction or authorised it successfully (via password or hardware device)
        const subscription = transactionConfirmationObservable.subscribe({
            async next({ success, error, signedTransaction, account }) {
                // unsubscribe when a result is received
                subscription.unsubscribe();
                store.commit("SET_STAGED_TRANSACTION", {
                    data: null,
                    otherDetails: null,
                    isAwaitingConfirmation: false
                })

                if(!success) {
                    return resolve({
                        success: false,
                        error,
                        signedTransaction: null
                    })
                } else if (transformer){
                    return resolve({
                        success,
                        error: null,
                        signedTransaction: await transformer(signedTransaction, account)
                    });
                } else {
                    return resolve({
                        success,
                        error: null,
                        signedTransaction
                    });
                }
            }
        })
    });
}