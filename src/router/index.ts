import Router from 'vue-router'
import routers from '@/router/routers.ts'

const router = new Router({
    mode: 'hash',
    routes: routers
})

router.beforeEach((to, from, next) => {
    if (!to.name) {
        next({
            path: '/login'
        })
    } else {
        next()
    }
})

router.afterEach((to, from) => {

})

export default router
