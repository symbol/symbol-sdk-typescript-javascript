import Vue from 'vue'
import Router from 'vue-router'
import routers from './routers'

Vue.use(Router)

const router = new Router({
    routes: routers
})

router.beforeEach((to, from, next)=>{

})

router.afterEach((to, from)=>{

})

export default router
