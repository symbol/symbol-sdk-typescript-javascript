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
                path:'/WalletPanel',
                name:'WalletPanel',
                component: () => import('@/views/wallet-management/wallet-panel/WalletPanel.vue'),
                children: [
                    {
                        path: '/walletDetails',
                        name: 'walletDetails',
                        component: () => import('@/views/wallet-management/wallet-details/walletDetails.vue')
                    },{
                        path: '/WalletCreate',
                        name: 'WalletCreate',
                        component: () => import('@/views/wallet-management/wallet-create/WalletCreate.vue')
                    },{
                        path: '/WalletImport',
                        name: 'WalletImport',
                        component: () => import('@/views/wallet-management/wallet-import/WalletImport.vue')
                    },
                ]
            }
        ]
    },
]

export default  routers
