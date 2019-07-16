export default {
    state: {
        apiUrl: 'http://185.239.227.252:8087',
        communityUrl: 'http://192.168.0.119',
        local: false,
        localMap: {
            'zh-CN': '中文',
            'en-US': '英文'
        },
        walletList: [],
        hasWallet: false
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