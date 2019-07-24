export default {
    state: {
        apiUrl: 'http://120.79.181.170',
        marketUrl: 'http://app.nemcn.io/rest/market',
        local: false,
        currentPanelIndex: 0,
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
        mnemonic: ''
    },
    getters: {},
    mutations: {
        SET_CURRENT_PANEL_INDEX: function (state, index) {
            state.currentPanelIndex = index;
        },
        SET_WALLET_LIST: function (state, walletList) {
            state.walletList = walletList;
        },
        SET_HAS_WALLET: function (state, hasWallet) {
            state.hasWallet = hasWallet;
        },
        SET_MNEMONIC: function (state, mnemonic) {
            state.mnemonic = mnemonic;
        }
    },
};
//# sourceMappingURL=index.js.map