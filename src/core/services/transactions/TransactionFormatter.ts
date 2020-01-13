import {Store} from 'vuex'
import {Transaction} from 'nem2-sdk'
import {FormattedTransaction, TransactionCategories, TransactionStatusGroups} from '@/core/model'
import {AppState, TransactionFormatterOptions} from '@/core/model'
import {transactionTypeToFormattedTransaction} from '@/core/services/transactions/transactionTypeToFormattedTransaction.ts'

export class TransactionFormatter {
  private readonly transactionTypeRouter = transactionTypeToFormattedTransaction
  private constructor(private readonly store: Store<AppState>) { }

  public static create(store: Store<AppState>) {
    return new TransactionFormatter(store)
  }

  formatAndSaveTransactions(
    transactions: Transaction[],
    options?: TransactionFormatterOptions,
  ): void {
    const formattedTransactions = this.formatTransactions(transactions, options)

    if(!options) {
      this.store.commit('SET_TRANSACTION_LIST', formattedTransactions)
      return
    }

    if (options.transactionCategory && options.transactionCategory === TransactionCategories.TO_COSIGN) {
      this.store.commit('ADD_TRANSACTIONS_TO_COSIGN', formattedTransactions)
      return
    }

    if (options.transactionStatusGroup === TransactionStatusGroups.unconfirmed) {
      this.store.commit('SET_UNCONFIRMED_TRANSACTION_LIST', formattedTransactions)
      return
    }

    this.store.commit('SET_TRANSACTION_LIST', formattedTransactions)
  }

  formatAndSaveNewTransaction = (
    transaction: Transaction,
    options?: TransactionFormatterOptions,
  ): void => {
    const formattedTransaction = this.formatTransaction(transaction, options)

    if (formattedTransaction.transactionStatusGroup === TransactionStatusGroups.unconfirmed) {
      this.store.commit('ADD_UNCONFIRMED_TRANSACTION', formattedTransaction)
      return
    }

    this.store.commit('ADD_CONFIRMED_TRANSACTION', formattedTransaction)
  }

  formatTransactions(
    transactions: Transaction[],
    options?: TransactionFormatterOptions,
  ): FormattedTransaction[] {
    return transactions.map(transaction => this.formatTransaction(transaction, options))
  }

  formatTransaction(
    transaction: Transaction,
    options?: TransactionFormatterOptions,
  ): FormattedTransaction {
    return this.getFormattedTransaction(transaction, options)
  }

  getFormattedTransaction(transaction: Transaction, options: TransactionFormatterOptions) {
    const {type} = transaction
    const formatter = this.transactionTypeRouter(`${type}`)
    if (!formatter) {
      throw new Error(`no formatter found for transaction type ${type}`)
    }  
    return new formatter(transaction, this.store, options)
  }
}
