import Router from 'vue-router'
import routers from '@/router/routers.ts'
import {getObjectLength, localRead} from '@/core/utils/utils.ts'

const router = new Router({
    mode: 'hash',
    routes: routers
})


router.beforeEach((to, from, next) => {
    const accountMap = localRead('accountMap') ? JSON.parse(localRead('accountMap')) : {}
    const toPath = to.path
    const fromPath = from.path
    if (!to.name || (!getObjectLength(accountMap) && toPath !== '/login' && fromPath !== '/login')) {
        next({
            path: '/login'
        })
    } else {
        next()
    }
})

export default router
