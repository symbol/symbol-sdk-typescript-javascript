declare interface appInfo {
    local: any,
    localMap: any,
    walletList:any[]
    hasWallet:boolean,
    unClick:boolean
}
export default {
    state: {
        apiUrl: 'http://185.239.227.252:8087',
        communityUrl:'http://192.168.0.119',
        local: false,
        localMap: {
            'zh-CN': '中文',
            'en-US': 'English'
        },
        walletList:[],
        hasWallet:false,
        unClick:true
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
