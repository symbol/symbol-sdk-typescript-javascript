import {
  NetworkType, Transaction, PublicAccount, AggregateTransaction,
  Deadline, UInt64, Listener, TransactionHttp, HashLockTransaction,
  Mosaic, MosaicId, Account,
} from 'nem2-sdk'
import { Store } from 'vuex'
import { AppState } from '@/core/model'
import { filter, mergeMap } from 'rxjs/operators'
import {defaultNetworkConfig} from '@/config'
const {DEFAULT_LOCK_AMOUNT} = defaultNetworkConfig

export const createCompleteMultisigTransaction = ( transactions: Array<Transaction>,
                                                   multisigPublicKey: string,
                                                   networkType: NetworkType,
                                                   fee: number) => {
  const publicAccount = PublicAccount.createFromPublicKey(multisigPublicKey, networkType)
  
  return AggregateTransaction.createComplete(
    Deadline.create(),
    transactions.map(tx => tx.toAggregate(publicAccount)),
    networkType,
    [],
    UInt64.fromUint(fee)
  )
}

export const createBondedMultisigTransaction = ( transactions: Array<Transaction>,
                                                 multisigPublicKey: string,
                                                 networkType: NetworkType,
                                                 fee: number) => {
   const publicAccount = PublicAccount.createFromPublicKey(multisigPublicKey, networkType)
   
   return AggregateTransaction.createComplete(
     Deadline.create(),
     transactions.map(tx => tx.toAggregate(publicAccount)),
     networkType,
     [],
     UInt64.fromUint(fee)
   )
}

export const announceBondedWithLock = ( aggregateTransaction: AggregateTransaction,
                                        account: Account,
                                        listener: Listener,
                                        node: string,
                                        fee: number,
                                        store: Store<AppState>) => {
    const {wallet, networkCurrency, generationHash} = store.state.account
    const {networkType} = wallet

    const transactionHttp = new TransactionHttp(node)
    const signedTransaction = account.sign(aggregateTransaction, generationHash)
    const hashLockTransaction = HashLockTransaction
        .create(
            Deadline.create(),
            new Mosaic(new MosaicId(networkCurrency.hex), UInt64.fromUint(DEFAULT_LOCK_AMOUNT)),
            UInt64.fromUint(480),
            signedTransaction,
            networkType,
            UInt64.fromUint(fee)
        )

    // @TODO: wallet refactor, should not sign here
    const hashLockTransactionSigned = account.sign(hashLockTransaction, generationHash)
    
    // @TODO: listener should probably not be here
    listener.open().then(() => {
        transactionHttp
            .announce(hashLockTransactionSigned)
            .subscribe(x => console.log(x), err => console.error(err))

        listener
            .confirmed(account.address)
            .pipe(
              filter((transaction) => transaction.transactionInfo !== undefined
                  && transaction.transactionInfo.hash === hashLockTransactionSigned.hash),
              mergeMap(ignored => transactionHttp.announceAggregateBonded(signedTransaction)),
            )
            .subscribe(
                announcedAggregateBonded => console.log(announcedAggregateBonded),
                err => console.error(err),
            )
    }).catch((error) => {
        console.error(error)
    })
}