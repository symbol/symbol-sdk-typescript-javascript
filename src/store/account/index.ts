import {Account, TransactionType} from 'nem2-sdk'
import {nodeConfig} from "@/config/index.ts"

declare interface account {
    node: string,
    // @TODO: the currentXem should be renamed
    currentXem: string,
    currentXEM1: string,
    currentXEM2: string,
    account: Account,
    wallet: any,
    mosaics: any[],
    namespace: any[],
    errorTx: Array<any>,
    addresAliasMap: any,
    generationHash: string,
    xemDivisibility: number
    transactionList: any,
}

export default {
    state: {
        node: nodeConfig.node,
        currentXem: nodeConfig.currentXem,
        currentXEM1: nodeConfig.currentXEM1,
        currentXEM2: nodeConfig.currentXEM2,
        account: {},
        wallet: {},
        mosaics: {},
        namespace: [],
        errorTx: [],
        addresAliasMap: {},
        generationHash: '',
        xemDivisibility: 6,
        transactionList: {
            transferTransactionList: [],
            receiptList: [],
        },
    },
    getters: {
        wallet(state) {
            return state.wallet
        },
        currentXEM1(state) {
            return state.currentXEM1
        },
        xemDivisibility(state) {
            return state.xemDivisibility
        },
        node(state) {
            return state.node
        },
        currentXem(state) {
            return state.currentXem
        },
        mosaicList(state) {
            return state.mosaics
        },
        transactions(state) {
            return state.transactionList
        }
    },
    mutations: {
        SET_ACCOUNT(state: account, account: Account): void {
            state.account = account
        },
        SET_WALLET(state: account, wallet: any): void {
            state.wallet = wallet
        },
        SET_MOSAICS(state: account, mosaics: any[]): void {
            state.mosaics = mosaics
        },
        SET_NAMESPACE(state: account, namespace: any[]): void {
            state.namespace = namespace
        },
        SET_NODE(state: account, node: string): void {
            state.node = node
        },
        SET_GENERATION_HASH(state: account, generationHash: string): void {
            state.generationHash = generationHash
        },
        SET_ERROR_TEXT(state: account, errorTx: Array<any>): void {
            state.errorTx = errorTx
        },
        SET_CURRENT_XEM_1(state: account, currentXEM1: string): void {
            state.currentXEM1 = currentXEM1
        },
        SET_ADDRESS_ALIAS_MAP(state: account, addresAliasMap: any): void {
            state.addresAliasMap = addresAliasMap
        },
        SET_XEM_DIVISIBILITY(state: account, xemDivisibility: number) {
            state.xemDivisibility = xemDivisibility
        },
        SET_WALLET_BALANCE(state: account, balance: number) {
            state.wallet.balance = balance
        },
        SET_TRANSACTION_LIST(state: account, list: any[]) {
            state.transactionList = list
        },
        ADD_UNCONFIRMED_TRANSACTION(state: account, list: any) {
            if (list.transferTransactionList.length) {
                state.transactionList.transferTransactionList.unshift(list.transferTransactionList[0])
            } 
            if (list.receiptList.length) {
                state.transactionList.receiptList.unshift(list.receiptList[0])
            } 
        },
        ADD_CONFIRMED_TRANSACTION(state: account, tx: any) {
            // @TODO merge or separate these 2 lists in different objects
            const newTx = tx.transferTransactionList.length ? tx.transferTransactionList[0] : tx.receiptList[0]
            const listName = newTx.type === TransactionType.TRANSFER ? 'transferTransactionList' : 'receiptList' 
            const otherListName = newTx.type !== TransactionType.TRANSFER ? 'transferTransactionList' : 'receiptList'

            const stateTransactions = {...state.transactionList}
            const txFromStore = stateTransactions[listName]

            const txIndex = txFromStore.findIndex(({transactionInfo}) => newTx.transactionInfo.hash === transactionInfo.hash)
            if(txIndex > -1 && txFromStore[txIndex].isTxUnconfirmed) txFromStore.splice(txIndex, 1)
            
            txFromStore.push(newTx)

            const newTransactionList = {
                [listName]: txFromStore,
                [otherListName]: [...state.transactionList[otherListName]]
            }

            state.transactionList = newTransactionList
        },
        SET_CURRENT_XEM(state: account, currentXem: string) {
            state.currentXem = currentXem
        }
    },
}
 