import {
  NetworkType, Transaction, PublicAccount, AggregateTransaction,
  Deadline, UInt64, HashLockTransaction,
  Mosaic, MosaicId, Account,
} from 'nem2-sdk'
import { Store } from 'vuex'
import { AppState, AppWallet } from '@/core/model'
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

   return AggregateTransaction.createBonded(
     Deadline.create(),
     transactions.map(tx => tx.toAggregate(publicAccount)),
     networkType,
     [],
     UInt64.fromUint(fee)
   )
}

export const createHashLockAggregateTransaction = ( aggregateTransaction: AggregateTransaction,
                                                      fee: number,
                                                      account: Account,
                                                      store: Store<AppState>
                                                                  ) => {
  const {wallet, networkCurrency, generationHash} = store.state.account
  const {networkType} = wallet

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
  return hashLockTransaction
}


// TODO: Remove if CheckPasswordDialog is made redundant
export const announceBondedWithLock = ( aggregateTransaction: AggregateTransaction,
                                        account: Account,
                                        node: string,
                                        fee: number,
                                        store: Store<AppState>) => {
    const { wallet, generationHash } = store.state.account

    const hashLockTransaction = createHashLockAggregateTransaction(
      aggregateTransaction,
      fee,
      account,
      store
    );

    const hashLockTransactionSigned = account.sign(hashLockTransaction, generationHash)

    new AppWallet(wallet).announceBonded(hashLockTransactionSigned, node);
}
