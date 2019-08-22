import Router from 'vue-router'
import routers from '@/router/routers.ts'
import {localRead} from '@/core/utils/utils.ts'

const router = new Router({
    mode: 'hash',
    routes: routers
})


router.beforeEach((to, from, next) => {
    const walletList = localRead('wallets') ? JSON.parse(localRead('wallets')) : []
    const {path} = to
    if (!to.name || (!walletList.length && path !== '/login')) {
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
