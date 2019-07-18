export default {
    state: {
        apiUrl: 'http://185.239.227.252:8087',
        communityUrl: 'http://192.168.0.119',
        marketUrl: 'http://app.nemcn.io/rest/market/kline',
        local: false,
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
        unClick: true
    },
    getters: {},
    mutations: {
        SET_WALLET_LIST: function (state, walletList) {
            state.walletList = walletList;
        },
        SET_HAS_WALLET: function (state, hasWallet) {
            state.hasWallet = hasWallet;
        },
    },
};
//# sourceMappingURL=index.js.map