declare interface appInfo {
    walletList: any[]
    hasWallet: boolean,
    currentPanelIndex: number,
    mnemonic: string,
    timeZone: number,
    isNodeHealthy: boolean,
    chainStatus: {
        currentHeight: number,
        currentGenerateTime: number,
        numTransactions: number,
        currentBlockInfo: any,
        preBlockInfo?: any,
        signerPublicKey?: string,
        nodeAmount?: number
    }
}

export default {
    state: {
        timeZone: new Date().getTimezoneOffset() / 60,   // current time zone
        locale: false,
        currentPanelIndex: 0,
        walletList: [],
        hasWallet: false,
        isNodeHealthy: false,
        mnemonic: '',
        chainStatus: {
            currentHeight: 0,
            currentGenerateTime: 12,
            numTransactions: 0,
            currentBlockInfo: {},
            preBlockInfo: {},
            signerPublicKey: '',
            nodeAmount: 4
        }
    },
    getters: {},
    mutations: {
        SET_CURRENT_PANEL_INDEX(state: appInfo, index: any) {
            state.currentPanelIndex = index
        },
        SET_WALLET_LIST(state: appInfo, walletList: any[]): void {
            state.walletList = walletList
        },
        SET_HAS_WALLET(state: appInfo, hasWallet: boolean): void {
            state.hasWallet = hasWallet
        },
        SET_MNEMONIC(state: appInfo, mnemonic: string): void {
            state.mnemonic = mnemonic
        },
        SET_TIME_ZONE(state: appInfo, timeZone: number): void {
            state.timeZone = timeZone
        },
        SET_IS_NODE_HEALTHY(state: appInfo, isNodeHealthy: boolean) {
            state.isNodeHealthy = isNodeHealthy
        },

        SET_CHAIN_STATUS(state: appInfo, chainStatus: any) {
            const {currentHeight, currentGenerateTime, numTransactions, currentBlockInfo, preBlockInfo, signerPublicKey, nodeAmount} = chainStatus
            state.chainStatus.currentHeight = currentHeight ? currentHeight : state.chainStatus.currentHeight
            state.chainStatus.currentGenerateTime = currentGenerateTime ? currentGenerateTime : state.chainStatus.currentGenerateTime
            state.chainStatus.numTransactions = numTransactions ? numTransactions : state.chainStatus.numTransactions
            state.chainStatus.currentBlockInfo = currentBlockInfo ? currentBlockInfo : state.chainStatus.currentBlockInfo
            state.chainStatus.preBlockInfo = preBlockInfo ? preBlockInfo : state.chainStatus.preBlockInfo
            state.chainStatus.signerPublicKey = signerPublicKey ? signerPublicKey : state.chainStatus.signerPublicKey
            state.chainStatus.nodeAmount = nodeAmount ? nodeAmount : state.chainStatus.nodeAmount
        },
    }
}
