import {Vue, Component} from 'vue-property-decorator'
import {importStepBarTitleList} from "@/config/view"
import routes from '@/router/routers'

@Component
export default class ImportAccountTs extends Vue {
    stepBarTitleList = importStepBarTitleList

    get currentRouterIndex() {
        const {name} = this.$route
        // @ts-ignore
        return routes[0].children[7].children[3].children.findIndex(item => item.name == name) + 1
    }

    getStepTextClassName(index) {
        return Number(this.currentRouterIndex) > index ? 'white' : 'gray'
    }
}
