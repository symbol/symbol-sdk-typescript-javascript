import {Transaction, Address} from 'nem2-sdk'
import {transactionFormatter} from './transactionFormatter'
      
// @TODO currentXem
export const transactionFormat = (  transactionList: Array<Transaction>,
                                    accountAddress: string,
                                    currentXEM: string,
                                    xemDivisibility: number,
                                    node: string,
                                    currentXem: string) => {
    return transactionList
        .map((transaction: Transaction) => transactionFormatter(
            [transaction],
            Address.createFromRawAddress(accountAddress),
            currentXEM,
            xemDivisibility,
            node,
            currentXem)[0],
        )
}

