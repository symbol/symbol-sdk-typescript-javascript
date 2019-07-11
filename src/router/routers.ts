// @ts-ignore
const routers = [
    {
        path: '/home',
        name: 'home',
        // @ts-ignore
        component: () => import('@/components/menu-bar/MenuBar.vue'),
        children: [

            {
                path: '/monitorPanel',
                name: 'monitorPanel',
                // @ts-ignore
                component: () => import('@/views/monitor-panel/monitor-panel/MonitorPanel.vue'),
                children: [
                    {
                        path: '/dashBoard',
                        name: 'dashBoard',
                        // @ts-ignore
                        component: () => import('@/views/monitor-panel/monitor-dashboard/MonitorDashBoard.vue')
                    }, {
                        path: '/market',
                        name: 'market',
                        // @ts-ignore
                        component: () => import('@/views/monitor-panel/monitor-market/MonitorMarket.vue')
                    }, {
                        path: '/transfer',
                        name: 'transfer',
                        // @ts-ignore
                        component: () => import('@/views/monitor-panel/monitor-transfer/MonitorTransfer.vue')
                    }, {
                        path: '/receipt',
                        name: 'receipt',
                        // @ts-ignore
                        component: () => import('@/views/monitor-panel/monitor-receipt/MonitorReceipt.vue')
                    },{
                        path: '/remote',
                        name: 'remote',
                        // @ts-ignore
                        component: () => import('@/views/monitor-panel/monitor-dashboard/MonitorDashBoard.vue')
                    },
                ]
            },{
                path:'/walletPanel',
                name:'walletPanel',
                component: () => import('@/views/wallet-management/wallet-panel/WalletPanel.vue'),
                children: [
                    {
                        path: '/walletDetails',
                        name: 'walletDetails',
                        component: () => import('@/views/wallet-management/wallet-details/WalletDetails.vue')
                    },
                    {
                        path: '/walletCreate',
                        name: 'walletCreate',
                        component: () => import('@/views/wallet-management/wallet-create/WalletCreate.vue')
                    },{
                        path: '/WalletCreated',
                        name: 'WalletCreated',
                        component: () => import('@/views/wallet-management/wallet-created/WalletCreated.vue')
                    },{
                        path: '/walletImport',
                        name: 'walletImport',
                        component: () => import('@/views/wallet-management/wallet-import/WalletImport.vue')
                    },
                ]
            }
        ]
    },
]

export default  routers
