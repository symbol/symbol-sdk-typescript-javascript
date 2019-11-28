import {Vue, Component} from 'vue-property-decorator'
import {createStepBarTitleList} from "@/config/view"
import routes from "@/router/routers"

@Component
export default class CreateAccountTs extends Vue {
    StepBarTitleList = createStepBarTitleList

    get currentRouterIndex() {
        // @ts-ignore
        const {name} = this.$route
        // @ts-ignore
        return routes[0].children[7].children[2].children.findIndex(item => item.name == name) + 1
    }

    getStepTextClassName(index) {
        return Number(this.currentRouterIndex) > index ? 'white' : 'gray'
    }
}
