import Vue from 'vue'
import Router from 'vue-router'
import routers from './routers'

Vue.use(Router)

const router = new Router({
    mode:'hash',
    routes: routers
})

router.beforeEach((to, from, next)=>{
    if(!to.name){
        next({
            path: '/home'
        })
    }else {
        next()
    }
})

router.afterEach((to, from)=>{

})

export default router
