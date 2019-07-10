const routers = [
    {
        path: '/home',
        name: 'home',
        component: () => import('@/components/menu-bar/MenuBar.vue'),
        children: [

            {
                path: '/monitorPanel',
                name: 'monitorPanel',
                component: () => import('@/views/monitor-panel/MonitorPanel.vue'),
                children: [
                    {
                        path: '/dashBoard',
                        name: 'dashBoard',
                        component: () => import('@/views/monitor-panel/dash-board/DashBoard.vue')
                    }, {
                        path: '/market',
                        name: 'market',
                        component: () => import('@/views/monitor-panel/dash-board/DashBoard.vue')
                    }, {
                        path: '/transfer',
                        name: 'transfer',
                        component: () => import('@/views/monitor-panel/transfer/Transfer.vue')
                    }, {
                        path: '/receipt',
                        name: 'receipt',
                        component: () => import('@/views/monitor-panel/dash-board/DashBoard.vue')
                    },{
                        path: '/remote',
                        name: 'remote',
                        component: () => import('@/views/monitor-panel/dash-board/DashBoard.vue')
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
                    },{
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
