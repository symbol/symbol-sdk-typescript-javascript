import Vue from 'vue'
import {MutationTree} from 'vuex'
import {defaultNetworkConfig} from "@/config/index"
import {
    AddressAndTransaction, AddressAndNamespaces, AddressAndMosaics,
    AddressAndMultisigInfo, StoreAccount, AppMosaic, NetworkCurrency,
    AppWallet, AppNamespace, FormattedTransaction,
} from '@/core/model'
import {nodeListConfig} from "@/config/view/node"

const state: StoreAccount = {
    node: nodeListConfig.find((node) => node.isSelected).value,
    wallet: null,
    mosaics: {},
    namespaces: [],
    errorTx: [],
    addressAliasMap: {},
    generationHash: '',
    transactionList: [],
    transactionsToCosign: {},
    accountName: '',
    activeMultisigAccount: null,
    multisigAccountsMosaics: {},
    multisigAccountsNamespaces: {},
    multisigAccountsTransactions: {},
    multisigAccountInfo: {},
    networkCurrency: defaultNetworkConfig.defaultNetworkMosaic,
    networkMosaics: {},
    activeWalletAddress: '',
}

const updateMosaics = (state: StoreAccount, mosaics: AppMosaic[]) => {
    if (!mosaics) return // @TODO: quick fix
    mosaics.forEach((mosaic: AppMosaic) => {
        const {hex} = mosaic
        const storeMosaic = state.mosaics[hex] || {}
        Vue.set(state.mosaics, hex, {...storeMosaic, ...mosaic})
    })
}

const mutations: MutationTree<StoreAccount> = {
    RESET_ACCOUNT(state: StoreAccount) {
        state.wallet = null
        state.mosaics = {}
        state.namespaces = []
        state.addressAliasMap = {}
        state.transactionList = []
        state.accountName = ''
    },
    SET_WALLET(state: StoreAccount, wallet: AppWallet): void {
        state.wallet = wallet
    },
    SET_MOSAICS(state: StoreAccount, mosaics: Record<string, AppMosaic>): void {
        state.mosaics = mosaics
    },
    SET_NETWORK_MOSAICS(state: StoreAccount, mosaics: AppMosaic[]): void {
        state.networkMosaics = {}
        mosaics.forEach(mosaic => state.networkMosaics[mosaic.hex] = mosaic)
    },
    UPDATE_MOSAICS(state: StoreAccount, mosaics: AppMosaic[]): void {
        updateMosaics(state, mosaics)
    },
    /**
     * This mutation's purpose is to not be watched by the appMosaics plugin
     */
    UPDATE_MOSAICS_INFO(state: StoreAccount, mosaics: AppMosaic[]): void {
        updateMosaics(state, mosaics)
    },
    /**
     * This mutation's purpose is to not be watched by the appMosaics plugin
     */
    UPDATE_MOSAICS_NAMESPACES(state: StoreAccount, mosaics: AppMosaic[]): void {
        updateMosaics(state, mosaics)
    },
    RESET_MOSAICS(state: StoreAccount) {
        state.mosaics = {...state.networkMosaics}
    },
    SET_NETWORK_CURRENCY(state: StoreAccount, mosaic: NetworkCurrency) {
        state.networkCurrency = mosaic
    },
    RESET_NAMESPACES(state: StoreAccount): void {
        state.namespaces = []
    },
    UPDATE_NAMESPACES(state: StoreAccount, namespaces: AppNamespace[]): void {
        const namespacesToUpdate = [...state.namespaces]

        const updatedNamespaces =  namespaces.map(newNamespace => {
            const oldNamespace = namespacesToUpdate.find(({hex}) => hex === newNamespace.hex)
            if (oldNamespace === undefined) return newNamespace
            return AppNamespace.fromNamespaceUpdate(oldNamespace, newNamespace)
        })

        const namespacesNotUpdated = namespacesToUpdate.filter(({hex}) => namespaces.find(ns => ns.hex === hex) === undefined)
        
        state.namespaces = [...namespacesNotUpdated, ...updatedNamespaces]
    },
    ADD_NAMESPACE_FROM_RECIPIENT_ADDRESS(state: StoreAccount, namespaces: AppNamespace[]) {
        state.namespaces = [...state.namespaces, ...namespaces]
    },
    SET_NODE(state: StoreAccount, node: string): void {
        state.node = node
    },
    SET_GENERATION_HASH(state: StoreAccount, generationHash: string): void {
        state.generationHash = generationHash
    },
    SET_ERROR_TEXT(state: StoreAccount, errorTx: Array<any>): void {
        state.errorTx = errorTx
    },
    SET_ADDRESS_ALIAS_MAP(state: StoreAccount, addressAliasMap: any): void {
        state.addressAliasMap = addressAliasMap
    },
    SET_WALLET_BALANCE(state: StoreAccount, balance: number) {
        state.wallet.balance = balance
    },
    RESET_TRANSACTION_LIST(state: StoreAccount) {
        state.transactionList = []
    },
    SET_TRANSACTION_LIST(state: StoreAccount, list: FormattedTransaction[]) {
        state.transactionList = list
    },
    SET_UNCONFIRMED_TRANSACTION_LIST(state: StoreAccount, list: FormattedTransaction[]) {
        state.transactionList.unshift(...list)
    },
    ADD_UNCONFIRMED_TRANSACTION(state: StoreAccount, txList: any) {
        state.transactionList.unshift(txList[0])
    },
    ADD_CONFIRMED_TRANSACTION(state: StoreAccount, txList: any) {
        // @TODO merge or separate these 2 lists in different objects
        const newTx = txList[0]
        const newStateTransactions = [...state.transactionList]
        const txIndex = newStateTransactions
            .findIndex(({txHeader}) => newTx.txHeader.hash === txHeader.hash)

        if (txIndex > -1) newStateTransactions.splice(txIndex, 1)
        newStateTransactions.unshift(newTx)
        state.transactionList = newStateTransactions
    },
    SET_ACCOUNT_NAME(state: StoreAccount, accountName: string) {
        state.accountName = accountName
    },
    SET_MULTISIG_ACCOUNT_INFO(state: StoreAccount, addressAndMultisigInfo: AddressAndMultisigInfo) {
        const {address, multisigAccountInfo} = addressAndMultisigInfo
        Vue.set(state.multisigAccountInfo, address, multisigAccountInfo)
    },
    SET_ACTIVE_MULTISIG_ACCOUNT(state: StoreAccount, publicKey: string) {
        if (publicKey === state.wallet.publicKey) {
            state.activeMultisigAccount = null
            return
        }
        state.activeMultisigAccount = publicKey
    },
    ADD_CONFIRMED_MULTISIG_ACCOUNT_TRANSACTION(state: StoreAccount,
                                               addressAndTransaction: AddressAndTransaction) {
        const {address, transaction} = addressAndTransaction
        const list = {...state.multisigAccountsTransactions}
        if (!list[address]) list[address] = []
        list[address].unshift(transaction)
        Vue.set(state.multisigAccountsTransactions, address, list)
    },
    SET_MULTISIG_ACCOUNT_NAMESPACES(state: StoreAccount, addressAndNamespaces: AddressAndNamespaces) {
        const {address, namespaces} = addressAndNamespaces
        Vue.set(state.multisigAccountsNamespaces, address, namespaces)
    },
    UPDATE_MULTISIG_ACCOUNT_MOSAICS(state: StoreAccount, addressAndMosaics: AddressAndMosaics): void {
        const {address, mosaics} = addressAndMosaics
        const mosaicList = {...state.multisigAccountsMosaics[address]}

        mosaics.forEach((mosaic: AppMosaic) => {
            if (!mosaic.hex) return
            const {hex} = mosaic
            if (!mosaicList[hex]) mosaicList[hex] = new AppMosaic({hex})
            Object.assign(mosaicList[mosaic.hex], mosaic)
        })
        Vue.set(state.multisigAccountsMosaics, address, mosaicList)
    },
    UPDATE_ACTIVE_WALLET_ADDRESS(state: StoreAccount, activeWalletAddress: string) {
        state.activeWalletAddress = activeWalletAddress
    },
    RESET_TRANSACTIONS_TO_COSIGN(state: StoreAccount) {
        state.transactionsToCosign = {}
    },
    RESET_ADDRESS_TRANSACTION_TO_COSIGN(state: StoreAccount, publicKey: string) {
        if (!state.transactionsToCosign[publicKey]) return
        state.transactionsToCosign[publicKey] = []
    },
    POP_TRANSACTION_TO_COSIGN_BY_HASH(state: StoreAccount, payload: {publicKey: string, hash: string}) {
        const {publicKey, hash} = payload
        const txToCosign = [...state.transactionsToCosign[publicKey]]
        if (!txToCosign) return
        const transactionIndex = txToCosign.findIndex(({rawTx}) => rawTx.transactionInfo.hash === hash)
        if (transactionIndex === -1) return
        txToCosign.splice(transactionIndex, 1)
        state.transactionsToCosign[publicKey] = txToCosign
    },
    ADD_TRANSACTION_TO_COSIGN(state: StoreAccount, payload: {publicKey: string, transactions: FormattedTransaction[]}) {
        const {publicKey, transactions} = payload
        const oldTransactions = state.transactionsToCosign[publicKey]

        if (!oldTransactions) {
            Vue.set(state.transactionsToCosign, publicKey, transactions)
            return
        }
        
        transactions.forEach((tx) => {
            if (oldTransactions.find(({rawTx}) => rawTx.transactionInfo.hash === tx.rawTx.transactionInfo.hash) === undefined) {
                Vue.set(state.transactionsToCosign, publicKey, [...transactions, ...oldTransactions])
            }
        })
    }
}

export const accountState = {state}
export const accountMutations = {mutations}
