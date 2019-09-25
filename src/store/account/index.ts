import {Account, Transaction, MultisigAccountInfo} from 'nem2-sdk'
import {defaultNetworkConfig} from "@/config/index"
import {FormattedTransaction, AddressAndTransaction, AppNamespace, AddressAndNamespaces, AddressAndMosaics, AddressAndMultisigInfo} from '@/core/model'
import {AppMosaic} from '@/core/model'
import {nodeListConfig} from "@/config/view/node"
import Vue from 'vue'

declare interface account {
    node: string,
    // @TODO: the currentXem should be renamed
    currentXem: string,
    currentXEM1: string,
    account: Account | any,
    wallet: any,
    mosaics: Record<string, AppMosaic>,
    namespaces: any[],
    errorTx: Array<any>,
    addressAliasMap: any,
    generationHash: string,
    xemDivisibility: number
    transactionList: FormattedTransaction[],
    accountName: string
    networkMosaic: AppMosaic,
    activeMultisigAccount: string,
    multisigAccountsMosaics: Record<string, AppMosaic[]>,
    multisigAccountsNamespaces: Record<string, AppNamespace[]>,
    multisigAccountsTransactions: Record<string, Transaction[]>,
    multisigAccountInfo: Record<string, MultisigAccountInfo[]>,
}

export default {
    state: {
        node: nodeListConfig.find((node) => node.isSelected).value,
        currentXem: defaultNetworkConfig.currentXem,
        currentXEM1: defaultNetworkConfig.currentXEM1,
        account: {},
        wallet: {},
        mosaics: {},
        namespaces: [],
        errorTx: [],
        addressAliasMap: {},
        generationHash: '',
        xemDivisibility: 6,
        transactionList: [],
        accountName: '',
        activeMultisigAccount: null,
        multisigAccountsMosaics: {},
        multisigAccountsNamespaces: {},
        multisigAccountsTransactions: {},
        multisigAccountInfo: {},
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
        RESET_ACCOUNT(state: account) {
            state.account = {}
            state.wallet = {}
            state.mosaics = {}
            state.namespaces = []
            state.addressAliasMap = {}
            state.transactionList = []
            state.accountName = ''
        }
        ,
        SET_ACCOUNT(state: account, account: Account): void {
            state.account = account
        },
        SET_WALLET(state: account, wallet: any): void {
            state.wallet = wallet
        },
        SET_MOSAICS(state: account, mosaics: any): void {
            state.mosaics = mosaics
        },
        UPDATE_MOSAICS(state: account, mosaics: AppMosaic[]): void {
            const mosaicList = {...state.mosaics}
            mosaics.forEach((mosaic: AppMosaic) => {
                if (!mosaic.hex) return
                const {hex} = mosaic
                if (!mosaicList[hex]) mosaicList[hex] = new AppMosaic({hex})
                Object.assign(mosaicList[mosaic.hex], mosaic)
            })
            state.mosaics = mosaicList
        },
        /**
         * @TODO: refactor
         * This mutation is not watched by the appMosaics plugin
         */
        UPDATE_MOSAICS_INFO(state: account, mosaics: AppMosaic[]): void {
            const mosaicList = state.mosaics
            mosaics.forEach((mosaic: AppMosaic) => {
                if (!mosaic.hex) return
                const {hex} = mosaic
                if (!mosaicList[hex]) mosaicList[hex] = new AppMosaic({hex})
                Object.assign(mosaicList[mosaic.hex], mosaic)
            })
        },
        /**
         * @TODO: refactor
         * This mutation is not watched by the appMosaics plugin
         */
        UPDATE_MOSAICS_NAMESPACES(state: account, mosaics: AppMosaic[]): void {
            const mosaicList = state.mosaics
            mosaics.forEach((mosaic: AppMosaic) => {
                if (!mosaic.hex) return
                const {hex} = mosaic
                if (!mosaicList[hex]) mosaicList[hex] = new AppMosaic({hex})
                Object.assign(mosaicList[mosaic.hex], mosaic)
            })
        },
        RESET_MOSAICS(state: account) {
            state.mosaics = {}
        },
        SET_NETWORK_MOSAIC(state: account, mosaic: AppMosaic) {
            state.networkMosaic = mosaic
        },
        SET_NAMESPACES(state: account, namespaces: any[]): void {
            state.namespaces = namespaces
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
        SET_ADDRESS_ALIAS_MAP(state: account, addressAliasMap: any): void {
            state.addressAliasMap = addressAliasMap
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
        ADD_UNCONFIRMED_TRANSACTION(state: account, txList: any) {
            state.transactionList.unshift(txList[0])
        },
        ADD_CONFIRMED_TRANSACTION(state: account, txList: any) {
            // @TODO merge or separate these 2 lists in different objects
            const newTx = txList[0]
            const newStateTransactions = [...state.transactionList]
            const txIndex = newStateTransactions
                .findIndex(({txHeader}) => newTx.txHeader.hash === txHeader.hash)

            if (txIndex > -1 && newStateTransactions[txIndex].isTxUnconfirmed) {
                newStateTransactions.splice(txIndex, 1)
            }

            newStateTransactions.unshift(newTx)
            state.transactionList = newStateTransactions
        },
        SET_CURRENT_XEM(state: account, currentXem: string) {
            state.currentXem = currentXem
        },
        SET_ACCOUNT_NAME(state: account, accountName: string) {
            state.accountName = accountName
        },
        SET_MULTISIG_ACCOUNT_INFO(state:account, addressAndMultisigInfo: AddressAndMultisigInfo) {
              const {address, multisigAccountInfo} = addressAndMultisigInfo
              Vue.set(state.multisigAccountInfo, address, multisigAccountInfo)
        },
        SET_ACTIVE_MULTISIG_ACCOUNT(state: account, publicKey: string) {
            if (publicKey === state.wallet.publicKey) {
              state.activeMultisigAccount = null
              return
            }
            state.activeMultisigAccount = publicKey
        },
        ADD_CONFIRMED_MULTISIG_ACCOUNT_TRANSACTION( state: account,
                                                    addressAndTransaction: AddressAndTransaction) {
            const {address, transaction} = addressAndTransaction
            const list = {...state.multisigAccountsTransactions}
            if (!list[address]) list[address] = []
            list[address].unshift(transaction)
            Vue.set(state.multisigAccountsTransactions, address, list)
        },
        SET_MULTISIG_ACCOUNT_NAMESPACES( state: account, addressAndNamespaces: AddressAndNamespaces) {
            const {address, namespaces} = addressAndNamespaces
            Vue.set(state.multisigAccountsNamespaces, address, namespaces)
        },
        SET_MULTISIG_ACCOUNT_MOSAICS( state: account, addressAndMosaics: AddressAndMosaics) {
            const {address, mosaics} = addressAndMosaics
            Vue.set(state.multisigAccountsMosaics, address, mosaics)
        },
    },
}
