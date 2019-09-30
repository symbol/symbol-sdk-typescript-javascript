import Vue from 'vue'
import {Account} from 'nem2-sdk'
import {defaultNetworkConfig} from "@/config/index"
import {
  AddressAndTransaction, AddressAndNamespaces, AddressAndMosaics,
  AddressAndMultisigInfo, StoreAccount, AppMosaic,
} from '@/core/model'
import {nodeListConfig} from "@/config/view/node"

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
        RESET_ACCOUNT(state: StoreAccount) {
            state.account = {}
            state.wallet = null
            state.mosaics = {}
            state.namespaces = []
            state.addressAliasMap = {}
            state.transactionList = []
            state.accountName = ''
        }
        ,
        SET_ACCOUNT(state: StoreAccount, account: Account): void {
            state.account = account
        },
        SET_WALLET(state: StoreAccount, wallet: any): void {
            state.wallet = wallet
        },
        SET_MOSAICS(state: StoreAccount, mosaics: any): void {
            state.mosaics = mosaics
        },
        UPDATE_MOSAICS(state: StoreAccount, mosaics: AppMosaic[]): void {
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
        UPDATE_MOSAICS_INFO(state: StoreAccount, mosaics: AppMosaic[]): void {
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
        UPDATE_MOSAICS_NAMESPACES(state: StoreAccount, mosaics: AppMosaic[]): void {
            const mosaicList = state.mosaics
            mosaics.forEach((mosaic: AppMosaic) => {
                if (!mosaic.hex) return
                const {hex} = mosaic
                if (!mosaicList[hex]) mosaicList[hex] = new AppMosaic({hex})
                Object.assign(mosaicList[mosaic.hex], mosaic)
            })
        },
        RESET_MOSAICS(state: StoreAccount) {
            state.mosaics = {}
        },
        SET_NETWORK_MOSAIC(state: StoreAccount, mosaic: AppMosaic) {
            state.networkMosaic = mosaic
        },
        SET_NAMESPACES(state: StoreAccount, namespaces: any[]): void {
            state.namespaces = namespaces
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
        SET_CURRENT_XEM_1(state: StoreAccount, currentXEM1: string): void {
            state.currentXEM1 = currentXEM1
        },
        SET_ADDRESS_ALIAS_MAP(state: StoreAccount, addressAliasMap: any): void {
            state.addressAliasMap = addressAliasMap
        },
        SET_XEM_DIVISIBILITY(state: StoreAccount, xemDivisibility: number) {
            state.xemDivisibility = xemDivisibility
        },
        SET_WALLET_BALANCE(state: StoreAccount, balance: number) {
            state.wallet.balance = balance
        },
        SET_TRANSACTION_LIST(state: StoreAccount, list: any[]) {
            state.transactionList = list
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

            if (txIndex > -1 && newStateTransactions[txIndex].isTxUnconfirmed) {
                newStateTransactions.splice(txIndex, 1)
            }

            newStateTransactions.unshift(newTx)
            state.transactionList = newStateTransactions
        },
        SET_CURRENT_XEM(state: StoreAccount, currentXem: string) {
            state.currentXem = currentXem
        },
        SET_ACCOUNT_NAME(state: StoreAccount, accountName: string) {
            state.accountName = accountName
        },
        SET_MULTISIG_ACCOUNT_INFO(state:StoreAccount, addressAndMultisigInfo: AddressAndMultisigInfo) {
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
        ADD_CONFIRMED_MULTISIG_ACCOUNT_TRANSACTION( state: StoreAccount,
                                                    addressAndTransaction: AddressAndTransaction) {
            const {address, transaction} = addressAndTransaction
            const list = {...state.multisigAccountsTransactions}
            if (!list[address]) list[address] = []
            list[address].unshift(transaction)
            Vue.set(state.multisigAccountsTransactions, address, list)
        },
        SET_MULTISIG_ACCOUNT_NAMESPACES( state: StoreAccount, addressAndNamespaces: AddressAndNamespaces) {
            const {address, namespaces} = addressAndNamespaces
            Vue.set(state.multisigAccountsNamespaces, address, namespaces)
        },
        UPDATE_MULTISIG_ACCOUNT_MOSAICS(state: StoreAccount, addressAndMosaics: AddressAndMosaics): void {
            const {address, mosaics} = addressAndMosaics
            const mosaicList = {...state.multisigAccountsMosaics[address]}

            console.log(mosaics, address, 'UPDATE_MULTISIG_ACCOUNT_MOSAICS', mosaicList)
            mosaics.forEach((mosaic: AppMosaic) => {
                if (!mosaic.hex) return
                const {hex} = mosaic
                if (!mosaicList[hex]) mosaicList[hex] = new AppMosaic({hex})
                Object.assign(mosaicList[mosaic.hex], mosaic)
            })
            Vue.set(state.multisigAccountsMosaics, address, mosaicList)
        },
        SET_WALLET_IMPORTANCE(state: StoreAccount, importance: number) {
            state.wallet.importance = importance
        }
    },
}
