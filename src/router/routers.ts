const routers = [
    {
        path: '/home',
        name: 'home',
        component: () => import('@/components/menu-bar/MenuBar.vue'),
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('@/components/menu-bar/MenuBar.vue')
            }
        ]
    },
]

export default  routers
