import {networkConfig} from '@/config/index.ts'
import {nodeListConfig} from "@/config/view/node";
import {localRead} from "@/core/utils";
import {AppInfo} from '@/core/model'

export default {
    state: {
        timeZone: new Date().getTimezoneOffset() / 60,   // current time zone
        locale: 'en-US',
        currentPanelIndex: 0,
        walletList: [],
        hasWallet: false,
        isNodeHealthy: false,
        mnemonic: '',
        chainStatus: {
            currentGenerateTime: networkConfig.currentGenerateTime,
            currentHeight: 0,
            numTransactions: 0,
            currentBlockInfo: {},
            signerPublicKey: '',
            nodeAmount: nodeListConfig.length
        },
        mosaicsLoading: true,
        balanceLoading: false,
        transactionsLoading: false,
        namespaceLoading: true,
        xemUsdPrice: 0,
        multisigLoading: true,
        _ENABLE_TREZOR_: localRead("_ENABLE_TREZOR_") === "true"
    },
    getters: {},
    mutations: {
        RESET_APP(state: AppInfo) {
            state.hasWallet = false
            state.mnemonic = ''
            state.walletList = []
        },
        SET_CURRENT_PANEL_INDEX(state: AppInfo, index: any) {
            state.currentPanelIndex = index
        },
        SET_WALLET_LIST(state: AppInfo, walletList: any[]): void {
            state.walletList = walletList
        },
        SET_HAS_WALLET(state: AppInfo, hasWallet: boolean): void {
            state.hasWallet = hasWallet
        },
        SET_MNEMONIC(state: AppInfo, mnemonic: string): void {
            state.mnemonic = mnemonic
        },
        SET_TIME_ZONE(state: AppInfo, timeZone: number): void {
            state.timeZone = timeZone
        },
        SET_IS_NODE_HEALTHY(state: AppInfo, isNodeHealthy: boolean) {
            state.isNodeHealthy = isNodeHealthy
        },
        SET_MOSAICS_LOADING(state: AppInfo, bool: boolean) {
            state.mosaicsLoading = bool
        },
        SET_BALANCE_LOADING(state: AppInfo, bool: boolean) {
            state.balanceLoading = bool
        },
        SET_TRANSACTIONS_LOADING(state: AppInfo, bool: boolean) {
            state.transactionsLoading = bool
        },
        SET_MULTISIG_LOADING(state: AppInfo, bool: boolean) {
            state.multisigLoading = bool
        },
        SET_XEM_USD_PRICE(state: AppInfo, value: number) {
            state.xemUsdPrice = value
        },
        SET_CHAIN_STATUS(state: AppInfo, chainStatus: any) {
            const {currentHeight, numTransactions, currentBlockInfo, signerPublicKey, nodeAmount} = chainStatus
            state.chainStatus.currentHeight = currentHeight ? currentHeight : state.chainStatus.currentHeight
            state.chainStatus.numTransactions = numTransactions ? numTransactions : state.chainStatus.numTransactions
            state.chainStatus.currentBlockInfo = currentBlockInfo ? currentBlockInfo : state.chainStatus.currentBlockInfo
            state.chainStatus.signerPublicKey = signerPublicKey ? signerPublicKey : state.chainStatus.signerPublicKey
            state.chainStatus.nodeAmount = nodeAmount ? nodeAmount : state.chainStatus.nodeAmount

        },
        SET_CHAIN_HEIGHT(state: AppInfo, chainHeight: number) {
            state.chainStatus.currentHeight = chainHeight || 0
        },
        SET_NAMESPACE_LOADING(state: AppInfo, namespaceLoading: boolean) {
            state.namespaceLoading = namespaceLoading
        },
    }
}
