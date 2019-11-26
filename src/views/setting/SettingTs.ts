import {Component, Vue} from 'vue-property-decorator'
import router from '@/router/routers.ts'

@Component
export class SettingTs extends Vue {
    navigatorList = router[0].children[6].children

    get currentHeadText(){
        return this.$route.meta.title
    }
    get routeName(){
        return this.$route.name
    }

    // update router
    jumpToView(n) {
        if (this.$route.matched.map(({path}) => path).includes(n.path)) return

        this.$router.push({
            name: n.name
        }).catch(err => {})
    }
}
