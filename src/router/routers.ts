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
            },
            {
                path: '/home/',
                name: 'dashBorad',
                component: () => import('@/views/monitor-panel/MonitorPanel.vue')
            },
        ]
    },
]

export default routers
