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
                // @ts-ignore
                component: () => import('@/views/wallet-management/wallet-panel/WalletPanel.vue'),
                children: [
                    {
                        path: '/walletDetails',
                        name: 'walletDetails',
                        // @ts-ignore
                        component: () => import('@/views/wallet-management/wallet-details/WalletDetails.vue')
                    }, {
                        path: '/walletCreate',
                        name: 'walletCreate',
                        // @ts-ignore
                        component: () => import('@/views/wallet-management/wallet-create/WalletCreate.vue')
                    },{
                        path: '/WalletCreated',
                        name: 'WalletCreated',
                        // @ts-ignore
                        component: () => import('@/views/wallet-management/wallet-created/WalletCreated.vue')
                    },{
                        path: '/walletImport',
                        name: 'walletImport',
                        // @ts-ignore
                        component: () => import('@/views/wallet-management/wallet-import/WalletImport.vue')
                    },
                ]
            },{
                path:'/otherPanel',
                name:'otherPanel',
            },{
                path:'/communityPanel',
                name:'communityPanel',
                // @ts-ignore
                component: () => import('@/views/community/community-panel/communityPanel.vue'),
                children: [
                    {
                        path: '/information',
                        name: 'information',
                        // @ts-ignore
                        component: () => import('@/views/community/information/information.vue')
                    },{
                        path: '/vote',
                        name: 'vote',
                        // @ts-ignore
                        component: () => import('@/views/community/vote/vote.vue')
                    },
                ]
            }
        ]
    },
]

export default  routers
