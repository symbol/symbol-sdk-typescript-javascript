declare interface appInfo {
    local: any,
    localMap: any,
    walletList: any[]
    hasWallet: boolean,
    unClick: boolean,
    languageList: Array<any>,
    currentPanelIndex:number,
    mnemonic:any
}

export default {
    state: {
        apiUrl: 'http://120.79.181.170',
        marketUrl: 'http://app.nemcn.io/rest/market',
        local: false,
        currentPanelIndex:0,
        localMap: {
            'zh-CN': '中文',
            'en-US': 'English'
        },
        languageList: [
            {
                value: 'zh-CN',
                label: '中文'
            },
            {
                value: 'en-US',
                label: 'English'
            }
        ],
        walletList: [],
        hasWallet: false,
        unClick: true,
        mnemonic:''
    },
    getters: {},
    mutations: {
        SET_CURRENT_PANEL_INDEX(state: appInfo, index:any){
            state.currentPanelIndex = index
        },
        SET_WALLET_LIST(state: appInfo, walletList: any[]): void {
            state.walletList = walletList
        },
        SET_HAS_WALLET(state: appInfo, hasWallet: boolean): void {
            state.hasWallet = hasWallet
        },
        SET_MNEMONIC(state: appInfo, mnemonic: any): void {
            state.mnemonic = mnemonic
        },
    },
}
