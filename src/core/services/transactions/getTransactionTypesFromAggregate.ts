import {TransactionType, AggregateTransaction } from 'nem2-sdk';


export const getTransactionTypesFromAggregate = (transaction: AggregateTransaction): TransactionType[] => {
  return transaction.innerTransactions
    .map(({type}) => type)
    .filter((el, i, a) => i === a.indexOf(el))
}
