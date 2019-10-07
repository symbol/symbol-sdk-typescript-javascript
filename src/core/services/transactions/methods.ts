import {TransactionType, AggregateTransaction } from 'nem2-sdk';

/**
 * Returns a list of the different types contained in an Aggregate's inner transactions
 */
export const getTransactionTypesFromAggregate = (transaction: AggregateTransaction): TransactionType[] => {
  return transaction.innerTransactions
    .map(({type}) => type)
    .filter((el, i, a) => i === a.indexOf(el))
}