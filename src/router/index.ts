import Router from 'vue-router'
import routers from '@/router/routers.ts'
import {getObjectLength, localRead} from '@/core/utils/utils.ts'

const router = new Router({
    mode: 'hash',
    routes: routers
})

router.beforeEach((to, from, next) => {
    const hasWallet: boolean = localRead('accountMap') !== ''
        && JSON.parse(localRead('accountMap')) instanceof Object
        && getObjectLength(JSON.parse(localRead('accountMap'))) > 0
    
    const toPath = to.path
    if (!hasWallet && toPath !== '/getStarted') next({ path: '/getStarted' })

    if (!to.name) {
        if (hasWallet) next({ path: '/inputLock' })
        next({ path: '/getStarted' })
    } else {
        next()
    }
})

export default router
