import {transactionTypeToFormattedTransaction} from '@/core/services/transactions/transactionTypeToFormattedTransaction.ts'
import {TransactionType} from 'nem2-sdk'

describe('transactionTypeToFormattedTransaction', () => {
  it('should not throw for any transaction type from the SDK', () => {
    const numericTransactionTypes = Object.keys(TransactionType)
      .filter(key => !Number.isNaN(parseFloat(key)))
      .filter(key => key && key !== '0')

    expect(() => {
      numericTransactionTypes.forEach(transactionType => {
        const formatter = transactionTypeToFormattedTransaction(transactionType)
        if (!formatter) {
          throw new Error(`no formatter found for ${transactionType}`)
        }
      })
    }).not.toThrow()
  })
})