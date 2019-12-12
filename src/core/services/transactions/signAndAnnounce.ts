import {Transaction} from 'nem2-sdk'
import {AppState, StagedTransaction, SignTransaction, AppWallet} from '@/core/model'
import {Store} from 'vuex'
import {transactionConfirmationObservable} from "@/core/services/transactions"
import {LockParams} from '@/core/model/LockParams'

/**
 * Blocks the UI until the user authorises with a correct password or via a hardware wallet interaction, then returns a signed transaction
 * @param {Transaction} config.transaction the transaction data to be signed
 * @param {Store<AppState>} config.store instance of the vuex store
 * @param {lockParams}
 *
 * @return {SignTransaction} an object containing outcome of user interaction.
 * will include either the signedTransaction or an error message
 */

export const signAndAnnounce = async({ transaction, store, lockParams }:{
    transaction: Transaction,
    store: Store<AppState>,
    lockParams?: LockParams}):
    Promise<SignTransaction> => {

    // stage the transaction data in the store, causing the UI to be blocked
    const stagedTransaction: StagedTransaction = {
        transactionToSign: transaction,
        lockParams: lockParams || LockParams.default(),
        isAwaitingConfirmation: true,
    }

    store.commit("SET_STAGED_TRANSACTION", stagedTransaction)

    return new Promise(resolve => {
        // subscribe to the transactionConfirmation observable subject
        // this will allow this function to resume once the user has either
        // aborted transaction or authorised it successfully (via password or hardware device)
        const subscription = transactionConfirmationObservable.subscribe({
            next({ success, error, signedTransaction, signedLock }) {
                // unsubscribe when a result is received
                subscription.unsubscribe();
                const stagedTransaction: StagedTransaction = {
                    transactionToSign: null,
                    isAwaitingConfirmation: false,
                    lockParams: LockParams.default(),
                }

                store.commit("SET_STAGED_TRANSACTION", stagedTransaction)

                if(!success) {
                    return resolve({
                        success: false,
                        error,
                        signedTransaction: null
                    })
                }

                new AppWallet(store.state.account.wallet)
                    .announceTransaction(signedTransaction, store, signedLock)
                
                if (lockParams && lockParams.announceInLock) {
                    return resolve({
                        success,
                        error: null,
                        signedTransaction,
                        signedLock,
                    })
                }

                return resolve({
                    success,
                    error: null,
                    signedTransaction
                })
            }
        })
    });
}