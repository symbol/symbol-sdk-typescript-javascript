import Router from 'vue-router'
import routers from '@/router/routers.ts'
import {getObjectLength, localRead} from '@/core/utils'

const router = new Router({
    mode: 'hash',
    routes: routers
})

router.beforeEach((to, from, next) => {
    const hasWallet: boolean = localRead('accountMap') !== ''
        && JSON.parse(localRead('accountMap')) instanceof Object
        && getObjectLength(JSON.parse(localRead('accountMap'))) > 0
    const toPath = to.path
    if (!hasWallet && (toPath == '/createAccount' || toPath == '/chooseImportWay')) {
        next()
    }

    if (!to.name) {
        next({path: '/login'})
    } else {
        next()
    }
})
export default router
