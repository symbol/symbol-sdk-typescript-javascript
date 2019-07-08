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
            },{
                path: '/dashBorad',
                name: 'dashBorad',
                component: () => import('@/views/dash-board/DashBoard.vue')
            },

            {
                path: '/home/',
                name: 'dashBorad',
                component: () => import('@/views/dash-board/DashBoard.vue')
            },
        ]
    },
]

export default  routers
