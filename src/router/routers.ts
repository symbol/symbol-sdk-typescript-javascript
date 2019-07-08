const routers = [
    {
        path: '/home',
        name: 'home',
        component: () => import('@/components/menu-bar/MenuBar.vue'),
        children: [
            {
                path: '/dashBorad',
                name: 'dashBorad',
                component: () => import('@/views/dash-board/DashBoard.vue')
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
            },{
                path: '/dashBorad',
                name: 'dashBorad',
                component: () => import('@/views/dash-board/DashBoard.vue')
            },{
                path: '/dashBorad',
                name: 'dashBorad',
                component: () => import('@/views/dash-board/DashBoard.vue')
            },{
                path: '/dashBorad',
                name: 'dashBorad',
                component: () => import('@/views/dash-board/DashBoard.vue')
            }
        ]
    },
]

export default  routers
