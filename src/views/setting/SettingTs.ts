import {Component, Vue} from 'vue-property-decorator'
import router from '@/router/routers.ts'

@Component
export class SettingTs extends Vue {
    currentHeadText = ''
    navigatorList = router[0].children[6].children

    get routeName(){
        return this.$route.name
    }

    // update router
    jumpToView(n) {
        this.$router.push({
            name: n.name
        })
    }

}
