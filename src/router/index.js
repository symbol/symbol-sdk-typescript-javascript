import Vue from 'vue';
import Router from 'vue-router';
import routers from './routers';
Vue.use(Router);
var router = new Router({
    mode: 'hash',
    // ts-ignore
    routes: routers
});
router.beforeEach(function (to, from, next) {
    if (!to.name) {
        next({
            path: '/home'
        });
    }
    else {
        next();
    }
});
router.afterEach(function (to, from) {
});
export default router;
//# sourceMappingURL=index.js.map