declare interface appInfo {
    local: any,
    localMap: any,
    walletList:any[]
    hasWallet:boolean
}
export default {
    state: {
        local: false,
        localMap: {
            'zh-CN': '中文',
            'en-US': '英文'
        },
        walletList:[],
        hasWallet:false
    },
    getters: {

    },
    mutations: {
        SET_WALLET_LIST(state: appInfo, walletList: any[]): void {
            state.walletList = walletList
        },
        SET_HAS_WALLET(state: appInfo, hasWallet: boolean): void {
            state.hasWallet = hasWallet
        },
    },
}
