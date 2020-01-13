import {
  NetworkType, Transaction, PublicAccount,
  AggregateTransaction, Deadline, UInt64,
} from 'nem2-sdk'

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
    UInt64.fromUint(fee),
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
    UInt64.fromUint(fee),
  )
}

