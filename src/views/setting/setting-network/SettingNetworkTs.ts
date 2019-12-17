import {Component, Vue} from 'vue-property-decorator'
import {settingNetworkColorConfig} from "@/config/view/setting";



@Component
export class SettingNetworkTs extends Vue {
    pointList = []
    currentEndpoint = {}
    pointerColorList = settingNetworkColorConfig

    selectPoint(index) {

        let list = this.pointList
        list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.currentEndpoint = list[index]
        this.pointList = list
    }

    mounted() {
        this.currentEndpoint = this.pointList[0]
    }

}
