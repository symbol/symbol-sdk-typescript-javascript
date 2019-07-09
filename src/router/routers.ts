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
                component: () => import('@/views/monitor-panel/MonitorPanel.vue'),
                children: [
                    {
                        path: '/dashBoard',
                        name: 'dashBoard',
                        // @ts-ignore
                        component: () => import('@/views/monitor-panel/dash-board/DashBoard.vue')
                    }, {
                        path: '/market',
                        name: 'market',
                        // @ts-ignore
                        component: () => import('@/views/monitor-panel/dash-board/DashBoard.vue')
                    }, {
                        path: '/transfer',
                        name: 'transfer',
                        // @ts-ignore
                        component: () => import('@/views/monitor-panel/transfer/Transfer.vue')
                    }, {
                        path: '/receipt',
                        name: 'receipt',
                        // @ts-ignore
                        component: () => import('@/views/monitor-panel/dash-board/DashBoard.vue')
                    },{
                        path: '/remote',
                        name: 'remote',
                        // @ts-ignore
                        component: () => import('@/views/monitor-panel/dash-board/DashBoard.vue')
                    },
                ]
            },{
                path:'/WalletPanel',
                name:'WalletPanel',
                // @ts-ignore
                component: () => import('@/views/wallet-management/wallet-panel/WalletPanel.vue'),
                children: [
                    {
                        path: '/walletDetails',
                        name: 'walletDetails',
                        // @ts-ignore
                        component: () => import('@/views/wallet-management/wallet-details/walletDetails.vue')
                    },{
                        path: '/WalletCreate',
                        name: 'WalletCreate',
                        // @ts-ignore
                        component: () => import('@/views/wallet-management/wallet-create/WalletCreate.vue')
                    },{
                        path: '/WalletImport',
                        name: 'WalletImport',
                        // @ts-ignore
                        component: () => import('@/views/wallet-management/wallet-import/WalletImport.vue')
                    },
                ]
            }
        ]
    },
]

export default  routers
