var routers = [
    {
        path: '/home',
        name: 'home',
        // @ts-ignore
        component: function () { return import('@/components/menu-bar/MenuBar.vue'); },
        children: [
            {
                path: '/monitorPanel',
                name: 'monitorPanel',
                // @ts-ignore
                component: function () { return import('@/views/monitor/monitor-panel/MonitorPanel.vue'); },
                children: [
                    {
                        path: '/dashBoard',
                        name: 'dashBoard',
                        // @ts-ignore
                        component: function () { return import('@/views/monitor/monitor-dashboard/MonitorDashBoard.vue'); }
                    }, {
                        path: '/market',
                        name: 'market',
                        // @ts-ignore
                        component: function () { return import('@/views/monitor/monitor-market/MonitorMarket.vue'); }
                    }, {
                        path: '/transfer',
                        name: 'transfer',
                        // @ts-ignore
                        component: function () { return import('@/views/monitor/monitor-transfer/MonitorTransfer.vue'); }
                    }, {
                        path: '/receipt',
                        name: 'receipt',
                        // @ts-ignore
                        component: function () { return import('@/views/monitor/monitor-receipt/MonitorReceipt.vue'); }
                    }, {
                        path: '/remote',
                        name: 'remote',
                        // @ts-ignore
                        component: function () { return import('@/views/monitor/monitor-dashboard/MonitorDashBoard.vue'); }
                    },
                ]
            }, {
                path: '/walletPanel',
                name: 'walletPanel',
                // @ts-ignore
                component: function () { return import('@/views/wallet-management/wallet-panel/WalletPanel.vue'); },
                children: [
                    {
                        path: '/walletDetails',
                        name: 'walletDetails',
                        // @ts-ignore
                        component: function () { return import('@/views/wallet-management/wallet-details/WalletDetails.vue'); }
                    }, {
                        path: '/walletCreate',
                        name: 'walletCreate',
                        // @ts-ignore
                        component: function () { return import('@/views/wallet-management/wallet-create/WalletCreate.vue'); }
                    }, {
                        path: '/WalletCreated',
                        name: 'WalletCreated',
                        // @ts-ignore
                        component: function () { return import('@/views/wallet-management/wallet-created/WalletCreated.vue'); }
                    }, {
                        path: '/walletImport',
                        name: 'walletImport',
                        // @ts-ignore
                        component: function () { return import('@/views/wallet-management/wallet-import/WalletImport.vue'); }
                    },
                ]
            }, {
                path: '/communityPanel',
                name: 'communityPanel',
                // @ts-ignore
                component: function () { return import('@/views/community/community-panel/communityPanel.vue'); },
                children: [
                    {
                        path: '/information',
                        name: 'information',
                        // @ts-ignore
                        component: function () { return import('@/views/community/information/information.vue'); }
                    }, {
                        path: '/vote',
                        name: 'vote',
                        // @ts-ignore
                        component: function () { return import('@/views/community/vote/vote.vue'); }
                    },
                ]
            }, {
                path: '/otherPanel',
                name: 'otherPanel',
            }
        ]
    },
];
export default routers;
//# sourceMappingURL=routers.js.map